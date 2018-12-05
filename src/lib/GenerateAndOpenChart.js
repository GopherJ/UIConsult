const fs = require('fs');
const vg = require('vega');
const vegaLite = require('vega-lite');
const Open = require('./Open');
const path = require('path');
const mkdirp = require('mkdirp');
const { EXTENSION: { SVG, PNG } } = require('../utils/constants');

const checkAndCreateDir = (dir, cb) => {
    if (!fs.existsSync(dir))
        mkdirp(dir, cb);
    else
        cb(null);
};

const GenerateAndOpenChart = (schema, filePath) => {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);

    checkAndCreateDir(dir, err => {
        if (!err) {
            const chart = vegaLite.compile(schema, {config: {background: "white"}}).spec;
            const runtime = vg.parse(chart);
            const view = new vg.View(runtime).renderer('none').initialize();

            switch (ext) {
            case SVG: 
                view.toSVG().then(data => {
                    fs.writeFileSync(filePath, data);
                    view.finalize();
                    Open(filePath);
                });
            case PNG:
                view.toCanvas().then(canvas => {
                    const out = fs.createWriteStream(filePath);
                    const stream = canvas.createPNGStream();
                    stream.pipe(out);
                    out.on('finish', () => Open(filePath));
                });
            }
        }
    });
};

module.exports = GenerateAndOpenChart;
