export default {
	name: "command",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "NDKhánh",
	description: "Không làm phiền bot sẽ không tag bạn",
	shortDescription: "Không làm phiền",
	usages: [
		'busy: bật chế độ không làm phiền',
		'busy <xxxx>: bật chế độ không làm phiền với lý do: <xxxx>'
	],
	cooldowns: 5
};
import logger from "../../utils/log.js"
import fs from "fs-extra"


const load = async ({ name, event, api, client, global, loadAll }) => {

	try {
		import(`../../scriptbot/commands/${name}.js`)
		client.commands.delete(name);
	}
	catch (e) {
		console.log(e)
		return api.sendMessage(`Không tìm thấy module: ${name}.js`, event.threadID, event.messageID);
	}
	try {
		const command = await import(`../../scriptbot/commands/${name}.js`);
		if (client.commands.has(command.default.name || "")) throw logger(`module ${name} bị trùng với một module mang cùng tên`, "FAIL");
		const nameModule = command.default.name;
		if (command.onLoad) {
			try {
				command.onLoad({ global, client });
			}
			catch (error) {
				logger(`Không thể onLoad module: ${nameModule} với lỗi: ${error.name} - ${error.message}`, "FAIL");
			}
		}
		if (command.event) {
			var registerCommand = client.commandRegister.get("event") || [];
			registerCommand.push(nameModule);
			client.commandRegister.set("event", registerCommand);
		};
		client.commands.set(command.default.name, command);

		logger(`[ COMMAND ] » FILE: ${name}.js | NAME: ${nameModule} | Loading: Succes!`, "DONE");
		if (loadAll == true) return
		else return api.sendMessage(`Load command [ ${command.default.name} ] done!`, event.threadID);
	}
	catch (error) {
		logger(`Không thể load module command ${name} với lỗi: ${error.name}:${error.message}`, "FAIL");
		if (loadAll == true) return
		else return api.sendMessage(`Không thể load module command ${name} với lỗi: ${error.name}:${error.message}`, event.threadID);
	}
}

export async function run({ event, api, global, client, args, utils }) {
	const content = args.slice(1, args.length);
	switch (args[0]) {
		case "load": {
			const commands = content;
			if (commands.length == 0) return api.sendMessage("không được để trống", event.threadID, event.messageID);
			for (const name of commands) {
				load({ name, event, api, client, global });
				await new Promise(resolve => setTimeout(resolve, 1 * 1000));
			}
		}
			break;
		case "loadAll": {
			const commandFiles = fs.readdirSync(client.dirMain + `/scriptbot/commands`).filter((file) => file.endsWith(".js"));;
			client.commands.clear();
			for (const name of commandFiles) {
				load({ name, event, api, client, global, loadAll: true });
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			api.sendMessage("loadAll success", event.threadID, event.messageID);
		}
			break;
		default:
			utils.throwError(this.default.name, event.threadID, event.messageID);
			break;
	}
}
