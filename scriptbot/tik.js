module.exports.config = {
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
	dependencies: ["axios", "tiktok-scraper", "fs-extra", "path"],
	cooldowns: 5
};

const axios = require('axios');
const tikk = require('tiktok-scraper');
const fs = require('fs-extra');
const { resolve } = require("path");

module.exports.run = async function ({ api, event, args, utils }) {
	try {
		switch (args[0]) {
			case "-i":
			case "info": {
				if (!args.slice(1).join(" ") != " ") return api.sendMessage("[ TIK TOK INFO ]\n» Bạn phải nhập ID Tik Tok!", event.threadID, event.messageID);
				const options = {
					number: 100,
					by_user_id: true,
					sessionList: ['sid_tt=7e800f3706329b00638cb9d46f36a1b4']
				};

				try {
					const user = await tikk.getUserProfileInfo(args.slice(1).join(" "), options);
					const id = user.user.uniqueId;
					const name = user.user.nickname;
					const followe = user.stats.followerCount;
					const followi = user.stats.followingCount;
					const video = await user.stats.videoCount;
					const abc = await user.user.signature;
					const tym = await user.stats.heart;
					const img = await user.user.avatarMedium;
					const path = resolve(__dirname, 'cache', `TikTok.png`);
					await utils.downloadFile(img, path);
					const body = `👀Tên: ${name}\n🪧ID: ${id}\n${abc}\n✅Follower: ${parseInt(followe).toLocaleString()}\n❌Following: ${parseInt(followi).toLocaleString()}\n💗Số lượt tym: ${parseInt(tym).toLocaleString()}\n🖥Số video: ${parseInt(video).toLocaleString()} `
					return api.sendMessage({ body: body, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
				} catch {
					return api.sendMessage("[ TIK TOK INFO ]\n» ID không đúng hoặc người dùng không tồn tại!", event.threadID, event.messageID);
				}
			}
			case "-v":
			case "video": {
				try {
					if (!args.slice(1).join(" ") != " ") return api.sendMessage("[ TIK TOK VIDEO ]\n» Bạn phải nhập URL VIDOE Tik Tok!", event.threadID, event.messageID);
					api.sendMessage(`[ VIDEO DOWNLOAD ]\n⊱ ⋅ ────────────── ⋅ ⊰\nXin Vui lòng Đợi !`, event.threadID, (err, info) =>
						setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
					const options = {
						noWaterMark: true,
						hdVideo: true
					};
					const videoMeta = await tikk.getVideoMeta(args.slice(1).join(" "), options);
					const id = videoMeta.collector[0].id
					const name = videoMeta.collector[0].authorMeta.name
					const options1 = {
						method: 'GET',
						url: 'https://video-nwm.p.rapidapi.com/url/',
						params: { url: `\'https://www.tiktok.com/@${name}/video/${id}\'` },
						headers: {
							'x-rapidapi-key': '6535f33dffmsh5f43874ed2e707fp1231cfjsn409b1e61e094',
							'x-rapidapi-host': 'video-nwm.p.rapidapi.com'
						}
					};
					const data = await axios.request(options1);
					if (data.data.item.video.playAddr[0] == undefined) get = data.data.item.video.playAddr
					else get = data.data.item.video.playAddr[0]
					const path = resolve(__dirname, 'cache', `TikTok.mp4`);
					await utils.downloadFile(get, path);
					if (fs.statSync(path).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
					else return api.sendMessage({ body: "Loading success ✅", attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID)
				} catch {
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
