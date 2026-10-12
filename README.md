# MOONLIGHT OS

An animated moonlit desktop browser based on the user's Scramjet-App deployment. See [START-HERE.md](START-HERE.md) for the GitHub and Render upload steps.

## Desktop 02 update

The original moonlit ocean artwork now has gentle animated water, changing reflections, soft glow, subtle pointer depth, and stars. The interface has a new welcome screen, a coordinated Enter transition, a cleaner desktop, an animated dock, and matching browser, launcher, and settings windows.

The new `public/atmosphere.js` runs without a new dependency. It caps the ocean at approximately 30 frames per second, limits render resolution, and stops drawing when the tab is hidden. Unsupported graphics fall back to the original wallpaper. The system reduced-motion preference and Appearance controls disable motion. Wallpaper uploads, settings, notes, and bookmarks use the original storage keys.

## Run

Use Node 22 or later.

```
npm install
npm start
```

Open http://localhost:8080. Use HTTPS on an external host. Service workers require HTTPS except on localhost.

```
npm run check
```

The Dockerfile installs production dependencies and starts `src/index.js`. `PORT` defaults to 8080. The app serves its own frontend and Wisp relay. It has no ChatGPT Sites runtime dependency.

## Source

- `public/index.html`, `public/app.css`, `public/app.js`: original MOONLIGHT OS desktop and browser shell.
- `public/atmosphere.js`: animated ocean renderer with a still-image fallback.
- `public/scramjet/sw.js`: narrow-scope Scramjet worker.
- `public/sw.js`: compatible worker for users upgrading from the original demo.
- `src/index.js`: Fastify static hosting and the upstream Wisp server, with Basic and health routes.
- `src/basic.js`: basic public webpage reader with scripts/forms disabled and public-address validation.
- `public/night-window-source.zip`: corresponding source download linked from Settings.

Dependencies are installed from `package-lock.json`. The original `pnpm-lock.yaml` from the fork is not used by this Dockerfile. Use npm for this version.

The existing upstream Wisp relay configuration is preserved, including its DNS settings and hostname blacklist. If you change those settings, review the Wisp documentation.

## Credits and license

Built on [Mercury Workshop Scramjet-App](https://github.com/MercuryWorkshop/Scramjet-App), forked at https://github.com/MrRandy18/Scramjet-App. Original Scramjet-App license and third-party credits are retained in `LICENSE` and `public/credits.html`. MOONLIGHT OS additions in this package are offered under the same AGPL-3.0 license. Changes dated 2026-10-11.

Proxy engines and transport: Scramjet, Bare Mux, Libcurl Transport, and Wisp by their respective contributors. Dependencies retain their own licenses.

Visual direction references the CINE OS screenshots supplied by the user. MOONLIGHT OS is independent and unaffiliated. The galaxy wallpaper comes from the user's existing MOONLIGHT OS project. No CINE or Figure logos, code, game catalog, account system, or paid assets were copied.

Moonlight theme: user-supplied Bluelight crescent used for branding. Ocean wallpaper generated from that reference with the built-in image tool: an angular blue crescent shining over a dark ocean with cyan reflections.

## Checks for this update

JavaScript syntax and static asset references passed. Nine simulated interaction checks covered welcome focus, Enter timing, repeat activation, reduced motion, unavailable storage, replay, and close/reopen races. The ocean shaders compiled and linked in an OpenGL ES test context, and two rendered frames confirmed that the artwork animates.

A real-browser visual review, a live proxy browsing test, and deployment to Render were not performed in this environment. Server and proxy source files are unchanged.

## Moonlight atmosphere update

This version adds a gentle ten-second moon pulse, a breathing cyan halo, slowly drifting clouds, and water reflections that brighten with the moon. Motion controls and reduced-motion support still apply.

Small doorway references appear in the original Enter icon, numbered browser-tab badges, and the line “Another door. Another discovery.” Main titles use a restrained Georgia serif style. Search fields and everyday controls retain the readable sans-serif font. These additions use original interface graphics and system fonts.

Install this ZIP using the same steps above. Refresh with Ctrl+Shift+R after deploying. To replay the entrance, choose Personalize, then Replay welcome animation.
