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

            res.on("data", chunk => data += chunk);

            res.on("end", () => {
                resolve({
                    html: data,
                    headers: res.headers
                });
            });

        }).on("error", reject);
    });
}

const server = http.createServer(async (req, res) => {

    const query = url.parse(req.url, true).query;

    if (!query.url) {
        return res.end(JSON.stringify({
            status: false,
            message: "Provide URL"
        }));
    }

    try {

        const first = await getHTML(query.url);

        const finalLink =
            first.headers.location || query.url;

        const second = await getHTML(finalLink);

        const html = second.html;

        const pcfMatch =
            html.match(/"pcftoken":"([^"]+)"/);

        const tokenMatch =
            html.match(/window\.jsToken\s*=\s*"([^"]+)"/);

        res.end(JSON.stringify({
            status: true,
            final_link: finalLink,
            pcftoken: pcfMatch ? pcfMatch[1] : null,
            jsToken: tokenMatch ? tokenMatch[1] : null,
            html_length: html.length
        }));

    } catch (e) {

        res.end(JSON.stringify({
            status: false,
            error: e.message
        }));

    }

});

server.listen(process.env.PORT || 3000);
