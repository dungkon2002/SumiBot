export default {
	name: "rank",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Lấy rank hiện tại của bạn trên hệ thống bot",
	shortDescription: "Xem rank hiện tại",
	usages: [
		'rank: Để xem rank hiện tại của bạn',
		'rank @tag: Để xem rank người mà bạn @tag'
	],
	cooldowns: 5,
	dependencies: ["canvas", "path", "node-superfetch", "axios", "fs-extra"],
};


import fs from "fs-extra";
import path, { dirname } from "path";
import Canvas from "canvas";
import requests from 'node-superfetch';
import request from "request";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function makeRankCard(data) {
	/*
	* 
	* Remake from Canvacord
	* 
	*/

	const PI = Math.PI;

	const __root = path.resolve(__dirname, "cache", "rank");
	const { id, name, rank, level, expCurrent, expNextLevel } = data;

	Canvas.registerFont(__root + "/fonts/UTM AvoBold.ttf", {
		family: "Manrope",
		weight: "regular",
		style: "normal"
	});
	Canvas.registerFont(__root + "/fonts/UTM AvoBold_Italic.ttf", {
		family: "Manrope",
		weight: "bold",
		style: "normal"
	});

	let rankCard = await Canvas.loadImage(__root + "/rank_card/rankcard.png");
	const pathImg = __root + `/rank_card/rank_${id}.png`;

	var expWidth = (expCurrent * 615) / expNextLevel;
	if (expWidth > 615 - 18.5) expWidth = 615 - 18.5;

	var avatar = await requests.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

	avatar = await this.circle(avatar.body);
	async function makeCircleGradient(colors, lineWidth, exp, expNextLevel) {
		const canvas = Canvas.createCanvas(500, 500);
		const ctx = canvas.getContext("2d");
		const toRadian = degree => degree * Math.PI / 180
		var partLength = (2 * Math.PI) / colors.length;
		var start = 0;
		var gradient = null;
		var startColor = null,
			endColor = null;
		const xc = 250;
		const yc = 250;
		const r = 250 - lineWidth;
		const endBorder = toRadian((360 / expNextLevel * exp));

		for (var i = 0; i < colors.length; i++) {
			startColor = colors[i];
			endColor = colors[(i + 1) % colors.length];

			var xStart = xc + Math.cos(start) * r;
			var xEnd = xc + Math.cos(start + partLength) * r;

			var yStart = yc + Math.sin(start) * r;
			var yEnd = yc + Math.sin(start + partLength) * r;

			ctx.beginPath();

			gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
			gradient.addColorStop(0, startColor);
			gradient.addColorStop(1, endColor);

			ctx.strokeStyle = gradient;
			let partEnd = start + partLength;
			if (partEnd >= endBorder) partEnd = endBorder;
			ctx.arc(xc, yc, r, start, partEnd);
			ctx.lineWidth = lineWidth;
			ctx.stroke();
			ctx.closePath();

			start += partEnd >= endBorder ? 0 : partLength;
			if (partEnd >= endBorder) break;
		}

		const gradiantCircle = await Canvas.loadImage(canvas.toBuffer());

		const canvasB = await Canvas.createCanvas(500, 500);
		const ctxB = canvasB.getContext("2d");

		ctxB.save();
		ctxB.rotate(toRadian(90));
		ctxB.scale(-1, 1);
		ctxB.drawImage(gradiantCircle, -500, -500, 500, 500);
		ctxB.restore();
		return canvasB.toBuffer();
	}
	const circle = await makeCircleGradient(["#99FF99", "#4283FF"], 28, expCurrent, expNextLevel);
	const canvas = Canvas.createCanvas(934, 282);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(circle), 30, 35, 210, 210);
	ctx.drawImage(await Canvas.loadImage(avatar), 45, 50, 180, 180);

	ctx.font = `bold 40px Manrope`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	ctx.fillText(name, 270, 115);
	ctx.font = `40px Manrope`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";

	ctx.font = `bold 34px Manrope`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "end";
	ctx.fillText(level, 410, 190);
	ctx.fillStyle = "#000000";
	ctx.fillText("Level:", 365, 190);

	ctx.font = `bold 30px Manrope`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "end";
	ctx.fillText(rank, 1010 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 25, 80);
	ctx.fillStyle = "#000000";
	ctx.fillText("Rank:", 1010 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 16 - ctx.measureText(rank).width - 16, 80);

	ctx.font = `bold 34px Manrope`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 190);
	ctx.fillStyle = "#000000";
	ctx.fillText(expCurrent, 710, 190);

	ctx.beginPath();
	ctx.fillStyle = "#4283FF";
	ctx.arc(259 + 18.5, 147.5 + 18.5 + 62, 18.5, 1.5 * PI, 0.5 * PI, true);
	ctx.fill();
	ctx.fillRect(259 + 18.5, 147.5 + 62, expWidth, 37.5);
	ctx.arc(259 + 18.5 + expWidth, 147.5 + 18.5 + 62, 18.75, 1.5 * PI, 0.5 * PI, false);
	ctx.fill();

	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);
	return pathImg;
}

