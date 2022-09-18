export default {
	name: "warn",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Cảnh cáo thành viên  đủ 3 lần sẽ ban khỏi nhóm (nhớ set qtv cho bot nha)",
	shortDescription: "Cảnh cáo thành viên",
	usages: [
		'warn reply: reply tin nhắn người muốn warn "lý do cảnh cáo',
		'warn @tag: @tag "lý do cảnh cáo',
		'warn listban: xem danh sách thành viên bị cấm vào nhóm',
		'warn view: xem bị cảnh cáo bao nhiêu lần',
		'warn view @tag: xem người @tag bị cảnh cáo bao nhiêu lần',
		'warn reset: Reset toàn bộ dữ liệu warn trong nhóm của bạn',
		'warn del: xóa cảnh cáo thành viên'
	],
	cooldowns: 5
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function event({ api, event, UsersAll, ThreadsAll, client }) {
	try {
		const path = ps.resolve(__dirname, 'cache', `datawarn.json`);
		let { threadID } = event;
		if (!fs.existsSync(path)) return;
		let datawarn = JSON.parse(
			fs.readFileSync(path)
		);

		const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
		if (!datawarn.banned[threadID]) return;
		let listban = datawarn.banned[threadID] || [];
		const allUserThread = threadInfo.participantIDs
		for (let info of allUserThread) {
			if (listban.includes(parseInt(info))) {
				let name = UsersAll.find(item => item.id == info).name
				if (Object.keys(threadInfo.nicknames || {}).includes(info.toString())) {
					delete threadInfo.nicknames[info.toString()]
				}
				if (threadInfo.ExpGrpup.some(item => item.id == info)) {
					threadInfo.ExpGrpup.splice(threadInfo.ExpGrpup.findIndex(item => item.id == info), 1)
				}
				if (threadInfo.ExpWeek.some(item => item.id == info)) {
					threadInfo.ExpWeek.splice(threadInfo.ExpWeek.findIndex(item => item.id == info), 1)
				}
				if (threadInfo.adminIDs.some(item => item.id == info)) {
					threadInfo.adminIDs.splice(threadInfo.adminIDs.findIndex(item => item.id == info), 1)
				}
				if (threadInfo.userInfo.some(item => item.id == info)) {
					threadInfo.userInfo.splice(threadInfo.userInfo.findIndex(item => item.id == info), 1)
				}
				if (threadInfo.participantIDs.includes(info)) {

					threadInfo.participantIDs.splice(threadInfo.participantIDs.indexOf(info.toString()), 1)

				}
				fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));

				api.removeUserFromGroup(parseInt(info), threadID, e => {
					if (e) return api.sendMessage(e, threadID);
					api.sendMessage(
						`[ ❎ WARN ]\n» [${name} | ${info}]\n» Không thể tham gia nhóm vì đã bị ban từ trước`,
						threadID
					);
				});
			}
		}
	} catch (e) { console.log(e) }
}

export async function handleReply({ api, event, handleReply, UsersAll }) {
	if (event.senderID !== handleReply.author) return;
	try {
		switch (handleReply.type) {
			case 'listban':
				{
					let name = UsersAll.find(item => item.id == handleReply.iduser1[event.body - 1]).name
					const path = ps.resolve(__dirname, 'cache', `datawarn.json`);
					let datawarn = JSON.parse(fs.readFileSync(path));
					let mybox = datawarn.banned[event.threadID];
					datawarn.banned;
					mybox.splice(mybox.indexOf(`${handleReply.iduser1[event.body - 1]}`), 1)
					api.sendMessage(`[ ✅ WARN ]\n» Đã xóa thành viên ${name}\n» Khỏi danh sách bị cấm vào nhóm`, event.threadID, async (err, info) => {
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					}, event.messageID);
					delete datawarn.warns[event.threadID][`${handleReply.iduser1[event.body - 1]}`]
					fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));
					break;
				}
			case 'delwarn':
				{
					let name = UsersAll.find(item => item.id == handleReply.idtvw1[event.body - 1]).name
					const path = ps.resolve(__dirname, 'cache', `datawarn.json`);
					let datawarn = JSON.parse(fs.readFileSync(path));
					api.sendMessage(`[ ✅ WARN ]\n» Đã xóa cảnh báo thành viên\n» ${name}`, event.threadID, async (err, info) => {
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					}, event.messageID);
					delete datawarn.warns[event.threadID][`${handleReply.idtvw1[event.body - 1]}`]
					fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));
				}

		}
	} catch (e) { console.log(e) }
}


