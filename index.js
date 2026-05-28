const http = require("http");
const url = require("url");
const https = require("https");

function getHTML(link) {

    return new Promise((resolve, reject) => {

        https.get(link, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }, (res) => {

            let data = "";

            res.on("data", chunk => {
                data += chunk;
            });

            res.on("end", () => {
                resolve(data);
            });

        }).on("error", err => {
            reject(err);
        });

    });

}

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

    try {

        const html = await getHTML(teraboxLink);

        // Simple token extract demo
        const shortUrlMatch = html.match(/shorturl=(.*?)&/);

        return res.end(JSON.stringify({
            status: true,
            input: teraboxLink,
            html_length: html.length,
            shorturl_found: shortUrlMatch ? shortUrlMatch[1] : null
        }));

    } catch (error) {

        return res.end(JSON.stringify({
            status: false,
            error: error.message
        }));

    }

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
