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
            failureThreshold: 3000,
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
    test('Mobile Snapshot', async function() {
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1')
        await page.emulate(puppeteer.devices['Galaxy S5'])
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01,
        })
    })
    test('Tablet Snapshot', async function() {
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1')
        const tablet = puppeteer.devices['iPad landscape'] //this will set the the viewport of puppeteer to match the tablet screen resolution 
        await page.emulate(tablet)
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01,
        })
    })

    test('Remove Element Before Snapshot', async function() {
        await page.goto('https://www.example.com')
        await page.evaluate(() => {
            ;(document.querySelectorAll('h1') || []).forEach(el => el.remove())
        })
        jest.setTimeout(10000)
    })

})