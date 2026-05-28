const http = require("http");
const url = require("url");

const server = http.createServer(async (req, res) => {

    const query = url.parse(req.url, true).query;

    const teraboxLink = query.url;

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    if (!teraboxLink) {
        return res.end(JSON.stringify({
            status: false,
            message: "Provide Terabox URL"
        }));
    }

    // Temporary demo response
    return res.end(JSON.stringify({
        status: true,
        received_url: teraboxLink,
        message: "Terabox link received successfully"
    }));

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
