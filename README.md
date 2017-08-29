# stn-event-photos

Simple STN Event Photo viewer.

.

## Stack
- jQuery
- CSS (No SASS or LESS)
- [flexboxgrid.css](http://flexboxgrid.com/)

## Development
- No npm/gulp/bower/etc.
- To run, simply open `index.html`
- For faster development, use a live reload/server plugin with your text editor:
    - VS Code Plugin: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
    - Atom Plugin: https://atom.io/packages/atom-live-server


## Deployment
- Copy files then minify (if desired - not required)
- Upload `index.html`, `/media`, and `/src` to S3. No build process required. 



.


### FILE BREAKDOWN
- `index.html`: Main web page
- `/media`: Static image files (Logos, icons, favicon, etc)
- `/src/scripts`: Javascript files
    - `/vendor`: Javascript Vendor files (JQuery) **DO NOT EDIT**
    - `onload.js`: JQuery called on page load
    - `services.js`: Loading images
    - `ui.js`: Javascript UI Control (Popups, etc)
- `/src/styles`: Stylesheets (CSS)
    - `/vendor`: Vendor stylesheets & Libraries **(DO NOT EDIT)**
    - `app.css`: All styles for the app. Will break down into smaller files if it gets too big. **ONLY EDIT THIS FILE**


