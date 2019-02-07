const puppeteer = require('puppeteer');

module.exports.init = async () => {
    return puppeteer.launch({
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=2880x1800',
        ], headless: false})

}