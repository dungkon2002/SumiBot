
	import axios from "axios";
	import cheerio from "cheerio"
	import fs from "fs";

export default function({ api, global, ThreadSettings }) {
	//will do something in here ¯\_(ツ)_/
	function throwError(command, threadID, messageID) {
		try {
	const threadSetting = ThreadSettings.find(item => item.id == parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX
	return api.sendMessage(`[ ⚠️ UTILS ]\n» Lệnh bạn đang sử dụng không đúng cú pháp\n» vui lòng sử dụng ${prefix}help ${command} để biết thêm chi tiết cách sử dụng!`, threadID, messageID);
		} catch (e) { console.log(e) }
}

	function cleanAnilistHTML(text) {
		text = text
			.replace('<br>', '\n')
			.replace(/<\/?(i|em)>/g, '*')
			.replace(/<\/?b>/g, '**')
			.replace(/~!|!~/g, '||')
			.replace("&amp;", "&")
			.replace("&lt;", "<")
			.replace("&gt;", ">")
			.replace("&quot;", '"')
			.replace("&#039;", "'");
		return text;
	}
    
	async function downloadFile(url, path) {
	
		
	
		const response = await axios({
			method: 'GET',
			responseType: 'stream',
			url
		});
	
		const writer = fs.createWriteStream(path);
	
		response.data.pipe(writer);
	
		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	};
	
	function randomString(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var charactersLength = characters.length || 5;
	for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
	return result;
	};

	function youtube(link){
		
		
		return new Promise((resolve, reject) => {
			const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
			if (ytIdRegex.test(link)) {
			let url =  ytIdRegex.exec(link)
			let config = {
				'url': 'https://www.youtube.be/' + url,
				'q_auto': 0,
				'ajax': 1
			}
			let headerss = 	{
				"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"Cookie": 'PHPSESSID=6jo2ggb63g5mjvgj45f612ogt7; _ga=GA1.2.405896420.1625200423; _gid=GA1.2.2135261581.1625200423; _PN_SBSCRBR_FALLBACK_DENIED=1625200785624; MarketGidStorage={"0":{},"C702514":{"page":5,"time":1625200846733}}'
			}
		axios('https://www.y2mate.com/mates/en68/analyze/ajax',{
				method: 'POST',
				data: new URLSearchParams(Object.entries(config)),
				headers: headerss
			})
		.then(({ data }) => {
			const $ = cheerio.load(data.result)
			let img = $('div.thumbnail.cover > a > img').attr('src');
			let title = $('div.thumbnail.cover > div > b').text();
			let size = $('#mp4 > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()
			let size_mp3 = $('#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
			let id = /var k__id = "(.*?)"/.exec(data.result)[1]
			let configs = {
		type: 'youtube',
		_id: id,
		v_id: url[1],
		ajax: '1',
		token: '',
		ftype: 'mp4',
		fquality: 360
	  }
		axios('https://www.y2mate.com/mates/en68/convert',{
			method: 'POST',
			data: new URLSearchParams(Object.entries(configs)),
			headers: headerss 
		})
		.then(({data}) => {
			const $ = cheerio.load(data.result)
			let link = $('div > a').attr('href')
		let configss = {
		type: 'youtube',
		_id: id,
		v_id: url[1],
		ajax: '1',
		token: '',
		ftype: 'mp3',
		fquality: 128
	  }
		axios('https://www.y2mate.com/mates/en68/convert',{
			method: 'POST',
			data: new URLSearchParams(Object.entries(configss)),
			headers: headerss 
		})
		.then(({ data }) => {
			const $ = cheerio.load(data.result)
			let audio = $('div > a').attr('href')
			resolve({
				id: url[1],
				title: title,
				size: size,
				quality: '360p',
				thumb: img,
				link: link,
				size_mp3: size_mp3,
				mp3: audio
			})
	
			})
				})
			})
		.catch(reject)
		}else reject('link invalid')
		})
	}


	function findidfb(link){
        
		return new Promise((resolve, reject) => {
			let config = {
				'url_facebook': link
			}
			let headerss = 	{
				"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
				"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
				"Cookie": '_ga=GA1.2.1617150991.1638149408; __gads=ID=7ab9a6eedcfbf6d7-2233ccfe4ecf00e5:T=1638149409:RT=1638149409:S=ALNI_MaClLoQxUDL0Xj0nFeQ9wzTOI95yw; PHPSESSID=h0n5nrbgajt1koea4ad6gmt44m; _gid=GA1.2.691106750.1639704088; _gat_gtag_UA_163790422_1=1'
			}
		axios('https://findidfb.com/',{
				method: 'POST',
				data: new URLSearchParams(Object.entries(config)),
				headers: headerss
			})
		.then(({ data }) => {
			const $ = cheerio.load(data)
			let uid = $("body > div.container.settings-container > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(1) > b").text() || $("body > div.container.settings-container > div:nth-child(2) > div > div > b").text()
			let Username = $("body > div.container.settings-container > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > b").text() || "Không Xác Định"
			let name = $("body > div.container.settings-container > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(3) > a > b").text() || "Người Dùng Facebook"
			let Information = $("body > div.container.settings-container > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(5) > b").text() || "Không Xác Định"
			let Information2 = $("body > div.container.settings-container > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(6) > b").text() || "Không Xác Định"
			resolve({
				uid: uid,
				Username: Username,
				name: name,
				Information: Information,
				Information2: Information2
			})
		}).catch(reject)
		})
	}

	function fbdown(link){
		
        
		return new Promise((resolve, reject) => {
			let config = {
				'URL': link,
				'token': "2c17c6393771ee3048ae34d6b380c5ecz"
			}
			let headerss = 	{
				"sec-ch-ua": '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
				"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
				"Cookie": '_ga=GA1.2.1968443257.1636937274; _gid=GA1.2.573972110.1636937274; __gads=ID=106c4c9c1b90f834-22310296a7ce00ff:T=1636937274:RT=1636937274:S=ALNI_MabjxrGBxmS9sTZ2k5GdRTMY8HU3g; _gat_gtag_UA_118125826_1=1'
			}
		axios('https://downvideo.net/download.php',{
				method: 'POST',
				data: new URLSearchParams(Object.entries(config)),
				headers: headerss
			})
		.then(({ data }) => {
			const $ = cheerio.load(data)
			let HDvideo = $("body > div > center > div.col-md-10 > div > div:nth-child(7) > a").attr("href") || undefined
			let SDvideo = $("#sd > a").attr("href") || undefined
			resolve({
				SD_Url: SDvideo,
				HD_Url: HDvideo
			})
		}).catch(reject)
		})
	}

	function MinMax(min, max) {
		if (typeof min != 'number') throw 'Phải là 1 số.';
		if (typeof max != 'number') throw 'Phải là 1 số.';
		try {	
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
		} catch (e) { return }
	}

	function emoji(str) {
		return new Promise((resolve, reject) => {
			let config = {
				"f": "vi",
				"t": "vi",
				"d": str,
				"o": "ft00-",
				"k": "lvwxjivivxp",
				"r": ""

			}
			let headerss = 	{
				"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
				"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
			}
			
		axios('https://api.emojitranslate.com/',{
				method: 'POST',
				data: new URLSearchParams(Object.entries(config)),
				headers: headerss
			})
		.then(({ data }) => {
			
			let textEmoji = data
			resolve({
				textEmoji: textEmoji
			})
		}).catch(reject)
		})
	}
    
    
	function tiktok(link){
		return new Promise((resolve, reject) => {
			let config = {
				'url': link,
				'token': "e0094fb3725174f2f6aeeb2093d77df2323737c3e5eaa2a620f47a3e22be7098"
			}
			let headerss = 	{
				"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
				"Cookie": '_ga=GA1.2.1368294601.1637683193; PHPSESSID=a7fvqh4m0kindo5aipd94r84k8; _gid=GA1.2.412232653.1638805197; popCookie=1; _gat_gtag_UA_117413493_7=1'
			}
			
		axios('https://ttdownloader.com/req/',{
				method: 'POST',
				data: new URLSearchParams(Object.entries(config)),
				headers: headerss
			})
		.then(({ data }) => {
			const $ = cheerio.load(data)
			let NoWatermark = $("#results-list > div:nth-child(2) > div.download > a.download-link").attr("href")
			let Audio = $("#results-list > div:nth-child(4) > div.download > a.download-link").attr("href")
			resolve({
				NoWatermark: NoWatermark,
				Audio: Audio
			})
		}).catch(reject)
		})
	}
	
	return {
		throwError,
		cleanAnilistHTML,
		downloadFile,
		randomString,
		youtube,
		findidfb,
		fbdown,
		MinMax,
		tiktok,
		emoji
	};
    
}
//Useless
