using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

internal static class Program
{
    [DllImport("user32.dll")] static extern bool SetProcessDpiAwarenessContext(IntPtr value);
    [STAThread] static void Main(string[] args)
    {
        if (args.Length != 4 || !int.TryParse(args[0], out int pid) ||
            !int.TryParse(args[1], out int x) || !int.TryParse(args[2], out int y) ||
            !long.TryParse(args[3], out long owner)) return;
        try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch (EntryPointNotFoundException) { }
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new TvWindow(pid, x, y, new IntPtr(owner)));
    }
}

internal sealed class TvWindow : Form
{
    [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr hwnd);
    [DllImport("user32.dll")] static extern bool PostMessage(IntPtr hwnd, uint msg, IntPtr wp, IntPtr lp);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr hwnd);
    [DllImport("user32.dll")] static extern bool ReleaseCapture();
    [DllImport("user32.dll")] static extern IntPtr SendMessage(IntPtr hwnd, int msg, IntPtr wp, IntPtr lp);
    [DllImport("user32.dll")] static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);

    [StructLayout(LayoutKind.Sequential)]
    struct AccentPolicy { public int AccentState, AccentFlags, GradientColor, AnimationId; }
    [StructLayout(LayoutKind.Sequential)]
    struct WindowCompositionAttributeData { public int Attribute; public IntPtr Data; public int SizeOfData; }

    const int WM_NCHITTEST = 0x0084, WM_NCLBUTTONDOWN = 0x00A1, HTCAPTION = 2;
    const int HTLEFT = 10, HTRIGHT = 11, HTTOP = 12, HTTOPLEFT = 13, HTTOPRIGHT = 14;
    const int HTBOTTOM = 15, HTBOTTOMLEFT = 16, HTBOTTOMRIGHT = 17;

    readonly int parentPid;
    readonly IntPtr pill;
    readonly Timer life = new Timer { Interval = 300 };
    readonly Timer animation = new Timer { Interval = 15 };
    readonly WebView2 web = new WebView2();
    readonly Label status = new Label();
    readonly int targetHeight;
    readonly int targetWidth, targetX, startX, startWidth;
    readonly float scale;
    int frame;

    public TvWindow(int pid, int center, int top, IntPtr input)
    {
        parentPid = pid; pill = input;
        scale = Math.Max(1f, GetDpiForWindow(input) / 96f);
        var screen = Screen.FromPoint(new Point(center, top)).WorkingArea;
        int width = Math.Min((int)(720 * scale), screen.Width - 20);
        targetHeight = Math.Min((int)(620 * scale), screen.Height - 40);
        int y = Math.Max(screen.Top, Math.Min(top, screen.Bottom - targetHeight - 8));
        int x = Math.Max(screen.Left + 8, Math.Min(center - width / 2, screen.Right - width - 8));

        Text = "Pebbly Live"; FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false; TopMost = true; StartPosition = FormStartPosition.Manual;
        AutoScaleMode = AutoScaleMode.None; BackColor = Color.FromArgb(10, 11, 15);
        Padding = System.Windows.Forms.Padding.Empty;
        targetWidth = width; targetX = x;
        startWidth = Math.Min(width, (int)(220 * scale));
        startX = Math.Max(screen.Left, Math.Min(center - startWidth / 2, screen.Right - startWidth));
        Bounds = new Rectangle(startX, y, startWidth, (int)(32 * scale));

        web.Dock = DockStyle.Fill; web.DefaultBackgroundColor = Color.Transparent;
        status.Dock = DockStyle.Fill; status.ForeColor = Color.FromArgb(190, 194, 204);
        status.BackColor = Color.Transparent; status.TextAlign = ContentAlignment.MiddleCenter; status.Text = "Pebbly Live";
        Controls.Add(status); Controls.Add(web); status.BringToFront();

        HandleCreated += (s,e) => EnableBlur();
        Resize += (s,e) => RoundCorners();
        Shown += async (s,e) => {
            animation.Start();
            try {
                string profile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Pebbly", "TV-WebView");
                var env = await CoreWebView2Environment.CreateAsync(null, profile);
                if (IsDisposed) return;
                await web.EnsureCoreWebView2Async(env);
                if (IsDisposed) return;
                web.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                web.CoreWebView2.Settings.AreDevToolsEnabled = false;
                web.CoreWebView2.Settings.AreHostObjectsAllowed = false;
                web.CoreWebView2.PermissionRequested += (sender, ev) => ev.State = CoreWebView2PermissionState.Deny;
                web.CoreWebView2.NewWindowRequested += (sender, ev) => ev.Handled = true;
                web.CoreWebView2.NavigationStarting += (sender, ev) => {
                    if (!Uri.TryCreate(ev.Uri, UriKind.Absolute, out var url) || url.Host != "pebbly-tv.local") ev.Cancel = true;
                };
                web.CoreWebView2.SetVirtualHostNameToFolderMapping("pebbly-tv.local",
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tv"), CoreWebView2HostResourceAccessKind.DenyCors);
                web.CoreWebView2.WebMessageReceived += (sender, ev) => {
                    if (!ev.Source.StartsWith("https://pebbly-tv.local/", StringComparison.Ordinal)) return;
                    string command;
                    try { command = ev.TryGetWebMessageAsString(); } catch { return; }
                    if (command == "next") SendWheel(-120);
                    if (command == "previous") SendWheel(120);
                    if (command == "toggle-size") ToggleSize();
                    if (command == "drag") { ReleaseCapture(); SendMessage(Handle, WM_NCLBUTTONDOWN, new IntPtr(HTCAPTION), IntPtr.Zero); }
                    if (command == "close") Close();
                };
                web.CoreWebView2.NavigationCompleted += (sender, ev) => {
                    if (ev.IsSuccess) { status.Visible = false; web.Visible = true; }
                    else status.Text = "Could not open the player";
                };
                web.CoreWebView2.Navigate("https://pebbly-tv.local/index.html");
            } catch (WebView2RuntimeNotFoundException) {
                status.Text = "Microsoft Edge WebView2 is unavailable";
            } catch (Exception ex) {
                status.Text = "TV: " + ex.Message;
            }
        };
        animation.Tick += (s,e) => {
            frame++;
            double t = Math.Min(1.0, frame / 16.0);
            double k = 1 - Math.Pow(1-t, 3);
            Bounds = new Rectangle((int)(startX + (targetX-startX)*k), Top,
                (int)(startWidth + (targetWidth-startWidth)*k),
                (int)(32 * scale + (targetHeight - 32 * scale)*k));
            if (t >= 1) {
                animation.Stop();
                MinimumSize = new Size((int)(560 * scale), (int)(470 * scale));
            }
        };
        life.Tick += (s,e) => {
            try { if (Process.GetProcessById(parentPid).HasExited || !IsWindowVisible(pill)) Close(); }
            catch { Close(); }
        };
        life.Start();
        KeyPreview = true; KeyDown += (s,e) => { if (e.KeyCode == Keys.Escape) Close(); };
        RoundCorners();
    }

    void ToggleSize()
    {
        WindowState = WindowState == FormWindowState.Maximized ? FormWindowState.Normal : FormWindowState.Maximized;
        RoundCorners();
    }

    void EnableBlur()
    {
        var accent = new AccentPolicy {
            AccentState = 4,
            AccentFlags = 0,
            GradientColor = unchecked((int)0x6618171D),
            AnimationId = 0
        };
        int size = Marshal.SizeOf(accent);
        IntPtr pointer = Marshal.AllocHGlobal(size);
        try {
            Marshal.StructureToPtr(accent, pointer, false);
            var data = new WindowCompositionAttributeData { Attribute = 19, Data = pointer, SizeOfData = size };
            SetWindowCompositionAttribute(Handle, ref data);
        } catch { } finally { Marshal.FreeHGlobal(pointer); }
    }

    void Wheel(object sender, MouseEventArgs e) { SendWheel(e.Delta); }
    void SendWheel(int delta)
    {
        PostMessage(pill, 0x020A, new IntPtr((long)(delta & 0xffff) << 16), IntPtr.Zero);
    }

    protected override void WndProc(ref Message m)
    {
        base.WndProc(ref m);
        if (m.Msg != WM_NCHITTEST || WindowState != FormWindowState.Normal || frame < 16) return;
        Point p = PointToClient(Cursor.Position);
        int grip = Math.Max(6, (int)(7 * scale));
        bool left = p.X <= grip, right = p.X >= ClientSize.Width-grip;
        bool top = p.Y <= grip, bottom = p.Y >= ClientSize.Height-grip;
        if (left && top) m.Result = new IntPtr(HTTOPLEFT);
        else if (right && top) m.Result = new IntPtr(HTTOPRIGHT);
        else if (left && bottom) m.Result = new IntPtr(HTBOTTOMLEFT);
        else if (right && bottom) m.Result = new IntPtr(HTBOTTOMRIGHT);
        else if (left) m.Result = new IntPtr(HTLEFT);
        else if (right) m.Result = new IntPtr(HTRIGHT);
        else if (top) m.Result = new IntPtr(HTTOP);
        else if (bottom) m.Result = new IntPtr(HTBOTTOM);
    }

    void RoundCorners()
    {
        if (WindowState == FormWindowState.Maximized) { var oldMax = Region; Region = null; oldMax?.Dispose(); return; }
        int d = Math.Min((int)(48 * scale), Math.Min(Width, Height));
        if (d <= 0) return;
        using (var path = new GraphicsPath()) {
            path.AddArc(0,0,d,d,180,90); path.AddArc(Width-d,0,d,d,270,90);
            path.AddArc(Width-d,Height-d,d,d,0,90); path.AddArc(0,Height-d,d,d,90,90);
            path.CloseFigure(); var old = Region; Region = new Region(path); old?.Dispose();
        }
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing) { life.Dispose(); animation.Dispose(); web.Dispose(); }
        base.Dispose(disposing);
    }
}