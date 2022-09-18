export default {
	name: "unsend",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Gỡ tin nhắn bot đã gửi",
	shortDescription: "Gỡ tin nhắn bot",
	usages: [
		'unsend: Reply tin nhắn bot cần gỡ'
	],
	cooldowns: 5
};

export async function run({ api, event }) {
	try {
		if (event.type != "message_reply") return api.sendMessage('Hãy reply tin nhắn cần gỡ.', event.threadID, event.messageID);
		if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage('Không thể gỡ tin nhắn của người khác.', event.threadID, event.messageID);
		return api.unsendMessage(event.messageReply.messageID);
	} catch (e) { console.log(e) }
}
