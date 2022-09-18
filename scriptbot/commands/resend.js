export default {
	name: "resend",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "NDKhánh",
	description: "BOT sẽ Gửi lại tin nhắn gỡ",
	shortDescription: "Gửi lại tin nhắn gỡ",
	usages: [
		'resend: [on/off] resend'
	],
	cooldowns: 5
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function event({ event, api, client, UsersAll, utils }) {

	if (api.getCurrentUserID() == event.senderID) return;
	if (!client.message) client.message = new Array();
	if (!fs.existsSync(__dirname + "/cache/resend.json")) {
		fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify({}), null, 8);
	}

	var resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"))
	if (!Object.keys(resend).some(item => item == event.threadID.toString())) {
		if (event.isGroup) {
			resend[event.threadID] = { on: "false" };
			fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 8));
		}
	}


	resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"))
	if (!resend) return;
	if (resend[event.threadID.toString()]) {
		let getThread = resend[event.threadID.toString()]["on"];
		if (getThread == "false") return;
	}

	if (event.type != "message_unsend") client.message.push({
		msgID: event.messageID,
		msgBody: event.body,
		attachment: event.attachments
	})

	const attachmentSend = [];
	async function getAttachments(attachments) {
		let startFile = 0;
		for (const data of attachments) {
			const ext = data.type == "photo" ? "jpg" :
				data.type == "video" ? "mp4" :
					data.type == "audio" ? "m4a" :
						data.type == "animated_image" ? "gif" : "txt";
			const pathSave = ps.resolve(__dirname, 'cache', `${startFile}.${ext}`);
			++startFile;
			const url = data.url;
			await utils.downloadFile(url, pathSave);
			attachmentSend.push(fs.createReadStream(pathSave));
			setTimeout(function () {
				fs.unlinkSync(pathSave);
			}, 2000);
		}
	}

	if (event.type == "message_unsend") {
		if (!client.message.some(item => item.msgID == event.messageID)) return;
		let getUser = UsersAll.find(item => item.id == event.senderID);
		var getMsg = client.message.find(item => item.msgID == event.messageID);
		let name = getUser.name, msg = "";
		if (getMsg.attachment[0] == undefined) return api.sendMessage({ body: `${name} đã gỡ 1 tin nhắn:\n${getMsg.msgBody}`, mentions: [{ tag: name, id: event.senderID }] }, event.threadID);
		else {
			await getAttachments(getMsg.attachment)
			if (getMsg.msgBody == "") msg = `${name} vừa gỡ:\n${getMsg.attachment.length} tệp đính kèm:\n`
			else msg = `${name} vừa gỡ:\nNội Dung: ${getMsg.msgBody}\n${getMsg.attachment.length} tệp đính kèm:\n`
			api.sendMessage({ body: msg, attachment: attachmentSend, mentions: [{ tag: name, id: event.senderID }] }, event.threadID);
		}

	}
}


export async function run({ api, event }) {
	try {
		let { messageID, threadID } = event
		let resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"));
		if (!resend[threadID.toString()]) {
			resend[threadID.toString()] = { on: "false" };
			fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 8));
			return api.sendMessage("Tạo data resend thành công", threadID, messageID)
		}
		let getThread = resend[threadID.toString()];

		switch (getThread["on"]) {
			case "false":
				getThread["on"] = "true";
				api.sendMessage("Bật resend thành công!", threadID, () => fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 4)), messageID);
				break;
			case "true":
				getThread["on"] = "false";
				api.sendMessage("Tắt resend thành công!", threadID, () => fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 4)), messageID);
				break;

		}
	} catch (e) {
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
