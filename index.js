const http = require("http");
const url = require("url");
const https = require("https");

function getHTML(link) {
    return new Promise((resolve, reject) => {

        https.get(link, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }, (response) => {

            let data = "";

            console.log("Status Code:", response.statusCode);
            console.log("Location:", response.headers.location);

            response.on("data", chunk => {
                data += chunk;
            });

            response.on("end", () => {

                console.log("HTML Length:", data.length);

                const finalUrl =
                    response.headers.location || link;

                resolve({
                    html: data,
                    finalUrl
                });

            });

        }).on("error", (err) => {

            console.log("Request Error:", err.message);
            reject(err);

        });

    });
}

const server = http.createServer(async (req, res) => {

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    const query =
        url.parse(req.url, true).query;

    const teraboxLink = query.url;

    console.log("Request URL:", teraboxLink);

    if (!teraboxLink) {
        return res.end(JSON.stringify({
            status: false,
            message: "Provide Terabox URL"
        }));
    }

    try {

        const result =
            await getHTML(teraboxLink);

        const html = result.html;

        const pcftoken =
            html.match(/"pcftoken":"([^"]+)"/i);

        const shareid =
            html.match(/shareid[^0-9]*([0-9]+)/i);

        const uk =
            html.match(/uk[^0-9]*([0-9]+)/i);

        const jsToken =
            html.match(/jsToken\s*=\s*"([^"]+)"/i);

        return res.end(JSON.stringify({
            status: true,
            final_link: result.finalUrl,
            pcftoken: pcftoken ? pcftoken[1] : null,
            shareid: shareid ? shareid[1] : null,
            uk: uk ? uk[1] : null,
            jsToken: jsToken ? jsToken[1] : null,
            shareid_raw: html.includes("shareid"),
            uk_raw: html.includes("\"uk\""),
            html_length: html.length
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
