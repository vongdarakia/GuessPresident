let fs = require('fs');
let express = require('express');
let request = require('request');
let cheerio = require('cheerio');

const app = express();
const apiPort = 3000;
const PRES_IMG_ROW = 2;
const PRES_NAME_ROW = 3;
const base_url = 'https://en.wikipedia.org';

let presidents = [];

// Download an image
// Code from https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
	if (err)
	{
		if (callback)
			return callback(err);
		return console.log("There was an error with uri");
	}
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function beginImageDownload() {
	var currId = 0;
	let filename = presidents[currId].name.replace(/ /g, '_') + '.jpg';

	// Downloads the next image.
	var next = function() {
		currId++;

		// Exit when we have downloaded all the images
		if (currId == presidents.length) {
			console.log("done");
			process.exit();
		}
		// Continue to download the next image.
		else {
			filename = presidents[currId].name.replace(/ /g, '_') + '.jpg';
			download(presidents[currId].img, 'img/' + filename, next);
		}
	};

	// Begins the download process.
	download(presidents[currId].img, 'img/' + filename, next);
}

app.listen(apiPort, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info(`Api listening on port ${apiPort}!`);

        let url = "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States";
        var r = request(url, {timeout: 15000}, function(err, res, html) {
			if (err)
				console.log(err);
			if (res.statusCode !== 200)
				console.log("CODE: " + res.statusCode);

			let $ = cheerio.load(html);
			let rows = $('.wikitable tr');

			// Go through all the table rows found on the page.
			for (var i = 0; i < rows.length; i++) {
				// Filter for only td elements (the columns)
				let tds = rows[i].children.filter(function(e) {
					return e.name == 'td';
				});

				try {
					let img = 'https:' + tds[PRES_IMG_ROW].children[0].children[0].attribs.src;
					let name = tds[PRES_NAME_ROW].children[0].children[0].children[0].children[0].data;

					presidents.push({id: presidents.length + 1, name: name, img: img});
				} catch(e) {
					// If any error occurs, then we're not at the right row for presidents, so just
					// continue onwards.
					continue;
				}
			}

			// SECTION I
			// Saves the list of presidents to a file.
			fs.writeFile('presidents.json', JSON.stringify(presidents), 'utf8', function() {
				console.log("File saved");
				process.exit();
			});
			// END SECTION I

			// SECTION II
			// Downloads all the images.
			// Comment out SECTION I, and uncomment this to use it.
			// I realized that I didn't really need to download the image because
			// I can just use the image url that I scraped as the src. Less memory!
			// beginImageDownload();
			// END SECTION II
		});
    }
});