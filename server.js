Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url)

        if (req.method === "POST") {
            if (url.pathname.includes("..") || !url.pathname.startsWith("/data/")) {
                return new Response("Invalid filename", { status: 400 })
            }

            const body = await req.text()
            await Bun.write("." + url.pathname, body)
            return new Response("ok")
        }

        if (url.pathname === "/data/map.json") {
            const file = Bun.file("." + url.pathname)
            if (await file.exists()) return new Response(file)
            return Response.json({ "error": 404 })
        }

        // serve static files (index.html, etc.) from cwd
        const filePath = url.pathname === "/" ? "/index.html" : url.pathname
        const file = Bun.file("." + filePath)
        if (await file.exists()) return new Response(file)

        return new Response("Not found", { status: 404 })
    }
})

console.log("http://localhost:3000")