export default {
	name: "money",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Kiểm tra số tiền của bản thân hoặc người được tag",
	shortDescription: "Kiểm tra số tiền",
	usages: [
		'money: Kiểm tra số tiền của bản thân',
		'money @tag: Kiểm tra số tiền của người được tag',
		'money @tag nhiều người: Kiểm tra số tiền của người được tag'
	],
	cooldowns: 5
};


export async function run({ api, event, args, utils, UsersAll }) {
	try {
		if (!args[0]) {
			const money = UsersAll.find(item => item.id == event.senderID).money;
			return api.sendMessage(`» SUMICHAN «\nSố tiền bạn hiện đang có: ${money} coin`, event.threadID);
		}
		else if (Object.keys(event.mentions).length == 1) {
			var mention = Object.keys(event.mentions)[0];
			const money = UsersAll.find(item => item.id == mention).money;
			return api.sendMessage({
				body: `Số tiền của ${event.mentions[mention].replace("@", "")}\nHiện đang có là: ${money} coin.`,
				mentions: [{
					tag: event.mentions[mention].replace("@", ""),
					id: mention
				}]
			}, event.threadID, event.messageID);
		}
		else if (Object.keys(event.mentions).length > 0) {
			let mention = Object.keys(event.mentions);
			let msg = "";
			for (let value of mention) {
				let data = UsersAll.find(item => item.id == value) || {};
				if (!data) data.money = 0;
				msg += (` - ${event.mentions[value].replace("@", "")}: ${data.money} coin\n`);
			};
			return api.sendMessage(`» SUMICHAN «\nSố tiền của thành viên: \n${msg}`, event.threadID, event.messageID);
		}
		else return utils.throwError(this.config.name, event.threadID, event.messageID);
	} catch (e) {
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
