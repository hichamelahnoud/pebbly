# Pebbly Top Island (custom build)

Quit any running copy of Pebbly. Extract the entire ZIP into one folder and run
START-TOP.bat (or pebbly.exe). Keep pebbly-settings.exe beside pebbly.exe.
No Rust, Visual Studio, or build tools are required to run the downloaded app.

The pill floats at the top centre of the main taskbar's monitor. Click to expand
downward; move the mouse away to collapse. Existing fullscreen settings still apply.
To use the old taskbar placement, quit Pebbly and run START-TASKBAR.bat.

This is an independent, unsigned custom build, not an official Pebbly release.
Compilation and layout tests do not replace interactive Windows testing.
It preserves Pebbly's existing card design and is not an exact NOVA Island clone.

Settings are shared with the official app. If Start with Windows is enabled,
Pebbly updates that entry to the last copy run. An official in-app update can
replace this custom build: do not use that updater for this fork.

Modified source: https://github.com/hichamelahnoud/pebbly
Upstream: https://github.com/nixesty/pebbly
Copyright 2026 nixesty; GPL-3.0-only. See LICENSE and the upstream asset notices.


## Clock, weather and television

The black capsule shows weather on the left and the local clock on the right.
Use the mouse wheel over the capsule to cycle through weather/clock, TV, and
active activities. Click TV / TNT to open the television panel below it. The
panel stays open while watching; close it with ×, Escape, another capsule click,
or switch activities by scrolling over the panel header. Channel lists scroll
normally. Fullscreen hiding and closing Pebbly also close its TV panel.

TNT contains the public Moroccan player/stream links from the earlier NOVA kit.
Availability depends on each broadcaster and the user's region; live playback
has not been verified on every channel. IPTV accepts your HTTP/HTTPS stream
URLs and imports M3U or the NOVA JSON channel list. Channels stay in the local
Pebbly TV profile. The companion uses Windows .NET Framework 4.8 and the
Microsoft Edge WebView2 runtime normally installed on Windows. If WebView2 is
missing, it displays an explanation and does not install anything automatically.

Keep every file in the portable ZIP together, including pebbly-tv.exe, the
Microsoft.Web.WebView2 DLLs and the tv directory. No compiler installation is
required. HLS.js is included under its bundled license; WebView2's SDK files are
provided under Microsoft's NuGet package license.
