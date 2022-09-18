export default {
	name: "trans",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Dịch văn bản",
	shortDescription: "Dịch văn bản",
	usages: [
		'trans [en/ko/ja/vi] <xxxx>: nội dung cần dịch'
	],
	cooldowns: 5
};

import axios from "axios";

export async function run({ api, event, args, utils }) {
	try {
		var content = args.join(" ");
		if (content.length == 0 && event.type != "message_reply") return utils.throwError(this.config.name, event.threadID, event.messageID);
		var translateThis = content.slice(0, content.indexOf(" ->"));
		var lang = content.substring(content.indexOf(" -> ") + 4);
		if (event.type == "message_reply") {
			translateThis = event.messageReply.body
			if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
			else lang = 'vi';
		}
		else if (content.indexOf(" -> ") == -1) {
			translateThis = content.slice(0, content.length)
			lang = 'vi';
		}


		let data = (await axios.get(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`))).data;
		var text = '';
		data[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (data[2] === data[8][0][0]) ? data[2] : data[8][0][0]
		api.sendMessage(`Bản dịch: ${text}\n - được dịch từ ${fromLang} sang ${lang}`, event.threadID, event.messageID);
	} catch (e) {
		console.log(e)
		return api.sendMessage("Đã có lỗi xảy ra!", event.threadID, event.messageID);
	}

}
