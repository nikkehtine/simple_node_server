import http from "http";
import fs from "fs";
import path from "path";
import exec from "child_process";
import chalk from "chalk";

const hostname = "127.0.0.1";
const port = 6969;

const siteDir = "./site";
const tsDir = "./src";
const notFound = path.join(siteDir, "404.html");

const data404 = fs.readFileSync(notFound);

exec.execSync("pnpm build");
fs.watch(tsDir, () => {
    exec.execSync("pnpm build");
});

const server = http.createServer((req, res) => {
    // Handling requests
    let requestPath = path.join(siteDir, req.url);
    if (req.url === "/") {
        requestPath = path.join(siteDir, "index.html");
    }
    if (path.extname(requestPath) === "") {
        requestPath += ".html";
    }
    let ext = path.extname(requestPath);

    let type = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".ico": "image/x-icon",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".wav": "audio/wav",
    };
    let contentType = type[ext] || "text/plain";

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
                console.log(chalk.yellow(`!! ${requestPath} not found`));
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(data404);
                break;
            default:
                console.log(chalk.red(`ERROR: ${err.code}`));
                res.writeHead(500);
                res.end(
                    `ERROR: ${err.code}\nContact the site owner about this`
                );
        }
    });
});

// Error handling
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(chalk.red(`ERROR: port ${port} is already in use`));
        process.exit(1);
    } else {
        console.log(chalk.red(`ERROR: ${err.code}`));
    }
});

server.listen(port, hostname, () => {
    console.log(chalk.blue(`Server running at http://${hostname}:${port}/`));
});
