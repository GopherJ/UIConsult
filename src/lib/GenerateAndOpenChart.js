const fs = require('fs');
const vg = require('vega');
const vegaLite = require('vega-lite');
const Open = require('./Open');
const path = require('path');

const GenerateAndOpenChart = (schema, filePath) => {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const chart = vegaLite.compile(schema, {config: {background: "white"}}).spec;
    const runtime = vg.parse(chart);
    const view = new vg.View(runtime).renderer('none').initialize();

    if (ext === '.svg') {
        view.toSVG()
            .then(data => {
                fs.writeFileSync(filePath, data);
                view.finalize();
                Open(filePath);
            });
    } else if (ext === '.png') {
        view.toCanvas()
            .then(canvas => {
                const out = fs.createWriteStream(filePath);
                const stream = canvas.createPNGStream();
                stream.pipe(out);
                out.on('finish', () => Open(filePath));
            });
    }
};

module.exports = GenerateAndOpenChart;
