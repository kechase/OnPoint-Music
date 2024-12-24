import { serveDir, serveFile } from "jsr:@std/http/file-server"

// const ac = new AbortController();

// const server = 
Deno.serve(
    { 
        port: 8080, 
        hostname: "0.0.0.0", 
        // signal: ac.signal,     
    },
    (req: Request) => {
        const url = new URL(req.url);
        const filepath = decodeURIComponent(url.pathname);

        try {
            return serveFile(req, "." + filepath);
        } catch {
            return new Response("404 Not found", { status: 404 });
        }
    }
);

// server.finished.then(() => console.log("Server closed"));

// console.log("Closing server...");
// ac.abort();