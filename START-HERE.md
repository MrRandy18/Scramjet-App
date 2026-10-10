# Move KNIGHT-OS to your existing Render website

You already have GitHub and Render connected. This package replaces the plain Scramjet demo with the redesigned KNIGHT-OS desktop.

Your address stays: https://night-window.onrender.com

## Do this

1. Extract `KNIGHT-OS-Render.zip` on your computer. Open the extracted folder.
2. Open https://github.com/MrRandy18/Scramjet-App in your browser. Stay on the main page of the repository, not inside the public folder.
3. Click **Add file → Upload files**.
4. Drag the files and folders from INSIDE the extracted folder into GitHub. Include `public`, `src`, `package.json`, `package-lock.json`, and `Dockerfile`. Do not upload the ZIP or the outer folder itself. If your browser refuses folders, use the folder upload instructions below.
5. Enter `Install KNIGHT-OS desktop` as the commit message and click **Commit changes** on the main branch.
6. Open your Night-Window service on Render. It normally deploys automatically. Otherwise click **Manual Deploy → Deploy latest commit**.
7. Wait for **Live**, then open https://night-window.onrender.com and press Ctrl+Shift+R once to refresh old files.

Click **Open your browser** or the globe in the dock. Enter a website in the search bar. Scramjet is selected by default.

If GitHub asks whether to replace an existing file, replace it with the version from this package. Keep all your files at the repository root as shown below. Your other old demo files can remain. The new index page does not load them.

## If folder dragging does not work

Upload the root files first: Dockerfile, package.json, package-lock.json, README.md, LICENSE, and START-HERE.md.

Then open `public` in GitHub and upload the CONTENTS of the extracted `public` folder. Preserve its `assets` and `scramjet` subfolders. Open `src` in GitHub and upload the contents of the extracted `src` folder.

The file `public/index.html` must remain exactly at that path. Do not create `Scramjet-App/KNIGHT-OS-Render/public/index.html`.

## What changed

- Screenshot-guided CINE-inspired desktop with original KNIGHT-OS branding.
- Centered welcome screen, compact dock, weekday/time display, and right-side widgets.
- Wallpaper studio with six presets, separate desktop/welcome backgrounds, and local image/video uploads (up to 20 MB).
- Live clock, floating windows, minimize/restore, maximize, and a bottom dock.
- Up to eight browser tabs. Minimized windows preserve their pages.
- Scramjet runs inside KNIGHT-OS. Its Wisp relay uses the SAME Render server.
- KNIGHT-OS Basic remains available for simple pages.
- Ultraviolet stays marked as not installed.
- Bookmarks and recent pages, local notes, app launcher, and quick links.
- Galaxy, Midnight, Aurora, Ember, Glacier, and Void wallpaper choices, three accents, 12/24-hour clock, and reduced-motion support.
- Google or DuckDuckGo search, local data export, and clear recent pages.
- Responsive layout with a compact mobile dock.
- No ChatGPT login or ChatGPT Sites connection is required.

## Keep these Render settings

Runtime: Docker
Branch: main
Root directory: blank
Dockerfile path: ./Dockerfile
No new environment variables are required.

The app listens on the PORT supplied by Render and binds to 0.0.0.0. Render handles HTTPS. The Docker image uses Node 22. Do not switch this service to a static site: the proxy needs the Node server and WebSockets.

## Useful details

This does not automatically copy your old ChatGPT Site’s browser data. Settings, notes, bookmarks, and history are stored locally on each website origin and each device. The original ChatGPT Site is unchanged.

The browser Close button hides its window and retains tabs for this session. Reloading the entire KNIGHT-OS site starts new tabs. The recent-pages list lets you return to pages.

A free Render service can sleep after inactivity. Its next visit can take around a minute to start. Website compatibility still varies. DRM-protected video, some sign-ins, and sites that reject proxies are not guaranteed to work.

The supplied screenshots guided the welcome screen, wallpaper-led desktop, smaller dock, right sidebar, and wallpaper gallery. This remains an original KNIGHT-OS design. The exact illustrated wallpapers in the video are not included. You can upload your own in Settings → Appearance.

The welcome screen appears once per browser-tab session. Select Welcome from the launcher to view it again. This is a welcome screen, not a password lock. Custom wallpaper media saves in IndexedDB on your device. The JSON data export does not include media. Videos play muted, and motion preferences are respected.

The KNIGHT-OS name does not automatically rename your Render URL. The same existing night-window.onrender.com address continues to work.

## If something fails

- Build failed: open the latest Render deployment and send the first actual error line or a screenshot.
- Old Scramjet demo still appears: check that the commit replaced `public/index.html`, wait for the latest deployment to show Live, then press Ctrl+Shift+R.
- Engine files fail to load: confirm the Docker deployment installed dependencies. `/health` should show status `ok`.
- A page stays loading: wait for Render to wake up and press the browser’s Reload button. Try a simple public page before testing complex sites.

## Validation completed

JavaScript syntax, HTTP route checks, asset loading, Basic input validation and HTML sanitization, and simulated DOM interactions for tabs, in-page engine routing, bookmarks, notes, themes, and window state passed. These checks did not include a real-browser visual review or a deployment to your Render account. Scramjet itself uses the same 1.1.0 engine version that worked in your current deployment.
