export default {
	name: "video",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Phát video thông qua link YouTube hoặc từ khoá tìm kiếm",
	shortDescription: "Phát video YTB",
	usages: [
	    'video: Tên video',
	    'video <xxxx>: Link video ytb '
    ],
	data: {
		"YOUTUBE_API": "AIzaSyADhd3Wm5-HboNSOmRLTmrVWTnklyGgU00"
	},
	cooldowns: 5
};


import ytdl from "ytdl-core";
import YouTubeAPI from "simple-youtube-api";
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function handleReply({ api, event, handleReply, utils }) {
	
	try {
		ytdl.getInfo(handleReply.link[event.body - 1]).then(res => {
			let body = res.videoDetails.title;
	        api.unsendMessage(handleReply.messageID);
			return api.sendMessage(`[ VIDEO DOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\n${body}\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
			setTimeout(() => {api.unsendMessage(info.messageID) } , 10000));
			});
		    const res = await ytdl.getInfo(handleReply.link[event.body - 1])
			const body = `${res.videoDetails.title}\n👀Lượt xem:  ${parseInt(res.videoDetails.viewCount).toLocaleString()}\n👍Lượt thích: ${parseInt(res.videoDetails.likes).toLocaleString()}\n👎Không thích: ${parseInt(res.videoDetails.dislikes).toLocaleString()}`;
			const path = ps.resolve(__dirname, 'cache', `${handleReply.link[event.body - 1]}.mp4`);
		    const getfile = await utils.youtube(`https://youtu.be/${handleReply.link[event.body - 1]}`)
			await utils.downloadFile(getfile.link, path);
			if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
			else return api.sendMessage({body : `${body}`, mentions: [{ tag: body, id: handleReply.author }], attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path));	
		}
	catch (e) {
		console.log(e)
		api.sendMessage("Không thể xử lý yêu cầu của bạn!", event.threadID, event.messageID);
	}
}

export async function run ({ api, event, args, global, client, utils }) {
	const youtube = new YouTubeAPI(this.default.data.YOUTUBE_API);
	const keyapi = this.default.data.YOUTUBE_API
	if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
	const keywordSearch = args.join(" ");
	const videoPattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
	const urlValid = videoPattern.test(args[0]);
	
	if (urlValid) {
		try {
			const res = await ytdl.getInfo(args[0])
			const body = `${res.videoDetails.title}\n👀Lượt xem:  ${parseInt(res.videoDetails.viewCount).toLocaleString()}\n👍Lượt thích: ${parseInt(res.videoDetails.likes).toLocaleString()}\n👎Không thích: ${parseInt(res.videoDetails.dislikes).toLocaleString()}`;
			var id = args[0].split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
			(id[2] !== undefined) ? id = id[2].split(/[^0-9a-z_\-]/i)[0] : id = id[0];
			const path = ps.resolve(__dirname, 'cache', `${id}.mp4`);
		    const getfile = await utils.youtube(`https://youtu.be/${id}`)
			await utils.downloadFile(getfile.link, path);
			if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
			else return api.sendMessage({body : `${body}`, mentions: [{ tag: body, id: event.senderID }], attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path));	
			}
		catch (e) {
			console.log(e);
			api.sendMessage("Không thể xử lý yêu cầu của bạn!", event.threadID, event.messageID);
		}

	}
	else {
		try {
			var link = [], msg = "", num = 0;
			var results = await youtube.searchVideos(keywordSearch, 5);
			var stt = ["①","②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]
			for (let value of results) {
				if (typeof value.id == 'undefined') return;
				link.push(value.id);
				let datab = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${keyapi}`)).data;
				let gettime = datab.items[0].contentDetails.duration;
				let time = (gettime.slice(2));
				let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${keyapi}`)).data;
				let channel = datac.items[0].snippet.channelTitle;
				msg += (`${stt[num++]}. ${value.title}\n» Time: ${time}\n» Channel: ${channel}\n⊱ ⋅ ────────────── ⋅ ⊰\n`);
			}
			return api.sendMessage(`🎼 Có ${link.length} kết quả trùng với từ khoá tìm kiếm của bạn: \n${msg}\nHãy reply(phản hồi) chọn một trong những tìm kiếm trên\nThời Gian Bài Hát Tối Đa Là 4M!`, event.threadID,(error, info) => client.handleReply.push({ name: this.default.name, messageID: info.messageID, author: event.senderID, link }), event.messageID);
		}
		catch (error) {
			api.sendMessage("Không thể xử lý request do dã phát sinh lỗi: " + error.message, event.threadID, event.messageID);
		}
	}
}