const loginUrl = 'https://www.netflix.com/login';

module.exports.login = async (page, username, password) => {
    const response = await page.goto(loginUrl, {
        timeout: 25000,
        waitUntil: 'networkidle2',
      });

    if (response._status >= 400) throw new Error(`Could not login to netflix. Error: ${response.toString()}`)

    await page.type("#id_userLoginId", username, {delay: 20})
    await page.type("#id_password", password, {delay: 20})
    await page.click(".login-button")
}