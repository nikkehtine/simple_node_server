# Simple Node browser project

As of now it serves static webpages, but I will think about what else I could implement

## Features

-   Supports TypeScript
-   No dependencies other than TypeScript, Node and nodemon
-   Automatically reruns the server on changes in dev mode

## Folder structure

-   `site` - the location of the actual site and where all public files are located
    -   `script` - the output folder for TypeScript compiled files
-   `src` - the location of (input) TypeScript files

## Usage

-   `(p)npm dev` or `nodemon` - runs development server
-   `(p)npm build` or `tsc` - builds TypeScript files for the frontend
-   `(p)npm start` or `node server.js` - just runs the server
