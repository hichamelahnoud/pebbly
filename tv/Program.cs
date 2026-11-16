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

    public TvWindow(int pid, int center, int bottom, IntPtr input)
    {
        parentPid = pid; pill = input;
        scale = Math.Max(1f, GetDpiForWindow(input) / 96f);
        var screen = Screen.FromPoint(new Point(center, bottom)).WorkingArea;
        int width = Math.Min((int)(560 * scale), screen.Width - 16);
        targetHeight = Math.Min((int)(480 * scale), screen.Height - 64);
        int y = Math.Max(screen.Top, Math.Min(bottom, screen.Bottom - targetHeight - 8));
        int x = Math.Max(screen.Left + 8, Math.Min(center - width / 2, screen.Right - width - 8));
        Text = "Pebbly TV"; FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false; TopMost = true; StartPosition = FormStartPosition.Manual;
        AutoScaleMode = AutoScaleMode.None; BackColor = Color.FromArgb(5, 5, 7);
        targetWidth = width; targetX = x;
        startWidth = Math.Min(width, (int)(220 * scale));
        startX = Math.Max(screen.Left, Math.Min(center - startWidth / 2, screen.Right - startWidth));
        Bounds = new Rectangle(startX, y, startWidth, (int)(32 * scale));
        var header = new Panel { Dock = DockStyle.Top, Height = (int)(42 * scale), BackColor = BackColor };
        var title = new Label { Text = "TV / TNT", AutoSize = false, Dock = DockStyle.Left,
            Width = (int)(132 * scale), TextAlign = ContentAlignment.MiddleCenter,
            ForeColor = Color.White, Font = new Font("Segoe UI", 10, FontStyle.Bold) };
        var hint = new Label { Text = "Scroll here to switch activities", Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleCenter, ForeColor = Color.FromArgb(120, 120, 130),
            Font = new Font("Segoe UI", 8) };
        var close = new Button { Text = "×", Dock = DockStyle.Right, Width = (int)(44 * scale),
            FlatStyle = FlatStyle.Flat, ForeColor = Color.White, BackColor = BackColor, TabStop = false };
        close.FlatAppearance.BorderSize = 0; close.Click += (s,e) => Close();
        header.Controls.Add(hint); header.Controls.Add(title); header.Controls.Add(close);
        header.MouseWheel += Wheel; title.MouseWheel += Wheel; hint.MouseWheel += Wheel;
        header.MouseEnter += (s,e) => header.Focus();
        web.Dock = DockStyle.Fill; web.DefaultBackgroundColor = BackColor;
        status.Dock = DockStyle.Fill; status.ForeColor = Color.LightGray;
        status.TextAlign = ContentAlignment.MiddleCenter; status.Text = "Opening television…";
        Controls.Add(status); Controls.Add(web); Controls.Add(header); status.BringToFront(); header.BringToFront();
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
                    if (command == "close") Close();
                };
                web.CoreWebView2.NavigationCompleted += (sender, ev) => {
                    if (ev.IsSuccess) { status.Visible = false; web.Visible = true; }
                    else status.Text = "The TV interface could not open. Extract the entire ZIP again.";
                };
                web.CoreWebView2.Navigate("https://pebbly-tv.local/index.html");
            } catch (WebView2RuntimeNotFoundException) {
                status.Text = "Microsoft Edge WebView2 is not available on this Windows installation.\nThe clock, weather and other Pebbly activities still work.\nNo installation was started.";
            } catch (Exception ex) {
                status.Text = "TV could not start: " + ex.Message;
            }
        };
        animation.Tick += (s,e) => {
            frame++;
            double t = Math.Min(1.0, frame / 16.0);
            double k = 1 - Math.Pow(1-t, 3);
            Bounds = new Rectangle((int)(startX + (targetX-startX)*k), Top,
                (int)(startWidth + (targetWidth-startWidth)*k),
                (int)(32 * scale + (targetHeight - 32 * scale)*k));
            if (t >= 1) animation.Stop();
        };
        life.Tick += (s,e) => {
            try { if (Process.GetProcessById(parentPid).HasExited || !IsWindowVisible(pill)) Close(); }
            catch { Close(); }
        };
        life.Start();
        KeyPreview = true; KeyDown += (s,e) => { if (e.KeyCode == Keys.Escape) Close(); };
        RoundCorners();
    }
    void Wheel(object sender, MouseEventArgs e) { SendWheel(e.Delta); }
    void SendWheel(int delta)
    {
        PostMessage(pill, 0x020A, new IntPtr((long)(delta & 0xffff) << 16), IntPtr.Zero);
        // The parent owns the child and closes it while switching activities.
    }
    void RoundCorners()
    {
        int d = Math.Min((int)(48 * scale), Math.Min(Width, Height));
        if (d <= 0) return;
        using (var path = new GraphicsPath()) {
            path.AddArc(0, 0, d, d, 180, 90); path.AddArc(Width-d, 0, d, d, 270, 90);
            path.AddArc(Width-d, Height-d, d, d, 0, 90); path.AddArc(0, Height-d, d, d, 90, 90);
            path.CloseFigure(); var old = Region; Region = new Region(path); old?.Dispose();
        }
    }
    protected override void Dispose(bool disposing)
    {
        if (disposing) { life.Dispose(); animation.Dispose(); web.Dispose(); }
        base.Dispose(disposing);
    }
}
