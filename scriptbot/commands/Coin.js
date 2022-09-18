export default {
	name: "coins",
	version: "1.0.3-hotfix2",
	hasPermssion: 2,
	credits: "Dũng UwU & Thọ (NDK Fix)",
	description: "Tăng giảm tiền",
	shortDescription: "Tăng giảm tiền",
	usages: [
		'coins: [inc/dec]'
	],
	cooldowns: 5
}
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, args, utils, UsersAll }) {
	let { threadID, messageID, senderID } = event;
	const coins = parseInt(args[2])
	const userID = Object.keys(event.mentions)[0];
	var nameL
	switch (args[0]) {
		case "inc": {
			if (args[1] == 'me') return api.sendMessage({ body: `» SUMICHAN «\nĐã thêm cho bản thân ${coins} coins` }, threadID, async () => {
				const UsersData = UsersAll.find(item => item.id == event.senderID);
				UsersData.money = parseInt(UsersData.money) + parseInt(coins)
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
			}, messageID);
			if (userID) nameL = event.mentions[userID].split(" ").length
			return api.sendMessage({ body: '» SUMICHAN «\nĐã chuyển cho ' + event.mentions[userID].replace(/@/g, "") + ` ${args[1 + nameL]} coins` }, threadID, async () => {
				const UsersData = UsersAll.find(item => item.id == userID);
				UsersData.money = parseInt(UsersData.money) + parseInt(args[1 + nameL])
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
			}, messageID);
		}
			break;
		case "dec": {
			if (args[1] == 'me') {
				const UsersData = UsersAll.find(item => item.id == event.senderID);
				let balance = UsersData.money;
				if (args[2] == "all") return api.sendMessage(`» SUMICHAN «\nBạn đã giảm toàn bộ tiền của bản thân`, threadID, async () => {
					const UsersData = UsersAll.find(item => item.id == event.senderID);
					UsersData.money = parseInt(UsersData.money) - parseInt(balance)
					fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));

				}, messageID);
				if (!isNaN(args[2])) {
					if (coins > balance) return api.sendMessage("» SUMICHAN «\nSố coins bạn giảm lớn hơn số coins hiện có", threadID, messageID)
					else return api.sendMessage(`» SUMICHAN «\nĐã giảm ${coins} coins của bản thân`, threadID, async () => {
						const UsersData = UsersAll.find(item => item.id == event.senderID);
						UsersData.money = parseInt(UsersData.money) - parseInt(coins);
						fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
					}, messageID);
				}
				else return api.sendMessage("» SUMICHAN «\nVui lòng nhập số coins muốn giảm", threadID, messageID)
			}
			else if (userID) {
				nameL = event.mentions[userID].split(" ").length
				const UsersData = UsersAll.find(item => item.id == userID);
				let balance = UsersData.money;
				if (args[1 + nameL] == "all") return api.sendMessage(`» SUMICHAN «\nBạn đã giảm toàn bộ coins của ${event.mentions[userID].replace(/@/g, "")}`, threadID, async () => {
					const UsersData = UsersAll.find(item => item.id == userID);
					UsersData.money = parseInt(UsersData.money) - parseInt(balance)
					fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				}, messageID);

				api.sendMessage({ body: `» SUMICHAN «\nĐã giảm ${args[1 + nameL]} coins của ` + event.mentions[userID].replace(/@/g, "") }, threadID, async () => {
					const UsersData = UsersAll.find(item => item.id == userID);
					UsersData.money = parseInt(UsersData.money) - parseInt(args[1 + nameL])
					fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				}, messageID);
			}
			else return api.sendMessage("» SUMICHAN «\nBạn muốn giảm coin của ai", threadID, messageID)
		}
			break;
		default:
			return utils.throwError("coins", threadID, messageID);
			break;
	}
}
