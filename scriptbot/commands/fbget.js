export default {
	name: "fbget",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Tải video facebook bằng link",
	shortDescription: "Tải video facebook",
	usages: [
		'fbget -mp3 <xxxx>: nhập link video facebook muốn tải nhạc',
		'fbget -video <xxxx>: nhập link video facebook muốn tải video'
	],
	cooldowns: 5
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, event, args, utils }) {
	try {
		switch (args[0]) {
			case "-v":
			case "-video": {
				if (event.type == "message_reply") {
					api.sendMessage(`[ FBDOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
						setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
					try {
						const id = await utils.randomString(10)
						const path = ps.resolve(__dirname, 'cache', `${id}.mp4`);
						await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/fbdown?URLz=${event.messageReply.body}&type=HD`), path);
						const body = `[ FBDOWN DONE ✅ ]`
						if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
						else return api.sendMessage({ body: body, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
					} catch (e) {
						console.log(e)
						return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nkhông thể xử lý yêu cầu của bạn!`, event.threadID, event.messageID);
					}
				}
				if (!args.slice(1).join(" ") != " ") return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nVui lòng nhập link video cần tải!`, event.threadID, event.messageID);
				api.sendMessage(`[ FBDOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
					setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
				try {
					const id = await utils.randomString(10)
					const path = ps.resolve(__dirname, 'cache', `${id}.mp4`);
					await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/fbdown?URLz=${args.slice(1).join(" ")}&type=HD`), path);
					const body = `[ FBDOWN DONE ✅ ]`
					if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
					else return api.sendMessage({ body: body, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
				} catch (e) {
					console.log(e)
					return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nkhông thể xử lý yêu cầu của bạn!`, event.threadID, event.messageID);
				}
			}
			case "-m":
			case "-mp3": {
				if (event.type == "message_reply") {
					api.sendMessage(`[ FBDOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
						setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
					try {
						const id = await utils.randomString(10)
						const path = ps.resolve(__dirname, 'cache', `${id}.m4a`);
						await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/fbdown?URLz=${event.messageReply.body}&type=SD`), path);
						const body = `[ FBDOWN DONE ✅ ]`
						if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
						else return api.sendMessage({ body: body, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
					} catch (e) {
						console.log(e)
						return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nkhông thể xử lý yêu cầu của bạn!`, event.threadID, event.messageID);
					}
				}
				if (!args.slice(1).join(" ") != " ") return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nVui lòng nhập link audio cần tải!`, event.threadID, event.messageID);
				api.sendMessage(`[ FBDOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
					setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
				try {
					const id = await utils.randomString(10)
					const path = ps.resolve(__dirname, 'cache', `${id}.m4a`);
					await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/fbdown?URLz=${args.slice(1).join(" ")}&type=SD`), path);
					const body = `[ FBDOWN DONE ✅ ]`
					if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
					else return api.sendMessage({ body: body, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
				} catch (e) {
					console.log(e)
					return api.sendMessage(`[ FBDOWN ERROR ❎ ]\nkhông thể xử lý yêu cầu của bạn!`, event.threadID, event.messageID);
				}
			}
			default: {
				return utils.throwError(this.config.name, event.threadID, event.messageID);
			}
		}
	} catch (e) {
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
