
export default {
	name: "pp",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "Dũngkon",
	description: "pp",
	shortDescription: "pp",
	usages: [''],
	cooldowns: 5
};
export async function noprefix({ api, event, UsersAll, global }) {
	const tag = UsersAll.find(item => item.id == event.senderID).name
	var { threadID, messageID, senderID } = event;
	let output = "chào Bạn ";
	let varinput = [ "Pp", "pp", "Paipai", "paipai", "pai", "Pai", "pai pai", "Pai pai", "bai", "Bai" ];
	for (const input of varinput) {
		if ( event.body == input ) {
		return api.sendMessage({body: output + tag + '\nChúc bạn ra đi thanh thản !\n» SUMICHAN «',
		mentions:[{
			tag: tag,
			id: senderID
		}]}, threadID, messageID);
		}
	}
	}
	export async function run() {}