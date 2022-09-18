export default {
	name: "uptime",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Kiểm tra thời gian bot đã online",
	shortDescription: "thời gian bot online",
	usages: [
		'uptime: Kiểm tra thời gian bot đã online'
	],
	cooldowns: 5
};

export async function run({ api, event, UsersAll, ThreadsAll, ThreadSettings, global }) {
	try {
		const time = process.uptime(),
			hours = Math.floor(time / (60 * 60)),
			minutes = Math.floor((time % (60 * 60)) / 60),
			seconds = Math.floor(time % 60);
		const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
		const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX
		const timeStart = Date.now();
		return api.sendMessage("", event.threadID, () => api.sendMessage(`[ UPTIME ]\n» Thời gian online: ${hours} : ${minutes} : ${seconds}\n» Tổng người dùng: ${UsersAll.length}\n» Tổng Nhóm: ${ThreadsAll.length}\n» PREFIX: ${prefix}\nPing: ${Date.now() - timeStart}ms\n[ Project SumiBot ]`, event.threadID, event.messageID));
	} catch { return }
}
