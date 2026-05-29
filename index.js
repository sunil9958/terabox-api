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

        const first = await getHTML(teraboxLink);

        const finalLink =
            first.headers.location ||
            teraboxLink;

        const result = await getHTML(finalLink);

        const shorturlMatch =
            finalLink.match(/surl=([^&]+)/);

        const shorturl =
            shorturlMatch ?
            shorturlMatch[1] :
            null;

        const jsTokenMatch =
            result.html.match(
                /window\.jsToken\s*=\s*"([^"]+)"/i
            );

        const jsToken =
            jsTokenMatch ?
            jsTokenMatch[1] :
            null;

        const shareIdMatch =
            result.html.match(
                /shareid[=:]"?(\d+)/i
            );

        const shareid =
            shareIdMatch ?
            shareIdMatch[1] :
            null;

        return res.end(JSON.stringify({
            status: true,
            final_link: finalLink,
            shorturl: shorturl,
            shareid: shareid,
            jsToken: jsToken,
            html_length: result.html.length
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
