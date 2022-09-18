export default {
	name: "getlink",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Lấy url download từ video, audio được gửi từ nhóm",
	shortDescription: "Lấy url download",
	usages: [
		'getlink: Reply video, audio cần lấy url download'
	],
	cooldowns: 5
};

import tinyurl from "tinyurl";
export async function run({ api, event }) {
	try {
		let { messageReply, threadID } = event;
		if (event.type !== "message_reply") return api.sendMessage("Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
		if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
		else {
			let num = 0
			let msg = `Có ${messageReply.attachments.length} tệp đính kèm:\n`
			for (var i = 0; i < messageReply.attachments.length; i++) {
				var shortLink = await tinyurl.shorten(messageReply.attachments[i].url);
				num += 1;
				msg += `${num}: ${shortLink}\n`;
			}
			api.sendMessage(msg, threadID);
		}
	} catch (e) { console.log(e) }
}
