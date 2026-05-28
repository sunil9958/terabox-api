const http = require("http");
const url = require("url");
const https = require("https");

function getHTML(link) {

    return new Promise((resolve, reject) => {

        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html,application/xhtml+xml",
                "Referer": "https://www.terabox.com/"
            }
        };

        https.get(link, options, (res) => {

            let data = "";

            res.on("data", chunk => {
                data += chunk;
            });

            res.on("end", () => {

                resolve({
                    html: data,
                    statusCode: res.statusCode,
                    headers: res.headers
                });

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

        // First Request
        const first = await getHTML(teraboxLink);

        // Redirect URL
        const finalLink = first.headers.location || teraboxLink;

        // Second Request
        const result = await getHTML(finalLink);

        return res.end(JSON.stringify({
            status: true,
            final_link: finalLink,
            html_length: result.html.length,
            preview: result.html.substring(0, 500)
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
