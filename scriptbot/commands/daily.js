export default {
	name: "daily",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "nhận quà báo danh hằng ngày",
	shortDescription: "báo danh hằng ngày",
	usages: [
	    'daily: báo danh hằng ngày',
	    'daily info: xem chi tiết thưởng báo danh'
    ],
	cooldowns: 5,
	data: {
        rewardCoin: 150
    }
};

import fs from "fs-extra"
import moment from "moment-timezone"

export async function run({ api, event, args, UsersAll, global, client }) {
	try {
		if (args[0] == "info") {
		  let msg = "";
		  let i = 1;
		  for (let i = 1; i < 8; i++) {
			const getCoin = Math.floor(this.default.data.rewardCoin * (1+20/100) ** ((i == 0 ? 7 : i) - 1));
			msg += `» ${i == 7 ? "Chủ Nhật" : "Thứ " + (i + 1)}: ${getCoin} coin\n`;
		  }
		  return api.sendMessage(`Phần thưởng báo danh các ngày:\n${msg}`, event.threadID, event.messageID);
		}
		const UsersData = UsersAll.find(item => item.id == event.senderID);
		if(!UsersData.Data.TimeDaily) UsersData.Data.TimeDaily = " "
		fs.writeFileSync(client.dirMain + "/data/Users.json",JSON.stringify(UsersAll, null, "\t"));
		const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
		if (UsersData.Data.TimeDaily === dateTime) return api.sendMessage("Bạn đã nhận phần quà báo danh của ngày hôm nay rồi, vui lòng quay lại vào ngày mai", event.threadID, event.messageID);
        const date = new Date();
        let current_day = date.getDay(); // Lấy số thứ tự của ngày hiện tại
		const getCoin = Math.floor(this.default.data.rewardCoin * (1+20/100) ** ((current_day == 0 ? 7 : current_day) - 1));
		return api.sendMessage(`Bạn đã nhận ${getCoin} coin, để có thể tiếp tục nhận, vui lòng quay lại vào ngày mai`, event.threadID, async () => {
			UsersData.money = parseInt(UsersData.money) + parseInt(getCoin)
			UsersData.Data.TimeDaily = dateTime
			fs.writeFileSync(client.dirMain + "/data/Users.json",JSON.stringify(UsersAll, null, "\t"));
		})
} catch (e) {
	console.log(e)
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}