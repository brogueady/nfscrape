
const log = require('./log')

module.exports.scrapeInfiniteScrollItems = async function (
    page,
    extractItems,
    genre,
    scrollDelay = 2000,
  ) {
    let items = [];
    let previousItemsCount = -1
    let previousHeight;

    try {
      while (items.length !== previousItemsCount) {
        previousItemsCount = items.count
        items = await extractItems()
        
        log.logInfo('item count = ' + items.count + ', previous item count = ' + previousItemsCount + ', last movie = ' + items[items.count-1])
        
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight >= ${previousHeight}`);
        scrollDelay = Math.floor(Math.random() * 5000) + 2000;
        log.logInfo('waiting for ' + scrollDelay + ' ms', scrollDelay)
        await page.waitFor(scrollDelay);
      }
    } catch(e) { 
      log.logError('Error caught scrolling for movies: ' + e.toString())
    }
    return items;
  }
  
