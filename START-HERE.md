# Install the Moonlight OS design upgrade

This ZIP contains your updated project for your existing website:
https://night-window.onrender.com

## Update your site

1. Download and extract MOONLIGHT-OS-Render.zip.
2. Open https://github.com/MrRandy18/Scramjet-App.
3. Upload the contents of the extracted MOONLIGHT-OS-Render folder into the root of your repository. Replace matching files. Upload the files inside the folder, not the ZIP or the outer folder itself.
4. Include public, src, package.json, package-lock.json, Dockerfile, README.md, LICENSE, and START-HERE.md. The new public/atmosphere.js is required for the animated ocean.
5. Commit the changes with a message such as Upgrade Moonlight OS design and animations.
6. Wait for your Render service to finish deploying. If it does not start automatically, choose Manual Deploy, then Deploy latest commit.
7. Open your site and press Ctrl+Shift+R to refresh its files.

If folder dragging fails, upload the root files first. Then upload the contents of public into your repository's public folder and the contents of src into its src folder. Preserve public/assets and public/scramjet.

## See the new entrance

Press Enter or click Enter Moonlight on the welcome screen. The title fades away, the scene eases forward, and the desktop and dock appear in sequence.

The welcome screen still appears once per browser-tab session. To replay it after updating, choose Personalize on the desktop, then Replay welcome animation. You can also open Welcome in the app launcher.

## What changed

- Redesigned welcome screen with larger typography and a glowing Enter button.
- A smooth transition from the welcome screen to the desktop.
- Your original blue crescent and ocean picture, with animated water, soft reflections, subtle pointer movement, and stars.
- A cleaner desktop with a larger clock, greetings, shortcuts, and open space around the moon.
- A glass dock with animated icons, hover labels, and running indicators.
- Matching browser tabs, address bar, new-tab page, notes, settings, wallpaper gallery, and app launcher.
- Animated window opening and closing, with safe handling for rapid reopening.
- Layouts for phones, tablets, and larger screens.
- Live atmosphere and interface motion controls in Personalize.

Click Live atmosphere near the bottom of the desktop to switch between animated and still backgrounds. Your device's reduced-motion setting also stops animations.

The ocean animation runs in your browser from the existing image. It does not require a video file or a new service. If your browser cannot run the graphics effect, the original picture remains visible. The atmosphere pauses when the tab is hidden.

## Your Render settings

Runtime: Docker
Branch: main
Root directory: blank
Dockerfile path: ./Dockerfile

Keep the service as a Node/Docker web service. The existing browser uses its server and WebSocket relay. No new environment variables or runtime dependencies are required.

Settings, notes, bookmarks, and wallpaper uploads stay on the same device and website address. The update retains the original local storage keys. Changing your website address does not transfer that browser data.

The browser still supports up to eight tabs, Scramjet, and Basic. This update does not change the proxy engines or the server configuration. Website compatibility still depends on the existing engines.

## Checks completed

JavaScript syntax and local asset references passed. Nine simulated interaction checks passed for welcome focus, Enter timing, repeat clicks, reduced motion, unavailable storage, replay, and window transitions. The ocean shaders compiled, linked, and produced changing image frames.

This package has not been deployed to your Render account. A real-browser visual review and live proxy browsing test were unavailable in this environment.

## Moonlight atmosphere update

This version adds a gentle ten-second moon pulse, a breathing cyan halo, slowly drifting clouds, and water reflections that brighten with the moon. Motion controls and reduced-motion support still apply.

Small doorway references appear in the original Enter icon, numbered browser-tab badges, and the line “Another door. Another discovery.” Main titles use a restrained Georgia serif style. Search fields and everyday controls retain the readable sans-serif font. These additions use original interface graphics and system fonts.

Install this ZIP using the same steps above. Refresh with Ctrl+Shift+R after deploying. To replay the entrance, choose Personalize, then Replay welcome animation.
