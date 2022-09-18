export default {
	name: "baucua",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Bầu cua cá cược nhà cái đến từ Châu Âu",
	shortDescription: "Chơi bầu cua cá cược nhà cái đến từ Châu Âu",
	usages: [
	    'baucua: baucua500'
    ],
	cooldowns: 5
};
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, UsersAll, event, args, Currencies }) {
	try {
            let { threadID, messageID, senderID } = event;
            const slotItems = ["🦀","🐟","🍐"];
			let money = UsersAll.find(item => item.id == mention).money;
			const coins = parseInt(args[2])
			if (!coin) return api.sendMessage(`Bạn chưa nhập số tiền đặt cược!`, threadID, messageID);
			let win = false;
			if (isNaN(coin)|| coin.indexOf("-") !== -1) 
				return api.sendMessage(`Số tiền đặt cược của bạn không phải là một con số, vui lòng xem lại cách sử dụng tại ${global.config.prefix}help baucua`, threadID, messageID);
			if (!coin) return api.sendMessage("Chưa nhập số tiền đặt cược!", threadID, messageID);
			if (coin > money) return api.sendMessage(`Số tiền của bạn không đủ`, threadID, messageID);
			if (coin < 50) return api.sendMessage(`Số tiền đặt cược của bạn quá nhỏ, tối thiểu là 50 đô!`, threadID, messageID);
			let number = [];
			for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
			if (number[0] == number[1] && number[1] == number[2]) {
				money *= 9;
				win = true;
			}
				else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
					money *= 2;
					win = false;
				}
				(win) ? api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}|\nBạn đã thắng\Nhận được ${coin} đô.`, threadID, () => 
					Currencies.increaseMoney(senderID, parseInt(coin)), messageID) :
				 api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}|\nBạn đã thua\nSố tiền bạn đặt thuộc về nhà cái`, threadID, () => 
				 	Currencies.decreaseMoney(senderID, parseInt(coin)), messageID);
} catch (e) {
	console.log(e)
}
}