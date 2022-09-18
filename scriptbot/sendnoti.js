module.exports.config = {
	name: "sendnoti",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "NDKhánh",
	description: "Gửi thông báo đến các nhóm",
	shortDescription: "Gửi thông báo",
	usages: [
		'sendnoti <xxxx>: Nội dung thông báo',
		'sendnoti reply <xxxx>: reply [video/ảnh/audio] Nội dung thông báo'
	],
	cooldowns: 5
};


module.exports.run = async function ({ api, event, args, ThreadsAll, utils }) {
	try {
		const fs = require("fs-extra");
		if (!args[0]) return api.sendMessage("Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm", event.threadID);
		const attachmentSend = [];
		async function getAttachments(attachments) {
			const fs = require("fs-extra");
			const { resolve } = require("path");
			let startFile = 0;
			for (const data of attachments) {
				const ext = data.type == "photo" ? "jpg" :
					data.type == "video" ? "mp4" :
						data.type == "audio" ? "m4a" :
							data.type == "animated_image" ? "gif" : "txt";
				const pathSave = resolve(__dirname, 'cache', `${startFile}.${ext}`);
				++startFile;
				const url = data.url;
				await utils.downloadFile(url, pathSave);
				attachmentSend.push(fs.createReadStream(pathSave));
			}
		}
		if (event.messageReply) {
			if (event.messageReply.attachments.length > 0) {
				await getAttachments(event.messageReply.attachments);
			}
		}
		else if (event.attachments.length > 0) {
			await getAttachments(event.attachments);
		}
		if (event.type == "message_reply") {
			let allThread = [], sendSucces = 0, sendError = [];
			for (let data of ThreadsAll) {
				allThread.push(data.threadID);
			}
			for (let tid of allThread) {
				if (isNaN(parseInt(tid)) || tid == event.threadID) ""
				else {
					api.sendMessage({ body: "[ Thông báo từ ADMINBOT ]\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰\n\n" + args.join(` `), attachment: attachmentSend }, tid, (error, info) => {
						if (error) sendError.push(tid);
					});
					++sendSucces;
					await new Promise(resolve => setTimeout(resolve, 5000));
				}
			}
			return api.sendMessage(`Đã gửi thông báo đến ${sendSucces} nhóm thành công\n${sendError.length > 0 ? `Có lỗi xảy ra khi gửi đến ${sendError.length} nhóm` : ""}`, event.threadID, event.messageID);
		} else {
			let allThread = [], sendSucces = 0, sendError = [];
			for (let data of ThreadsAll) {
				allThread.push(data.threadID);
			}
			for (const idThread of allThread) {
				if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
				else {
					api.sendMessage({ body: "[ Thông báo từ ADMINBOT ]\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰\n\n" + args.join(` `) }, idThread, (error, info) => {
						if (error) sendError.push(idThread);
					});
					++sendSucces;
					await new Promise(resolve => setTimeout(resolve, 5000));
				}
			}
			return api.sendMessage(`Đã gửi thông báo đến ${sendSucces} nhóm thành công\n${sendError.length > 0 ? `Có lỗi xảy ra khi gửi đến ${sendError.length} nhóm` : ""}`, event.threadID, event.messageID);
		}
	} catch (e) {
		console.log(e)
	}
}
