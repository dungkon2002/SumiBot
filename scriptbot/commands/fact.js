export default {
	name: "fact",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Tạo twitter Trum",
	shortDescription: "Tạo twitter Trum",
	usages: [
		'fact <xxxx>: <nhập nội dung>'
	],
	cooldowns: 5
};
import Canvas from "canvas"
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, args, utils }) {
	try {

		function wrapText(ctx, text, maxWidth) {
			return new Promise(resolve => {
				if (ctx.measureText(text).width < maxWidth) return resolve([text]);
				if (ctx.measureText('W').width > maxWidth) return resolve(null);
				const words = text.split(' ');
				const lines = [];
				let line = '';
				while (words.length > 0) {
					let split = false;
					while (ctx.measureText(words[0]).width >= maxWidth) {
						const temp = words[0];
						words[0] = temp.slice(0, -1);
						if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
						else {
							split = true;
							words.splice(1, 0, temp.slice(-1));
						}
					}
					if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
					else {
						lines.push(line.trim());
						line = '';
					}
					if (words.length === 0) lines.push(line.trim());
				}
				return resolve(lines);
			});
		}


		let { threadID, messageID } = event;
		let pathImg = ps.resolve(__dirname, 'cache', `trum.png`);
		const __root = ps.resolve(__dirname, "cache", "rank");
		var text = args.join(" ");
		if (!text) return api.sendMessage("Nhập nội dung cần tạo", threadID, messageID);
		await utils.downloadFile(`https://raw.githubusercontent.com/nguyenkhanh-k2/KhanhMilo/main/fact.png`, pathImg);
		let baseImage = await Canvas.loadImage(pathImg);
		let canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		Canvas.registerFont(__root + "/fonts/Linotte Regular.ttf", {
			family: "Linotte",
			weight: "regular",
			style: "normal"
		});
		ctx.font = "regular 25px Linotte";
		ctx.fillStyle = "#0f1419";
		ctx.textAlign = "start";
		let fontSize = 25;
		while (ctx.measureText(text).width > 1000) {
			fontSize--;
			ctx.font = `regular ${fontSize}px Linotte`;
		}
		const lines = await wrapText(ctx, text, 740);
		ctx.fillText(lines.join('\n'), 72, 145);
		ctx.beginPath();
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
	} catch (e) {
		console.log(e)
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
