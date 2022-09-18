export default {
	name: "help",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Hướng dẫn cho người mới",
	shortDescription: "Hướng dẫn",
	usages: [
		'help <Tên lệnh>: Để xem chi tiết cách dùng'
	],
	cooldowns: 5,
};

import moment from "moment";
export function run({ api, event, args, client, ThreadSettings, global }) {
	try {
		const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm");
		const commands = client.commands.values();
		const command = client.commands.get((args[0] || "").toLowerCase())
		const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
		const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX

		if (!command && !args[0] || !isNaN(args[0])) {
			const numberOfOnePage = 20;
			const page = parseInt(args[0]) || 1;
			let msg = "", allCommand = [];
			let i = 0;
			let startSlice = numberOfOnePage * page - numberOfOnePage;
			i = startSlice;
			for (const cmd of commands) allCommand.push({ name: cmd.default.name, shortDescription: cmd.default.shortDescription });
			if (page > parseInt(Math.ceil(allCommand.length / numberOfOnePage))) return;
			else {
				const commandOfPage = allCommand.slice(startSlice, startSlice + numberOfOnePage);
				for (let commands of commandOfPage) msg += `${++i}. ${prefix}${commands.name} » ${commands.shortDescription}\n`;
				return api.sendMessage(`「 GIỜ HIỆN TẠI : ${time} 」\n\n${msg}\n» Trang [ ${page}/${Math.ceil(allCommand.length / numberOfOnePage)} ]\n» Hiện tại bot có ${allCommand.length} lệnh có thể sử dụng\n» Gõ ${prefix}help <số trang> để xem danh sách lệnh\n» Gõ ${prefix}help <tên lệnh> để xem chi tiết cách sử dụng lệnh đó\n» DONATE MOMO : 0915444012`, event.threadID, async (err, data) => {
					await new Promise(resolve => setTimeout(resolve, 60000));
					return api.unsendMessage(data.messageID);
				});
			}
		}
		else if (!command && args[0]) {

			return api.sendMessage(`[ ⚠️ HELP ]\n» Lệnh tồn tại!\n» Vui lòng sử dụng ${prefix}help để xem toàn bộ lệnh!`, event.threadID);

		}
		else {
			const usaHelp = command.default.usages;
			let usaText = "";
			for (let Usages of usaHelp) {
				usaText += `${prefix}${Usages}\n`
			}
			return api.sendMessage(`[ ${command.default.name.toUpperCase()} ]\n\n» ${command.default.description}\n\n» Người Dùng: ${((command.default.hasPermssion == 2) ? "ADMIN BOT" : (command.default.hasPermssion == 1) ? "Quản Trị Viên" : "Tất cả người dùng")}\n» CoolDowns: ${command.default.cooldowns}s\n» Credits: ${command.default.credits}\n» Prefix: ${prefix}\n\n» Hướng dẫn chi tiết:\n${usaText}\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰\n» Lưu ý:\n• Nội dung bên trong <XXXXX> là có thể thay đổi`, event.threadID, event.messageID);
		}
	} catch (e) { console.log(e) }

}
