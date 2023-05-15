const fs = require('fs');
const path = require('path');

const requestLogger = (req, res, next) => {
    const log = `Time: ${new Date().toISOString()}, ${req.method} ${req.url}\n`;
    fs.appendFile(path.join(__dirname, '../logs/requests.log'), log, (err) => {
        if (err) {
            console.error(err);
        }
    });
    next();
};

module.exports = requestLogger;