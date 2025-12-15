// Request Parser Utility - parses request body
function parseRequestBody(req, callback) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch (error) {
      req.body = {};
    }
    callback();
  });
}

module.exports = { parseRequestBody };

