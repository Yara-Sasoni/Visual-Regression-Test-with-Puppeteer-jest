const puppeteer = require('puppeteer')
const percySnapshot = require('@percy/puppeteer')

describe('Percy Visual Test', () => {
    let browser
    let page

    beforeAll(async function() {
        browser = await puppeteer.launch({headless: true})
        page = await browser.newPage()

    })

    afterAll(async function() {
        await browser.close()
    })

    test('Full Page Pecy Snapshot',async function() {
        await page.goto('https://www.example.com')
        await page.waitForTimeout(1000)
        await percySnapshot(page, 'Example Page')
    } )

    test('Remove H1 snapshot', async function() {
        await page.goto('https://www.example.com')
        await page.evaluate(() => {
            ;(document.querySelectorAll('h1') || []).forEach(el => el.remove())
        })
        jest.setTimeout(10000)
        await percySnapshot(page, 'Example Page 1')
    })
})
// in terminal write npm install @percy/puppeteer then npm install @percy/cli
// set PERCY_TOKEN=<token from the percy website under project settings>
// if the above does not work put $Env:PERCY_TOKEN="the token from percy website"
//in package.json (test-percy="percy exec -- jest ./tests-snapshots/__tests__/percy.test.js") 
//if you want to add another test, you need to set the token again in terminal