import jimp from 'jimp';
export async function circle(image) {
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
}

export function expToLevel(point) {
	if (point < 0) return 0;
	return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

export function levelToExp(level) {
	if (level <= 0) return 0;
	return 3 * level * (level - 1);
}

export async function getInfo(uid, UsersAll) {
	const point = UsersAll.find(item => item.id == uid).exp;
	const level = this.expToLevel(point);
	const expCurrent = point - this.levelToExp(level);
	const expNextLevel = this.levelToExp(level + 1) - this.levelToExp(level);
	return { level, expCurrent, expNextLevel };
}

export async function onLoad() {
	let dirMaterial = __dirname + `/cache/rank/`;

	if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
	if (!fs.existsSync(dirMaterial + "fonts")) fs.mkdirSync(dirMaterial + "fonts", { recursive: true });

	if (!fs.existsSync(dirMaterial + "fonts/regular-font.ttf")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf").pipe(fs.createWriteStream(dirMaterial + "fonts/regular-font.ttf"));
	if (!fs.existsSync(dirMaterial + "fonts/bold-font.ttf")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf").pipe(fs.createWriteStream(dirMaterial + "fonts/bold-font.ttf"));
}

export async function event({ event, ThreadsAll, UsersAll, client }) {
	try {
		const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
		const UsersData = UsersAll.find(item => item.id == event.senderID);

		UsersData.exp = parseInt(UsersData.exp) + 1;

		ThreadsData.ExpToday = parseInt(ThreadsData.ExpToday) + 1;

		ThreadsData.messageCount = parseInt(ThreadsData.messageCount) + 1;
		if (!ThreadsData.ExpGrpup.some(item => item.id == event.senderID)) {
			ThreadsData.ExpGrpup.push({ id: event.senderID, exp: 1, ExpToday: 1 })
		}
		if (ThreadsData.ExpGrpup.some(item => item.id == event.senderID)) {
			const DataExp = ThreadsData.ExpGrpup.find(item => item.id == event.senderID)
			DataExp.exp = parseInt(DataExp.exp) + 1;
			DataExp.ExpToday = parseInt(DataExp.ExpToday) + 1
		}
		fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
		fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));

	} catch (e) { console.log(e) }
}


export async function run({ api, event, args, UsersAll }) {
	try {
		const mention = Object.keys(event.mentions);
		let dataAll = [];
		for (let Data of UsersAll) {
			dataAll.push({ ID: parseInt(Data.id), exp: Data.exp })
		}
		dataAll.sort((a, b) => {
			if (a.exp > b.exp) return -1;
			if (a.exp < b.exp) return 1;
			if (a.ID > b.ID) return 1;
			if (a.ID < b.ID) return -1;
		});

		if (args.length == 0) {
			const UsersData = UsersAll.find(item => item.id == event.senderID);
			const rank = dataAll.findIndex(item => parseInt(item.ID) == parseInt(event.senderID)) + 1;
			const name = UsersData.name || (await api.getUserInfo(event.senderID))[event.senderID].name;
			if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
			const point = await this.getInfo(event.senderID, UsersAll);
			const infoUser = dataAll[rank - 1];
			const pathRankCard = await this.makeRankCard({ id: event.senderID, name, rank, ...point })
			return api.sendMessage({ body: `Bạn đứng hạng ${rank}/${UsersAll.length} người dùng với:\n» Tổng tin nhắn: ${infoUser.exp} tin nhắn`, attachment: fs.createReadStream(pathRankCard, { 'highWaterMark': 128 * 1024 }) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
		}
		if (mention.length == 1) {
			const UsersData = UsersAll.find(item => item.id == mention[0]);
			const rank = dataAll.findIndex(item => parseInt(item.ID) == parseInt(mention[0])) + 1;
			const name = UsersData.name || (await api.getUserInfo(mention[0]))[mention[0]].name;
			if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
			const point = await this.getInfo(mention[0], UsersAll);
			const pathRankCard = await this.makeRankCard({ id: mention[0], name, rank, ...point })
			const infoUser = dataAll[rank - 1];
			return api.sendMessage({ body: `Bạn đứng hạng ${rank}/${UsersAll.length} người dùng với:\n» Tổng tin nhắn: ${infoUser.exp} tin nhắn`, attachment: fs.createReadStream(pathRankCard) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
		}
	} catch (e) { console.log(e) }
}
