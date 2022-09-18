export default {
	name: "tik",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Lấy [info/video] TikTok",
	shortDescription: "[info/video]",
	usages: [
	    'tik info <xxxx>: Lấy info Tik Tok bằng id',
		'tik video <xxxx>: tải video Tik Tok không logo bằng link'
    ],
	cooldowns: 5
};

import axios from 'axios';  
import tiktok from 'tiktok-scraper';
import fs from 'fs-extra';
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, event, args, utils }) {
	try {
		switch (args[0]) {
			case "-i":
			case "info": {
				if (!args.slice(1).join(" ") != " " ) return api.sendMessage("[ TIK TOK INFO ]\n» Bạn phải nhập ID Tik Tok!", event.threadID, event.messageID);
				const options = { 
					number: 100,
					by_user_id: true, 
					sessionList: ['sid_tt=cf1971e064e2e47e2f11d4abfe4ac7e8s'] 
				};
				
				try {
				const user = await tiktok.getUserProfileInfo(args.slice(1).join(" "), options);
				const id = user.user.uniqueId;
				const name = user.user.nickname;
				const followe = user.stats.followerCount;
				const followi = user.stats.followingCount;
				const video = user.stats.videoCount;
				const abc = user.user.signature;
				const tym = user.stats.heart;
				const img = user.user.avatarMedium;
				const path = ps.resolve(__dirname, 'cache', `TikTok.png`);
				await utils.downloadFile(img, path);
				const body = `👀Tên: ${name}\n🪧ID: ${id}\n${abc}\n✅Follower: ${parseInt(followe).toLocaleString()}\n❌Following: ${parseInt(followi).toLocaleString()}\n💗Số lượt tym: ${parseInt(tym).toLocaleString()}\n🖥Số video: ${parseInt(video).toLocaleString()} `
				return api.sendMessage({body: body, attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			    } catch {
					return api.sendMessage("[ TIK TOK INFO ]\n» ID không đúng hoặc người dùng không tồn tại!", event.threadID, event.messageID);
				}
			}
			case "-v":
			case "video": {
				try {
					if (!args.slice(1).join(" ") != " " ) return api.sendMessage("[ TIK TOK VIDEO ]\n» Bạn phải nhập URL VIDOE Tik Tok!", event.threadID, event.messageID);
					api.sendMessage(`[ VIDEO DOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
			        setTimeout(() => {api.unsendMessage(info.messageID) } , 5000));
					const path = ps.resolve(__dirname, 'cache', `TikTok.mp4`);			
					await utils.downloadFile(encodeURI(`https://sumichan.tk/tiktok?url=${args.slice(1).join(" ")}&type=video`), path);
					if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
					else return api.sendMessage({body : "Loading success ✅" , attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path), event.messageID)
				} catch (e){
					console.log(e)
					return api.sendMessage('Không thể xử lý yêu cầu của bạn!', event.threadID, event.messageID);
				}
			}
			default: {
				return utils.throwError(this.config.name, event.threadID, event.messageID);
			}
		}
} catch (e) {
	console.log(e)
}
}