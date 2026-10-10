# KNIGHT-OS

A standalone galaxy desktop browser based on the user's Scramjet-App deployment. See [START-HERE.md](START-HERE.md) for the GitHub and Render upload steps.

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

- `public/index.html`, `public/app.css`, `public/app.js`: original KNIGHT-OS desktop and browser shell.
- `public/scramjet/sw.js`: narrow-scope Scramjet worker.
- `public/sw.js`: compatible worker for users upgrading from the original demo.
- `src/index.js`: Fastify static hosting and the upstream Wisp server, with Basic and health routes.
- `src/basic.js`: basic public webpage reader with scripts/forms disabled and public-address validation.
- `public/night-window-source.zip`: corresponding source download linked from Settings.

Dependencies are installed from `package-lock.json`. The original `pnpm-lock.yaml` from the fork is not used by this Dockerfile. Use npm for this version.

The existing upstream Wisp relay configuration is preserved, including its DNS settings and hostname blacklist. If you change those settings, review the Wisp documentation.

## Credits and license

Built on [Mercury Workshop Scramjet-App](https://github.com/MercuryWorkshop/Scramjet-App), forked at https://github.com/MrRandy18/Scramjet-App. Original Scramjet-App license and third-party credits are retained in `LICENSE` and `public/credits.html`. KNIGHT-OS additions in this package are offered under the same AGPL-3.0 license. Changes dated 2026-10-10.

Proxy engines and transport: Scramjet, Bare Mux, Libcurl Transport, and Wisp by their respective contributors. Dependencies retain their own licenses.

Visual direction references the CINE OS screenshots supplied by the user. KNIGHT-OS is independent and unaffiliated. The galaxy wallpaper comes from the user's existing KNIGHT-OS project. No CINE or Figure logos, code, game catalog, account system, or paid assets were copied.
