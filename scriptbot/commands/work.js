export default {
	name: "work",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Có làm thì mới có ăn!",
	shortDescription: "Có làm thì mới có ăn!",
	usages: [
	    'work: làm ziệc'
    ],
    cooldowns: 5,
    data: {
        cooldownTime: 1200000
    }
};

import fs from "fs-extra"
export async function run({ api, event, client, UsersAll }) {
	try {
		const { threadID, messageID } = event;
		const cooldown = this.default.data.cooldownTime;
		const UsersData = UsersAll.find(item => item.id == event.senderID);
		if(!UsersData.Data.TimeWork) UsersData.Data.TimeWork = 0;
		fs.writeFileSync(client.dirMain + "/data/Users.json",JSON.stringify(UsersAll, null, "\t"));
		const data = UsersData.Data.TimeWork;
		if (typeof data !== undefined && cooldown - (Date.now() - data) > 0) {
			var time = cooldown - (Date.now() - data),
				minutes = Math.floor(time / 60000),
				seconds = ((time % 60000) / 1000).toFixed(0);
			
			return api.sendMessage(`Bạn đang trong thời gian chờ\nVui lòng thử lại sau: ${minutes} phút ${(seconds < 10 ? "0" : "")}${seconds} giây!`, event.threadID, event.messageID);
		}
		else {
			const job = [
				"đi bán vé số",
				"đi sửa xe",
				"làm nhân viên lập trình",
				"đi hack facebook",
				"làm thợ sửa ống nước ( ͡° ͜ʖ ͡°)",
				"làm đầu bếp",
				"làm thợ hồ",
				"fake taxi",
				"đi gangbang người khác",
				"làm re sờ chym mờ",
				"đi bán hàng online",
				"làm nội trợ",
				"đi vả mấy thằng sao đỏ, giun vàng",
				"đi bán hoa",
				"tìm jav/hentai code cho Nghĩa",
				"đi chơi Yasuo trong rank và gánh team"
			];
			const amount = Math.floor(Math.random() * 500);
			return api.sendMessage(`Bạn ${job[Math.floor(Math.random() * job.length)]} và đã nhận được số tiền là: ${amount} coins`, threadID, async () => {
				UsersData.money = parseInt(UsersData.money) + parseInt(amount)
				UsersData.Data.TimeWork = Date.now()
				fs.writeFileSync(client.dirMain + "/data/Users.json",JSON.stringify(UsersAll, null, "\t"));
			}, messageID);
		}
} catch (e) {
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}