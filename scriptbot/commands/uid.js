export default {
	name: "uid",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Lấy UID Facebook",
	shortDescription: "Lấy UID",
	usages: [
		'uid: Lấy uid của bạn',
		'uid @tag: Lấy uid người bạn tag',
		'uid <xxxx>: Lấy uid bằng link'
	],
	dependencies: ["fb-tools"],
	cooldowns: 5
};

export async function run({ api, event, args, utils }) {
	try {
		if (!args[0]) {
			return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
		} else if (Object.keys(event.mentions) == 0) {
			const data = await utils.findidfb(args.join(" "))
			return api.sendMessage(`${data.uid}`, event.threadID, event.messageID);
		}
		else {
			for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
			return;
		}
	} catch (e) {
		console.log(e)
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
