export default {
	name: "setprefix",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "NDKhánh",
	description: "Thay đổi Prefix cho nhóm",
	shortDescription: "Thay đổi Prefix",
	usages: [
	'setprefix <xxxx>: Prefix muốn bạn đổi',
	'setprefix reset: Trở về prefix mặc định của bot'
],
	cooldowns: 5
};

import fs from "fs-extra"

export async function  handleReaction({ api, event, client, ThreadsAll, ThreadSettings, global, handleReaction }) {
	if (event.userID != handleReaction.author) return;
	try {
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
	ThreadsData.settings = {"PREFIX": handleReaction.PREFIX}
	fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
	if (!ThreadSettings.some(item => item.id == event.threadID)) {
	ThreadSettings.push({id: parseInt(event.threadID), "PREFIX": handleReaction.PREFIX})
		fs.writeFileSync(client.dirMain + "/data/ThreadSettings.json",JSON.stringify(ThreadSettings, null, "\t"));
	} else if (ThreadSettings.some(item => item.id == event.threadID)) {
		const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
		threadSetting.PREFIX = handleReaction.PREFIX
		fs.writeFileSync(client.dirMain + "/data/ThreadSettings.json",JSON.stringify(ThreadSettings, null, "\t"));
	}	
		api.changeNickname(`[ ${handleReaction.PREFIX} ] • ${global.config.BOTNAME}`, event.threadID, api.getCurrentUserID());	
	return api.sendMessage(`[ ✅ SETPREFIX ]\n» Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`, event.threadID, event.messageID);
    } catch (e) { console.log(e) }
}

export async function run({ api, event, args, client, ThreadSettings, global, ThreadsAll }) {
	try {
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
	if (typeof args[0] == "undefined") return api.sendMessage("[ ❎ SETPREFIX ]\n» Phần prefix cần đặt không được để trống!", event.threadID, event.messageID);
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage("[ ❎ SETPREFIX ]\n» Phần prefix cần đặt không được để trống!", event.threadID, event.messageID);
	if (prefix == "reset") {
		const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
		threadSetting.PREFIX =  global.config.PREFIX
		fs.writeFileSync(client.dirMain + "/data/ThreadSettings.json",JSON.stringify(ThreadSettings, null, "\t"));
		ThreadsData.settings = {"PREFIX": global.config.PREFIX}
		fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
		api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`, event.threadID, api.getCurrentUserID());	
		return api.sendMessage(`[ ✅ SETPREFIX ]\n» Đã reset prefix về mặc định ${global.config.PREFIX}`, event.threadID, event.messageID);
	} else return api.sendMessage("[ ⚠️ SETPREFIX ]\n» Bạn có chắc bạn muốn đổi prefix của nhóm thành: " + prefix, event.threadID, (error, info) => {
		client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
    } catch (e) { console.log(e) }
}