export async function run({ api, event, args, utils, permssion, ThreadsAll, UsersAll, global, client }) {
	try {
		let { messageID, threadID, senderID } = event;
		const ThreadsData = ThreadsAll.find(item => item.threadID == threadID);
		if (!ThreadsData.adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage('[ ❎ WARN ]\n» Bot cần quyền quản trị viên nhóm để sử dụng lệnh này\n» Vui lòng thêm và thử lại!', threadID, messageID);
		const path = ps.resolve(__dirname, 'cache', `datawarn.json`);
		if (!fs.existsSync(path)) {
			const dataaa = { warns: {}, banned: {} };
			fs.writeFileSync(path, JSON.stringify(dataaa));
		}
		let datawarn = JSON.parse(fs.readFileSync(path)); //đọc nội dung file
		/*
		{warns: {}, banned: {tid: []}};
		*/
		if (!datawarn.warns.hasOwnProperty(threadID)) {
			datawarn.warns[threadID] = {};
			fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));

		}

		if (args[0] == "view") {
			if (!args[1]) {
				let msg = "";
				let mywarn = datawarn.warns[threadID][senderID];
				if (!mywarn) return api.sendMessage('[ ✅ WARN ]\n» Bạn chưa bị cảnh cáo lần nào', threadID, messageID);
				let num = 0;
				for (let reasonwarn of mywarn) {
					msg += `» Lần ${++num}/ ${reasonwarn}\n`;
				}
				api.sendMessage(`[ ❎ WARN ]\n» Bạn đã bị cảnh cáo ${mywarn.length} lần:\n\n${msg}`, threadID, messageID);
			}
			else if (Object.keys(event.mentions).length != 0) {
				let message = "";
				let mentions = Object.keys(event.mentions);
				for (let id of mentions) {
					const UsersData = UsersAll.find(item => item.id == id);
					let name = UsersData.name;
					let msg = "";
					let so = 0;
					let reasonarr = datawarn.warns[threadID][id];
					if (typeof reasonarr != "object") {
						msg += "» Chưa bị cảnh cáo lần nào\n"
					} else {
						for (let reason of reasonarr) {
							msg += `» Lần ${++so}/ ${reason}\n`;
						}
					}
					message += `» ${name}\n${msg}\n`;
				}
				api.sendMessage(message, threadID, messageID);
			}
		}
		else if (args[0] == "listban") {
			if (!permssion == 1) return api.sendMessage('[ ❎ WARN ]\n» Chỉ qtv nhóm mới có thể sử dụng lệnh listban!', threadID, messageID);
			try {
				let mybox = datawarn.banned[event.threadID];
				let msg = "", iduser1 = [], num = 0;
				for (let iduser of mybox) {
					let name = UsersAll.find(item => item.id == iduser).name;
					msg += `${++num}/  Name: ${name}\nUID: ${iduser}\n`;
					iduser1.push(iduser);
				}
				if (msg.length != 0) {
					api.sendMessage("Những thành viên đã bị cấm vào nhóm:\n" + msg + "\nReply số thứ tự để xóa thành viên ra khỏi danh sách bị cấm vào nhóm ! ",
						event.threadID, (e, info) =>
						client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: 'listban',
							iduser1
						})
						, event.messageID);
				}
				else api.sendMessage("[ ✅ WARN ]\n» Nhóm bạn chưa có ai bị cấm vào nhóm", event.threadID, event.messageID);

			}
			catch (e) {
				api.sendMessage("[ ✅ WARN ]\n» Nhóm bạn chưa có ai bị cấm vào nhóm", event.threadID, event.messageID)
			}
		}
		else if (args[0] == "del") {
			if (!permssion == 1) return api.sendMessage('[ ❎ WARN ]\n» Chỉ qtv nhóm mới có thể sử dụng lệnh del!', threadID, messageID);
			try {
				let dtwbox = datawarn.warns[threadID];
				let allwarn = "", idtvw1 = [], stt = 0;
				for (let idtvw in dtwbox) {
					let name = UsersAll.find(item => item.id == idtvw).name, msg = "", solan = 0;
					for (let reasonwtv of dtwbox[idtvw]) {
						msg += `» Lần ${++solan}/ ${reasonwtv}\n`
					}
					allwarn += `${++stt}/ ${name}:\n${msg}\n`;
					idtvw1.push(idtvw);
				}

				if (allwarn.length != 0) {
					api.sendMessage("Danh sách những thành viên đã bị cảnh cáo:\n\n" + allwarn + "Reply số thứ tự để xóa cảnh báo ! ",
						event.threadID, (e, info) =>
						client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: 'delwarn',
							idtvw1
						})
						, event.messageID);
				}
				else api.sendMessage("[ ✅ WARN ]\n» Nhóm bạn chưa có ai bị cảnh cáo", event.threadID, event.messageID);

			}
			catch (e) {
				api.sendMessage("[ ✅ WARN ]\n» Nhóm bạn chưa có ai bị cảnh cáo", event.threadID, event.messageID)
			}
		}

		else if (args[0] == "reset") {
			if (!permssion == 1) return api.sendMessage('[ ❎ WARN ]\n» Chỉ qtv nhóm mới có thể sử dụng lệnh reset!', threadID, messageID);

			datawarn.warns[threadID] = {};
			datawarn.banned[threadID] = [];
			fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));
			api.sendMessage("Đã reset toàn bộ dữ liệu warn trong nhóm của bạn", threadID, messageID);
		}
		//◆━━━━━━━━━◆WARN◆━━━━━━━━━◆\\
		else {
			if (event.type != "message_reply" && Object.keys(event.mentions).length == 0) return utils.throwError(this.config.name, event.threadID, event.messageID);

			//◆━━━━━━◆get iduser and reason<<<<<<<<\\
			let mention = Object.keys(event.mentions)

			if (!permssion == 1) return api.sendMessage('[ ❎ WARN ]\n» Chỉ qtv nhóm mới có thể cảnh cáo thành viên!', threadID, messageID);
			if ((global.config.ADMINBOT).includes(mention[0] || event.messageReply.senderID)) return api.sendMessage('[ ❎ WARN ]\n» Không thể cảnh báo ADMIN BOT!', threadID, messageID);

			var reason = "";
			if (event.type == "message_reply") {
				var iduser = [];
				iduser.push(event.messageReply.senderID);
				reason = (args.join(" ")).trim();
			}

			else if (Object.keys(event.mentions).length != 0) {
				var iduser = Object.keys(event.mentions);
				let stringname = "";
				let nametaglength = (Object.values(event.mentions)).length;
				let namearr = Object.values(event.mentions);
				for (let i = 0; i < nametaglength; i++) {
					stringname += (Object.values(event.mentions))[i];
				}
				var message = args.join(" ");
				//let reason = (message.slice(stringname.length + nametaglength -1)).trim();
				for (let valuemention of namearr) {
					vitrivalue = message.indexOf(valuemention);
					message = message.replace(valuemention, "");
				}


				var reason = message.replace(/\s+/g, ' ');
			}
			let arraytag = [];
			let arrayname = [];
			//Check xem đã bị cảnh cáo lần nào chưa

			for (let iid of iduser) {
				let id = parseInt(iid);
				let nametag = UsersAll.find(item => item.id == iid).name;
				arraytag.push({ id: id, tag: nametag });


				if (!reason) reason += "Không có lý do nào được đưa ra";
				/*if(!datawarn.warns.hasOwnProperty(threadID)) {
				datawarn.warns[threadID] = {}; 
				}*/
				let dtwmybox = datawarn.warns[threadID];
				if (!dtwmybox.hasOwnProperty(id)) {
					dtwmybox[id] = [];
				}
				let solan = (datawarn.warns[threadID][id]).length;
				arrayname.push(nametag + " " + (parseInt(solan) + 1) + " lần");
				var pushreason = datawarn.warns[threadID][id];
				pushreason.push(reason);
				let num = 0, msg = "";
				for (let reasonwarn of pushreason) {
					msg += `» Lần ${++num}/ ${reasonwarn}\n`;
				}
				if (!datawarn.banned[threadID]) {
					datawarn.banned[threadID] = [];
				}
				if ((datawarn.warns[threadID][id]).length > 2) {
					const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
					if (Object.keys(threadInfo.nicknames || {}).includes(id.toString())) {
						delete threadInfo.nicknames[id.toString()]
					}
					if (threadInfo.ExpGrpup.some(item => item.id == id)) {
						threadInfo.ExpGrpup.splice(threadInfo.ExpGrpup.findIndex(item => item.id == id), 1)
					}
					if (threadInfo.ExpWeek.some(item => item.id == id)) {
						threadInfo.ExpWeek.splice(threadInfo.ExpWeek.findIndex(item => item.id == id), 1)
					}
					if (threadInfo.adminIDs.some(item => item.id == id)) {
						threadInfo.adminIDs.splice(threadInfo.adminIDs.findIndex(item => item.id == id), 1)
					}
					if (threadInfo.userInfo.some(item => item.id == id)) {
						threadInfo.userInfo.splice(threadInfo.userInfo.findIndex(item => item.id == id), 1)
					}
					if (threadInfo.participantIDs.includes(id)) {

						threadInfo.participantIDs.splice(threadInfo.participantIDs.indexOf(id.toString()), 1)

					}
					fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));


					api.removeUserFromGroup(parseInt(id), threadID)
					let banned = datawarn.banned[threadID];
					banned.push(parseInt(id));
					fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));
				}

			}//for

			fs.writeFileSync(path, JSON.stringify(datawarn, null, 2));
			if (`${pushreason.length}` <= 2) return api.sendMessage({ body: `[ WARN ]\n» Đã cảnh cáo thành viên ${arrayname.join(", ")}\n» Với lý do: ${reason}\n» Nếu vi phạm ` + (3 - `${pushreason.length}`) + ` lần nữa sẽ bị cấm vào nhóm`, mentions: arraytag }, threadID, messageID);

			else return api.sendMessage(`[ ❎ WARN ]\n» Đã cảnh cáo thành viên\n »${arrayname.join(" ")} ${pushreason.length} lần:\n\n${msg}\n» Đã thêm thành viên vào danh bị cấm vào nhóm!`, event.threadID, event.messageID)

		}
	} catch (e) {
		console.log(e)
		return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}
