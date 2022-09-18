
import fs from "fs-extra";
import logger from "../utils/log.js";
import funcs from "../utils/funcs.js";
import handleSchedule from "./handle/handleSchedule.js";

import HandleCommand from "./handle/handleCommand.js";

import HandleCommandEvent from "./handle/handleCommandEvent.js";

import HandleReply from "./handle/handleReply.js";

import HandleReaction from "./handle/handleReaction.js";

import HandleEvent from "./handle/handleEvent.js";

import HandleCommandNoprefix from "./handle/handleCommandNoprefix.js";

import HandleCreateDatabase from "./handle/handleCreateDatabase.js";


export default function ({ api, client, global, timeStart }) {
	const ThreadsAll = JSON.parse(fs.readFileSync(client.dirMain + "/data/Thread.json", { encoding: "utf-8" }));
	const UserThread = JSON.parse(fs.readFileSync(client.dirMain + "/data/UserThread.json", { encoding: "utf-8" }));
	//mở file Users.json
	const UsersAll = JSON.parse(fs.readFileSync(client.dirMain + "/data/Users.json", { encoding: "utf-8" }));
	//mở file AdminOnly.json
	const AdminOnly = JSON.parse(fs.readFileSync(client.dirMain + "/data/AdminOnly.json", { encoding: "utf-8" }));

	const ThreadSettings = JSON.parse(fs.readFileSync(client.dirMain + "/data/ThreadSettings.json", { encoding: "utf-8" }));

	const utils = funcs({ api, global, client, ThreadsAll, UsersAll, ThreadSettings, ThreadsAll, UserThread, AdminOnly });
	handleSchedule({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleCommand = HandleCommand({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleCommandEvent = HandleCommandEvent({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleReply = HandleReply({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleReaction = HandleReaction({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleEvent = HandleEvent({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleCommandNoprefix = HandleCommandNoprefix({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });
	const handleCreateDatabase = HandleCreateDatabase({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, UserThread, AdminOnly });

	logger(`Bắt đầu nhận tin...`, "[ SUMIBOT ]");

	return (event) => {
		//console.log(event)
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });
				handleCommandNoprefix({ event });
				handleCreateDatabase({ event });
				break;
			case "event":
			case "change_thread_image":
				handleEvent({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;
			case "ping":
				api.sendMessage("", api.getCurrentUserID(), () => { });
				break;
			default:
				break;
		}
	};

}
