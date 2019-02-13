# Gulp 4 Basic build process
This is a basic build process setup that can be used as a starting point for a simple project.

## Supporting
- ES6 transpiling and module bundling (Using Webpack)
- Image minification
- SCSS to CSS with minification, autoprefixer & sourcemaps
- BrowserSync
- Separate development and production flags for different builds

## Get started
- Clone project
- NPM install
- Run: `npm run dev` to start a development server with BrowserSync
- Run: `npm run prod` to build production ready assets

## Note
- The index file points to the development version of the assets, so to load the production assets you need to change script and link tag to point to the *.min versions.
