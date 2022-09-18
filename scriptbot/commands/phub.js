export default {
	name: "phub",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Comment trên pỏnhub",
	shortDescription: "Comment trên pỏnhub",
	usages: [
		'phub <xxxx>: nội dung'
    ],
	cooldowns: 5
};

import Canvas from "canvas"
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function wrapText(ctx, text, maxWidth) {
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

export async function run({ api, event, args, utils, UsersAll }) {
	try {
    
		let { senderID, threadID, messageID } = event;
		const UsersData = UsersAll.find(item => item.id == senderID);
		let pathImg = ps.resolve(__dirname, 'cache', `porn.png`);
		let avatar = ps.resolve(__dirname, 'cache', `avt.png`);
		const __root =ps. resolve(__dirname, "cache", "rank");
		let text = args.join(" ");
		let name = UsersData.name
		if (!text) return api.sendMessage("Nhập nội dung comment trên pỏnhub", threadID, messageID);
		await utils.downloadFile(`https://graph.facebook.com/${senderID}/picture?type=large&width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, avatar);
		await utils.downloadFile(`https://raw.githubusercontent.com/nguyenkhanh-k2/KhanhMilo/main/phub.png`, pathImg);
		let image = await Canvas.loadImage(avatar);
		let baseImage = await Canvas.loadImage(pathImg);
		let canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, 30, 310, 70, 70);
		Canvas.registerFont(__root + "/fonts/SVN-Arial Regular.ttf", {
			family: "Arial",
			weight: "regular",
			style: "normal"
		});
		ctx.font = "regular 23px Arial";
		ctx.fillStyle = "#FF9900";
		ctx.textAlign = "start";
		ctx.fillText(name, 115, 350);
		ctx.font = "regular 23px Arial";
		ctx.fillStyle = "#ffff";
		ctx.textAlign = "start";
		let fontSize = 23;
		while (ctx.measureText(text).width > 2600) {
			fontSize--;
			ctx.font = `regular ${fontSize}px Arial`;
		}
		const lines = await this.wrapText(ctx, text, 1160);
		ctx.fillText(lines.join('\n'), 30,430);
		ctx.beginPath();
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		fs.removeSync(avatar);
		return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);        
	
} catch (e) {
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}