export default {
	name: "say",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Khiến bot trả về file âm thanh của chị google thông qua văn bản",
	shortDescription: "Giọng Chị Google",
	usages: [
		'say: bla bla',
		'say <[ru/en/ko/ja]>: bla bla '
	],
	dependencies: ["fs-extra", "path"],
	cooldowns: 15
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, event, args, utils }) {
	try {
		var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		var languageToSay = (["ru", "en", "ko", "ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : "vi";
		var msg = (languageToSay != "vi") ? content.slice(3, content.length) : content;
		const path = ps.resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		await utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);
		return api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
	} catch (e) {
		const path = ps.resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		await utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent("dài quá đếc thèm đọc =)")}&tl=vi&client=tw-ob`, path);
		return api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
	};

}
