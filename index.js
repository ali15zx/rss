const http = require("http")
const url = require("url")
const port = 8000

var sessions = []

const test = (req, res) => {
    res.statusCode = 200
    res.end("ok")
}

const recv = (req, res) => {
    if (req.params.has("sid")) {
        const sid = req.params.get("sid")
        const session = sessions.find(item => item.sid == sid)
        
        if (session != undefined) {
            res.statusCode = 200
            res.end(session.data)
            session.data = ""
        } else {
            res.statusCode = 404
            res.end("session not found")        
        }
    } else {
        res.statusCode = 400
        res.end("bad request")
    }
}

const send = (req, res) => {
    if (req.params.has("data") && req.params.has("sid")) {
        const sid = req.params.get("sid")
        const data = req.params.get("data")
        
        sessions.push({sid, data})
        sessions.find(item => item.sid == sid).data = data

        res.statusCode = 200
        res.end("ok")
    } else {
        res.statusCode = 400
        res.end("bad request")
    }
}

const not_found = (req, res) => {
    res.statusCode = 200
    res.end("404 not found")
}

const routes = {
    "/test": test,
    "/recv": recv,
    "/send": send,
}

const server = http.createServer((req, res) => {
    const parsed_url = url.parse(req.url)

    req.params = new URLSearchParams(parsed_url.query)
    res.setHeader('Content-Type', 'text/plain')

    if (routes.hasOwnProperty(parsed_url.pathname))
        routes[parsed_url.pathname](req, res)
    else
        not_found(req, res)
})

server.listen(port, "0.0.0.0", () => {
    console.log(`server running on port ${port}`)
})
