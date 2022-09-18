
import fs from "fs-extra";
import login from "fca-horizon-remake";
import logger from "./utils/log.js";
import listen from "./main/listen.js";
import chalk from 'chalk';
import { createRequire } from "module";
(async () => {
	process.on('unhandledRejection', error => console.error(error));
	process.on('uncaughtException', error => console.error(error));
	const timeStart = Date.now();
	var require = createRequire(import.meta.url);
	const client = new Object({
		commands: new Map(),
		noprefix: new Map(),
		events: new Map(),
		event: new Map(),
		eventRegister: new Map(),
		commandRegister: new Map(),
		noprefixRegister: new Map(),
		schedule: new Array(),
		handleReply: new Array(),
		handleReaction: new Array(),
		cooldowns: new Map(),
		reload: true,
		resetExp: true,
		resetWeek: true,
		dirMain: process.cwd()
	});

	if (!fs.existsSync(client.dirMain + "/data/global.json")) {
		const config = require("./config.json")
		const global = {
			config: config
		};

		fs.writeFileSync(client.dirMain + "/data/global.json", JSON.stringify(global, null, "\t"));
	}
	//Tạo Thread.json nếu không có
	if (!fs.existsSync(client.dirMain + "/data/Thread.json"))
		fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify([]));

	if (!fs.existsSync(client.dirMain + "/data/UserThread.json"))
		fs.writeFileSync(client.dirMain + "/data/UserThread.json", JSON.stringify([]));

	//Tạo Users.json nếu không có
	if (!fs.existsSync(client.dirMain + "/data/Users.json"))
		fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify([]));
	if (!fs.existsSync(client.dirMain + "/data/AdminOnly.json"))
		fs.writeFileSync(client.dirMain + "/data/AdminOnly.json", JSON.stringify([]));
	//Tạo ThreadSettings.json nếu không có
	if (!fs.existsSync(client.dirMain + "/data/ThreadSettings.json"))
		fs.writeFileSync(client.dirMain + "/data/ThreadSettings.json", JSON.stringify([]));


	const global = JSON.parse(fs.readFileSync(client.dirMain + "/data/global.json", { encoding: "utf-8" }));

	//commands loading

	console.log(chalk.bgMagenta.yellow.bold('» ────────────────────── » LOADING COMMANDS « ───────────────────── «'))
	const commandFiles = fs.readdirSync(client.dirMain + "/scriptbot/commands").filter((file) => file.endsWith(".js"));
	var CMDSucces = 0, CMDError = []
	for (const file of commandFiles) {
		try {
			var command = await import(`./scriptbot/commands/${file}`)
			++CMDSucces;
		} catch (e) {
			CMDError.push({ file: file, errorName: e.name, errorMess: e.message })
			logger(`[ COMMAND ] » FILE: ${file} | Loading: Error!`, "FAIL")
		}
		try {
			if (client.commands.has(command.default.name || "")) throw logger(`module ${file} bị trùng với một module mang cùng tên`, "FAIL");
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
			logger(`[ COMMAND ] » FILE: ${file} | NAME: ${nameModule} | Loading: Succes!`, "DONE");
		} catch (error) {
			logger(`Không thể load module command ${file}: ${error}`, "FAIL");
		}
	}
	console.log(chalk.bgMagenta.yellow.bold('» ─────────────────────── » LOADING EVENT « ─────────────────────── «'))
	var EveSucces = 0, EveError = []
	const eventFiles = fs.readdirSync(client.dirMain + "/scriptbot/events").filter((file) => file.endsWith(".js"));
	for (const file of eventFiles) {
		try {
			var event = await import(`./scriptbot/events/${file}`)

			++EveSucces;
		} catch (e) {
			EveError.push({ file: file, errorName: e.name, errorMess: e.message })
			logger(`[ EventCommand ] » FILE: ${file} | Loading: Error!`, "FAIL")
		}
		try {
			if (client.events.has(event.default.name || "")) throw logger(`module ${file} bị trùng với một module mang cùng tên`, "FAIL");
			const nameModule = event.default.name;
			if (event.onLoad) {
				try {
					event.onLoad({ global, client });
				}
				catch (error) {
					logger(`Không thể onLoad module: ${nameModule} với lỗi: ${error.name} - ${error.message}`, "FAIL");
				}
			}
			var registerEvent = client.eventRegister.get("event") || [];
			registerEvent.push(nameModule);
			client.eventRegister.set("event", registerEvent);
			client.events.set(event.default.name, event);
			logger(`[ EventCommand ] » FILE: ${file} | NAME: ${nameModule} | Loading: Succes!`, "DONE");
		} catch (error) {
			logger(`Không thể load module event ${file}: ${error}`, "FAIL");
		}
	}

	console.log(chalk.bgMagenta.yellow.bold('» ────────────────────── » LOADING NOFREFIX « ───────────────────── «'))

	var NoSucces = 0, NoError = []
	const nopreFiles = fs.readdirSync(client.dirMain + "/scriptbot/noprefix").filter((file) => file.endsWith(".js"));
	for (const file of nopreFiles) {
		try {
			var noprefix = await import(`./scriptbot/noprefix/${file}`)
			++NoSucces;
		} catch (e) {
			NoError.push({ file: file, errorName: e.name, errorMess: e.message })
			logger(`[ NOPREFIX ] » FILE: ${file} | Loading: Error!`, "FAIL")
		}
		try {
			if (client.noprefix.has(noprefix.default.name || "")) throw logger(`module ${file} bị trùng với một module mang cùng tên`, "FAIL");
			const nameModule = noprefix.default.name;
			if (noprefix.onLoad) {
				try {
					noprefix.onLoad({ global, client });
				}
				catch (error) {
					logger(`Không thể onLoad module: ${nameModule} với lỗi: ${error.name} - ${error.message}`, "FAIL");
				}
			}
			if (noprefix.noprefix) {
				var registerNoprefox = client.noprefixRegister.get("noprefix") || [];
				registerNoprefox.push(nameModule);
				client.noprefixRegister.set("noprefix", registerNoprefox);
			};
			client.noprefix.set(noprefix.default.name, noprefix);
			logger(`[ NOPREFIX ] » FILE: ${file} | NAME: ${nameModule} | Loading: Succes!`, "DONE");
		} catch (error) {
			logger(`Không thể load module noprefix ${file}: ${error}`, "FAIL");

		}

	}


	console.log(chalk.bgMagenta.yellow.bold('» ───────────────────────────────────────────────────────────────── «'))
	logger(`[ LOAD COMMANDS ] » Succes: ${CMDSucces}`, "DONE");
	logger(`[ LOAD COMMANDS ] » Error: ${CMDError.length}`, "FAIL");
	console.log(chalk.bgMagenta.yellow.bold('» ───────────────────────────────────────────────────────────────── «'))
	logger(`[ LOAD EVENT ] » Succes: ${EveSucces}`, "DONE");
	logger(`[ LOAD EVENT ] » Error: ${EveError.length}`, "FAIL");
	console.log(chalk.bgMagenta.yellow.bold('» ───────────────────────────────────────────────────────────────── «'))
	logger(`[ LOAD NOPREFIX ] » Succes: ${NoSucces}`, "DONE");
	logger(`[ LOAD NOPREFIX ] » Error: ${NoError.length}`, "FAIL");
	console.log(chalk.bgMagenta.yellow.bold('» ────────────────── » NOTIFICATION ERROR « ─────────────────────── «'))
	if (CMDError.length == 0 && EveError.length == 0 && NoError.length == 0) logger(`[ NOTIFICATION ] » Succes: KHÔNG CÓ MODULE NÀO BỊ LỖI!`, "DONE");

	if (CMDError.length > 0) {
		console.log(chalk.bgMagenta.yellow.bold('» ──────────────────── » COMMANDS ERROR « ───────────────────────── «'))
		for (let getErr of CMDError) {
			logger(`[ COMMANDS ERROR ] » Error: FILE: ${getErr.file} | ERROR : ${getErr.errorName} - ${getErr.errorMess} `, "FAIL");
		}
	}

	if (EveError.length > 0) {
		console.log(chalk.bgMagenta.yellow.bold('» ────────────────────── » EVENT ERROR « ────────────────────────── «'))
		for (let getErr of EveError) {
			logger(`[ EVENT ERROR ] » Error: FILE: ${getErr.file} | ERROR : ${getErr.errorName} - ${getErr.errorMess} `, "FAIL");
		}
	}

	if (NoError.length > 0) {
		console.log(chalk.bgMagenta.yellow.bold('» ──────────────────── » NOPREFIX ERROR « ───────────────────────── «'))
		for (let getErr of NoError) {
			logger(`[ NOPREFIX ERROR ] » Error: FILE: ${getErr.file} | ERROR : ${getErr.errorName} - ${getErr.errorMess} `, "FAIL");
		}
	}
	console.log(chalk.bgMagenta.yellow.bold('» ─────────────────── » LOADING COMPLETE « ──────────────────────── «'))
	try {
		var appState = require('./appstate.json');
	}
	catch (e) {
		logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, "FAIL");
		process.exit();
	}

	login({ appState }, (error, api) => {
		if (error) logger(JSON.stringify(error), "FAIL");
		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "error",
			autoMarkDelivery: false,
			selfListen: global.config.selfListen || false,
			online: true

		});

		fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState(), null, "\t"));
		const handleListen = listen({ api, client, global, timeStart });

		let handleL = api.listenMqtt((error, event) => {
			if (error) logger(`handleListener đã xảy ra lỗi: ${JSON.stringify(error)}`, "FAIL");
			if ((["presence", "typ", "read_receipt"].some(typeFilter => typeFilter == event.type))) return;
			(global.config.DeveloperMode == true) ? console.log(event) : "";
			return handleListen(event);
		});
		setInterval(async () => {
			await handleL.stopListening();
			await new Promise(resolve => setTimeout(resolve, 5000));
			handleL = api.listenMqtt((error, event) => {
				if (error) logger(`handleListener đã xảy ra lỗi: ${JSON.stringify(error)}`, "FAIL");
				if ((["presence", "typ", "read_receipt"].some(typeFilter => typeFilter == event.type))) return;
				(global.config.DeveloperMode == true) ? console.log(event) : "";
				return handleListen(event);
			});
		}, 1200000);

		setInterval(function () { return handleListen({ type: "ping", time: 1, reader: 1, threadID: 1 }) }, 60000);
		return;
	});
})();
