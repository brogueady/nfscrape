const es6promise = require('es6-promise').Promise
const scroll = require('./infinite-scroll')
const initialise = require('./init')
const loginPage = require('./login-page')
const landingPage = require('./landing-page')
const profilePage = require('./profile-page')
const log = require('./log')
const fs = require('fs');
const genreUrl = require('./config');
const lodash = require('lodash');

(async () => {
  const username = process.argv[2]
  const password = process.argv[3]
  const browser = await initialise.init()

  try {

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');

    await loginPage.login(page, username, password)
    await page.waitFor(3000)
    await profilePage.chooseProfile(page)
    await page.waitFor(3000)



    const extractItems = async () => {
      const elements = await page.$x("//div[@class='ptrack-content']/a");

      const bodyHandle = await page.$('body')

      let titles = await es6promise.all(elements.map(value => {
        return page.evaluate(el => el.getAttribute("aria-label"), value)
      }))
      return titles

    }

    const genreIds = [{name: 'action', code:'1365'},{name: 'anime', code:'3063'},{name: 'british', code:'10757'},{name: 'classics', code:'31574'},{name: 'comedies', code:'6548'}
    ,{name: 'crime', code:'5824'},{name: 'cult', code:'7627'},{name: 'documentaries', code:'2243108'},{name: 'dramas', code:'5763'},{name: 'hollywood', code:'2298875'},
    {name: 'horror', code:'8711'},{name: 'independent', code:'7077'},{name: 'international', code:'78367'},{name: 'kids & family', code:'783'},{name: 'lgbtq', code:'5977'}
    ,{name: 'music & musicals', code:'52852'},{name: 'romance', code:'8883'},{name: 'sci-fi', code:'1492'},{name: 'sports', code:'4370'},{name: 'stand-up comedy', code:'11559'}
    ,{name: 'thrillers', code:'8933'} ]
    // const genreIds = [{name: 'sports', code:'4370'}]

    let movies = []
    let genre;
    for (var i=0; i < genreIds.length; i++) {
        const response = await page.goto(genreUrl.genreUrl(genreIds[i].code), {
          timeout: 25000,
          waitUntil: 'networkidle2',
        });
        await page.waitFor(3000)
        const items = await scroll.scrapeInfiniteScrollItems(page, extractItems, genre);
        movies = movies.concat(items)
    }
    
    log.logInfo("number of movies found = " + movies.length)
    movies = lodash.uniq(movies)
    log.logInfo("number of movies after de-dup = " + movies.length)

    let movieObjects = []
    movies.forEach(movieTitle => {
        movieObjects.push({ title: movieTitle})
    })

    let movieJson = {
      movies: movieObjects
    }

    // Save extracted items to a file.
    fs.writeFileSync('./movie-titles.log', JSON.stringify(movieJson))

    await page.waitFor(20000)
  } catch (e) {
    log.logError(`Unexpected Error: ${e.toString()}, linenumber: ${e.lineNumber}, file: ${e.fileName}, stack: ${e.stack}`)
  } finally {
    browser.close()
    log.close()
  }

})();