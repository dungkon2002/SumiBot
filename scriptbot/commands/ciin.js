export default {
	name: "ciin",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Dũngkon",
	description: "Thư viện Ảnh ciin",
	shortDescription: "Thư viện Ảnh ciin",
	usages: [
		'ciin: random ảnh ciin'
	],
	cooldowns: 5
};

import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, event, utils, UsersAll, client }) {
	try {
		const UsersData = UsersAll.find(item => item.id == event.senderID);
		const money = UsersAll.find(item => item.id == event.senderID).money;
		const fee = await utils.MinMax(1, 2)
		if (money < fee) return api.sendMessage(`Số coin của bạn không đủ để xem ảnh`, event.threadID, event.messageID);
		const path = ps.resolve(__dirname, 'cache', `ciin.png`);
		const { data } = (await axios.get(`https://image-random-api.dungkon.repl.co/ciin/?apikey=0bk3s6IAyq`))
		await utils.downloadFile(data.url, path)
		return api.sendMessage({ body: `» SUMICHAN «\n» Bạn đã sử dụng:\n${fee} coin để xem ảnh này\n» Số dư còn lại: ${(parseInt(money) - parseInt(fee))} coin`, attachment: fs.createReadStream(path) }, event.threadID, async () => {
			UsersData.money = parseInt(UsersData.money) - parseInt(fee)
			fs.writeFileSync(client.dirMain - "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
			fs.unlinkSync(path)
		});
	} catch (e) {
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
