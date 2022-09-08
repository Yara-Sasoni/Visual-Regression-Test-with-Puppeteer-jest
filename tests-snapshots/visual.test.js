const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot }) //to extend the expect function. that means that our image snapshot library is ready

describe('Visual Regression Testing', () => {
    let browser
    let page

    beforeAll(async function() {
        browser = await puppeteer.launch({headless: true})
        page = await browser.newPage()
    })
    afterAll(async function() {
        await browser.close()
    })

    test('Full Page Snapshot', async function() {
        await page.goto('https://www.example.com')  //visit a website
        await page.waitForSelector('h1')   //wait for some elements to appear to make sure the test is not flacky
        const image = await page.screenshot()  //create a variable
        expect(image).toMatchImageSnapshot({  //you take that image and compare it with the original one
            failureThresholdType: "pixel",
            failureThreshold: 500,
        })
    })
    test('Single Element Snapshot', async function() {
        await page.goto('https://www.example.com')
        const h1 = await page.waitForSelector('h1')
        const image = await h1.screenshot()  //it will only screenshot the area of h1
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01,
        })
    })
})
