module.exports.chooseProfile = async (page) => {
    const profileLink = await page.$x("//span[contains(text(), 'Ade')]");

    if (profileLink.length > 0) {
      await profileLink[0].click();
    } else {
      throw new Error("profile Link not found");
    }

}