const http = require('http');
const fs = require('fs');
const Open = require('./Open');
const path = require('path');

const PORT = 8088;
const HOST = "127.0.0.1";

const createServerWithSchema = schema => {
    http.createServer((req, res) => {
        fs.readFile(path.join(__dirname, '..', 'views', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                process.stderr.write(err.message);

                res.writeHead(502, 'Internal Server Error');
                res.end();
            }
            else {
                res.writeHead(200, 'Ok', {'Content-Type': 'text/html;charset=utf-8'});
                res.end(data.replace(/<script>(.*)<\/script>/, '<script>const vlSpec='+JSON.stringify(schema)+';$1</script>'));
            }
        });
    }).listen(PORT, HOST, () => {
        process.stdout.write(`\n     Server is listening on ${HOST}:${PORT}...\n`);
        Open(`http://${HOST}:${PORT}`);
    }); 
};

module.exports = createServerWithSchema;


