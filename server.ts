import http from "http";
import fs from "fs";
import path from "path";
import exec from "child_process";

const hostname = "127.0.0.1";
const port = 6953;

const siteDir = "./site";
const tsDir = "./src";
const notFound = path.join(siteDir, "404.html");

const data404 = fs.readFileSync(notFound);

fs.watch(tsDir, () => {
    exec.execSync("tsc --project tsconfig.scripts.json");
});

const server: http.Server = http.createServer((req, res) => {
    // Handling requests
    if (req.url == undefined) return;
    let requestPath: string = path.join(siteDir, req.url);
    if (req.url === "/") {
        requestPath = path.join(siteDir, "index.html");
    }
    if (path.extname(requestPath) === "") {
        requestPath += ".html";
    }
    let ext = path.extname(requestPath);

    let type: { [key: string]: string } = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".ico": "image/x-icon",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".wav": "audio/wav",
    };
    let contentType: string = type[ext] || "text/plain";

    console.log(`Requested: ${requestPath} (${contentType})`);

    // Serving files
    fs.readFile(requestPath, (err, data) => {
        if (!err) {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
            return;
        }
        // Else we handle the error
        switch (err.code) {
            case "ENOENT":
                console.log(`!! ${requestPath} not found`);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(data404);
                break;
            default:
                res.writeHead(500);
                res.end(
                    `ERROR: ${err.code}\nContact the site owner about this`
                );
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
