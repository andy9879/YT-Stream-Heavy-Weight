const {
	launch,
	getStream,
	wss,
} = require("./puppeteer-stream/dist/PuppeteerStream");
const fs = require("fs");

const file = fs.createWriteStream(__dirname + "/test.webm");

async function test() {
	const browser = await launch({
		executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
		// or on linux: "google-chrome-stable"
		// or on mac: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		defaultViewport: {
			width: 1920,
			height: 1080,
		},
	});

	const page = await browser.newPage();
	await page.goto("https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1");
	const stream = await getStream(page, { audio: true, video: true });
	console.log("recording");

	stream.pipe(file);
	setTimeout(async () => {
		await stream.destroy();
		file.close();
		console.log("finished");

		await browser.close();
		(await wss).close();
	}, 1000 * 10);
}

test();
