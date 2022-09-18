export default {
	name: "sound",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Phát nhạc thông qua link SoundCloud hoặc từ khoá tìm kiếm",
	shortDescription: "Phát nhạc YTB",
	usages: [
	    'sound: Tên bài hát',
	    'sound <xxxx>: Link sound'
    ],
	cooldowns: 5
};

import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function handleReply({ api, event, handleReply, utils }) {
	try {
	  const push = []
    push.push(Date.now())
    api.unsendMessage(handleReply.messageID);
		api.sendMessage(`[ SOUND DOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\n${handleReply.link[event.body - 1].title}\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
			setTimeout(() => {api.unsendMessage(info.messageID) } , 10000));
		    const body = `🎵 Title: ${handleReply.link[event.body -1].title}\n⏱️ Thời gian: ${handleReply.link[event.body -1].full_duration}\n⏱️Thời gian xử lý:  ${Math.floor((Date.now()- push[0])/1000)} giây\n💿===[ PROJECT SUMI ]===💿`;
			const path = ps.resolve(__dirname, 'cache', `sound${handleReply.author}.mp3`);
			await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/soundCloud/download?q=${handleReply.link[event.body -1].permalink_url}`), path);
			if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
			else return api.sendMessage({body : `${body}`, attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path));	
		}
	catch (e) {
		console.log(e)
		api.sendMessage("Không thể xử lý yêu cầu của bạn!", event.threadID, event.messageID);
	}
}

export async function run ({ api, event, args, global, client, utils }) {
	if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
	if (args.join(" ").indexOf("https://") == 0) {
		try {
		  const push = []
      push.push(Date.now())
      const { data : getInfo } = await axios.get(encodeURI(`http://sumibot-api.herokuapp.com/soundCloud/info?URL=${args[0]}`))
		  const path = ps.resolve(__dirname, 'cache', `sound${event.senderID}.mp3`);
		  var body = `🎵 Title: ${getInfo.Data.title}\n⏱️ Thời gian: ${new Date(getInfo.Data.duration).toISOString().slice(11, 19)}\n⏱️Thời gian xử lý: ${Math.floor((Date.now()- push[0])/1000)} giây\n💿==PROJECT SUMI==💿`
			await utils.downloadFile(encodeURI(`http://sumibot-api.herokuapp.com/soundCloud/download?q=${args[0]}`), path);
			if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
			else return api.sendMessage({body : `${body}`, attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path));	
			}
		catch (e) {
			console.log(e);
			api.sendMessage("Không thể xử lý yêu cầu của bạn!", event.threadID, event.messageID);
		}

	}	else {
		try {
		  const keywordSearch = args.join(" ");
			var link = [], msg = "", num = 0;
			var { data: getData } = await axios.get(encodeURI(`http://sumibot-api.herokuapp.com/soundCloud/search?search=${keywordSearch}`))
			var stt = ["①","②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]
			for (let value of getData.Data ) {
				link.push(value);
				msg += (`${stt[num++]}/ Music: ${value.title}\nAuthor: ${value.author.full_name}\nTime:  ${value.full_duration}\n⊱ ⋅ ────────────── ⋅ ⊰\n`)
				}
			return api.sendMessage(`🎼 Có ${link.length} kết quả trùng với từ khoá tìm kiếm của bạn: \n\n${msg}\nHãy reply(phản hồi) chọn một trong những tìm kiếm trên\nThời Gian Bài Hát Tối Đa Là 10M!`, event.threadID,(error, info) => client.handleReply.push({ name: this.default.name, messageID: info.messageID, author: event.senderID, link }), event.messageID);
		}
		catch (error) {
			api.sendMessage("Không thể xử lý request do dã phát sinh lỗi: " + error.message, event.threadID, event.messageID);
		}
	}
}