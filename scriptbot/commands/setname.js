export default {
	name: "setname",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Đổi biệt danh trong nhóm của bạn hoặc của người bạn tag",
	shortDescription: "Đổi biệt danh",
	usages: [
		'setname : Gỡ biệt danh danh của bạn!',
	    'setname <xxxx>: đổi biệt danh của bạn!',
	    'setname @tag: Gỡ biệt danh người @tag',
		'setname @tag <xxxx>: đổi biệt danh của người bạn @tag'
    ],
	cooldowns: 5
};

export async function run({ api, event, args }) {
	try {
		const name = args.join(" ")
		const mention = Object.keys(event.mentions)[0];
		if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
		if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
    } catch (e) {
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}