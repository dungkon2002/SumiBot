export default {
	name: "run",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Test Code nhanh",
	shortDescription: "Test Code nhanh",
	usages: [
	    'run: bla bla'
    ],
	cooldowns: 5
};

import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, event, args, UserThread }) {
	const out = function (a) {
		if (typeof a === "object" || typeof a === "array") {
			if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4);
			else a = "done!";
		}

		if (typeof a === "number") a = a.toString();
		
		return api.sendMessage(a, event.threadID, event.messageID);
	}
	try {
		const response = await eval(`(async function() {${args.join(" ")}})()`, { out, api, ps, __dirname, fs, axios, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, event, args, console, UserThread }, true);
		return out(response);
	}
	catch (e) { return out(e) };
}