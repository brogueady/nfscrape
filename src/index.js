const es6promise = require('es6-promise').Promise
const scroll = require('./infinite-scroll')
const initialise = require('./init')
const loginPage = require('./login-page')
const landingPage = require('./landing-page')
const profilePage = require('./profile-page')
const fs = require('fs');


(async () => {
    const username = process.argv[2]
    const password = process.argv[3]

    const browser = await initialise.init()
    const page = await browser.newPage()

    await loginPage.login(page, username, password)
    await page.waitFor(3000)
    await profilePage.chooseProfile(page)
    await page.waitFor(3000)
    await landingPage.chooseFilms(page)
    await page.waitFor(3000)


    const extractItems = async () => {
      const elements = await page.$x("//div[@class='ptrack-content']/a");

      const bodyHandle = await page.$('body')

      let titles = await es6promise.all(elements.map(value => {
          return page.evaluate(el => el.getAttribute("aria-label"), value)
        }))
      return titles

    }

    const items = await scroll.scrapeInfiniteScrollItems(page, extractItems, 200);

    // Save extracted items to a file.
    fs.writeFileSync('./movie-titles.log', items.join(',\n') + '\n');

    await page.waitFor(20000)
    
    browser.close()

})();
