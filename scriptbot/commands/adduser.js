export default {
	name: "adduser",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "NDKhánh fix by Dũngkon",
	description: "Thêm thành viên bằng [link/uid]",
	shortDescription: "Thêm thành viên",
	usages: [
		'adduser <xxxx>: thêm thành viên bằng link facebook',
		'adduser <xxxx>: thêm thành viên bằng uid facebook'
	],
	cooldowns: 5
};

import fs from "fs-extra";

export async function run({ api, event, args, ThreadsAll, utils, client, UsersAll }) {
	const { threadID, messageID } = event;
	const botID = api.getCurrentUserID();
	const out = msg => api.sendMessage(msg, threadID, messageID);
	var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
	var participantIDs = participantIDs.map(e => parseInt(e));
	if (!args[0]) return out("Vui lòng nhập 1 id/link profile user cần add.");
	if (!isNaN(args[0])) return adduser(args[0], undefined);
	else {
		try {
			var [id, name, fail] = await getUID(args[0], api);
			if (fail == true && id != null) return out(id);
			else if (fail == true && id == null) return out("Không tìm thấy ID người dùng.")
			else {
				await adduser(id, name || "người dùng Facebook");
			}
		} catch (e) {
			return out(`${e.name}: ${e.message}.`);
		}
	}

	async function adduser(id, name) {
		id = parseInt(id);
		if (participantIDs.includes(id)) return out(`${name ? name : "Thành viên"} đã có mặt trong nhóm.`);
		else {
			var admins = adminIDs.map(e => parseInt(e.id));
			try {
				await api.addUserToGroup(id, threadID);
			}
			catch {
				return out(`Không thể thêm ${name ? name : "người dùng"} vào nhóm.`);
			}
			if (approvalMode === true && !admins.includes(botID)) return out(`Đã thêm ${name ? name : "thành viên"} vào danh sách phê duyệt !`);
			else return out(`Đã thêm ${name ? name : "thành viên"} vào nhóm !`)
		}
	}
}
