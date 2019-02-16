module.exports.chooseFilms = async (page) => {
    // const browseLink = await page.$x("//a[contains(text(), 'Browse')]");

    // if (browseLink.length > 0) {
    //   await browseLink[0].click();
    // } else {
    //   throw new Error("browse Link not found");
    // }
    // const filmsLink = await page.$x("//a[contains(text(), 'Films')]");

    // if (filmsLink.length > 0) {
    //   await filmsLink[0].click();
    // } else {
    //   throw new Error("Films Link not found");
    // }

    await page.click("button[aria-label='View in grid view']")

    const suggestionsForYou = await page.$x("//div[contains(text(), 'SUGGESTIONS FOR YOU')]");

    if (suggestionsForYou.length > 0) {
      await suggestionsForYou[0].click();
    } else {
      throw new Error("suggestionsForYou Link not found");
    }

    const atoz = await page.$x("//a[contains(text(), 'A-Z')]");

    if (atoz.length > 0) {
      await atoz[0].click();
    } else {
      throw new Error("atoz Link not found");
    }

}