export default {
	name: "user",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "NDKhánh",
	description: "Cấm hoặc gỡ cấm người dùng!",
	shortDescription: "Quản lý Users",
	usages: [
		"user ban: ban người dùng bạn reply",
		"user ban <xxxx>: ban người dùng bằng UID",
		"user unban: gỡ ban người dùng bạn reply",
		"user unban <xxxx>: gỡ ban nhóm bằng UID",
		"user list: danh sách người dùng trong dữ liệu BOT",
		"user banned: quản lý danh sách người dùng bị ban",
		"user cmd: quản lý commands ",
		"user cmd <xxxx>: quản lý commands bằng UID"
	],
	cooldowns: 5

}

import fs from "fs-extra"
import moment from "moment-timezone"

export async function handleReply({ event, api, UsersAll, client, handleReply }) {
	if (parseInt(event.senderID) !== parseInt(handleReply.author)) return api.sendMessage(`[ USERS BANNED ]\n» Bạn không phải là người dùng lệnh!`, event.threadID, async (error, info) => {
		await new Promise(resolve => setTimeout(resolve, 10000));
		return api.unsendMessage(info.messageID);
	});
	try {
		switch (handleReply.type) {
			case "ban": {
				const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");
				const reasonban = event.body
				const UsersData = UsersAll.find(item => item.id == handleReply.target);
				UsersData.banned = true;
				UsersData.reasonban = reasonban
				UsersData.timebanned = gio
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS BANNED ]\n» Đã ban thành công người dùng!\n» NAME: ${UsersData.name}\n» UID: ${handleReply.target}\n» Lý do: ${reasonban}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => {
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				break;
			}
			case "list": {
				let arg = event.body.split(" ");
				let idgr = handleReply.target[arg[1] - 1];
				if (arg[0] == "ban" || arg[0] == "Ban") {
					let reason = arg.slice(2).join(" ")
					if (!reason) reason = "Không có lý do nào được đưa ra";
					api.sendMessage(`[ USERS BAN ]\n» Đã nhận lệnh BAN từ admin\n» Với lý do: ${reason}`, idgr, async (error, info) => {
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
					const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");
					const UsersData = UsersAll.find(item => item.id == idgr);
					UsersData.banned = true;
					UsersData.reasonban = reason
					UsersData.timebanned = gio
					fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
					return api.sendMessage(`[ USERS BANNED ]\n» Đã ban thành công người dùng!\n» NAME: ${UsersData.name}\n» TID: ${idgr}\n» Lý do: ${reason}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => {
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
				}
				if (arg[0] == "Noti" || arg[0] == "noti") {
					let reason = arg.slice(2).join(" ")
					if (!reason) return api.sendMessage(`Nội dung thông báo không được để trống!`, event.threadID, () => api.unsendMessage(handleReply.messageID));
					const UsersData = UsersAll.find(item => item.id == idgr);
					api.sendMessage(`[ USERS NOTIFICATION ]\n» Thông Báo Từ ADMINBOT Gửi Đến Bạn!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰\n${reason}`, idgr);
					api.sendMessage(`[ USERS NOTIFICATION ]\n» Đã gửi thông báo thành công:\n» UID: ${idgr}\n» NAME: ${UsersData.name}`, event.threadID, async (error, info) => {
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
				}
				if (arg[0] == "Info" || arg[0] == "info") {
					api.sendMessage(`[ USERS INFO ]\n» UPDATE SAU`, event.threadID, async (error, info) => {
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
				}
			}
			case "unban": {
				const UsersData = UsersAll.find(item => item.id == handleReply.target[event.body - 1]);
				UsersData.banned = false;
				UsersData.reasonban = ""
				UsersData.timebanned = ""
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS UNBAN ]\n» Đã unban thành công người dùng!\n» NAME: ${UsersData.name}\n» UID: ${handleReply.target[event.body - 1]}`, event.threadID, async (error, info) => {
					api.sendMessage(`[ USERS UNBAN ]\n» Bạn đã được ADMIN BOT gỡ ban!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰`, handleReply.target[event.body - 1], async (error, info) => {
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
			}
			case "command": {
				switch (event.body) {
					case "1": {
						let msg = "", i = 1, arrayCmd = [];
						const UsersData = UsersAll.find(item => item.id == handleReply.target);
						for (let getCmd of UsersData.commandBanned) {
							msg += `${i++}/ Commands: ${getCmd.cmd}\n» TimeBan: ${getCmd.timebanned}\n`
							arrayCmd.push(getCmd.cmd);
						}
						api.unsendMessage(handleReply.messageID)
						return msg == "" ?
							api.sendMessage('[ ✅ USERS BANNED ]\n» Hiện tại không có commands nào bị ban',
								event.threadID,
								event.messageID
							) : api.sendMessage(`[ USERS UNBANCMD ]\n${msg}\n» Reply số tứ thự để unban commands đó!`, event.threadID, (error, info) => {
								client.handleReply.push({
									name: this.config.name,
									messageID: info.messageID,
									author: event.senderID,
									type: "unbanCmd",
									target: handleReply.target,
									cmd: arrayCmd
								});
							}, event.messageID);
					}
					case "2": {
						api.unsendMessage(handleReply.messageID)
						return api.sendMessage(`[ USERS BANCMD ]\n» Reply tin nhắn \n» Command ban | Lý do ban`, event.threadID, (error, info) => {
							client.handleReply.push({
								name: this.config.name,
								messageID: info.messageID,
								author: event.senderID,
								type: "banCmd",
								target: handleReply.target
							});
						}, event.messageID);
						return;
					}
				}
			}
			case "banCmd": {
				let arg = event.body.split(" ");
				let reason = arg.slice(1).join(" ")
				if (!reason) reason = "Không có lý do nào được đưa ra";
				const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");
				const allCommandName = [];
				for (const cmd of client.commands) allCommandName.push(cmd.config.name);
				if (!allCommandName.includes(arg[0])) return api.sendMessage(`[ ⛔️ USERS BANCMD ]\n» Lệnh bạn cấm không tồn tại\n\n» ERROR ${arg[0]}`, event.threadID, async (error, info) => {
					await new Promise(resolve => setTimeout(resolve, 5000));
					return api.unsendMessage(info.messageID);
				});
				const UsersData = UsersAll.find(item => item.id == handleReply.target);
				UsersData.commandBanned.push({ cmd: arg[0], reasonban: reason, timebanned: gio })
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS BANCMD ]\n» Đã ban thành công commands!\n» ${arg[0]}\n» Với lý do: ${reason}`, event.threadID, async (error, info) => {
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
			}
			case "unbanCmd": {
				const UsersData = UsersAll.find(item => item.id == handleReply.target);
				UsersData.commandBanned.splice(UsersData.commandBanned.findIndex(item => item.cmd == handleReply.cmd[event.body - 1]), 1)
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS UNBANCMD ]\n» Đã unban thành công commands!\n» ${handleReply.cmd[event.body - 1]}`, event.threadID, async (error, info) => {
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
			}
			default:
				break;
		}
	} catch (e) { console.log(e) }
}

export async function handleReaction({ event, api, UsersAll, client, handleReaction }) {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return api.sendMessage(`[ USRES BANNED ]\n» Bạn không phải là người dùng lệnh!`, event.threadID, async (error, info) => {
		await new Promise(resolve => setTimeout(resolve, 10000));
		return api.unsendMessage(info.messageID);
	});
	try {
		switch (handleReaction.type) {
			case "ban": {
				const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");
				const reasonban = "Không có lý do nào được đưa ra!"
				const UsersData = UsersAll.find(item => item.id == handleReaction.target);
				UsersData.banned = true;
				UsersData.reasonban = reasonban
				UsersData.timebanned = gio
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS BANNED ]\n» Đã ban thành công người dùng!\n» NAME: ${UsersData.name}\n» UID: ${handleReaction.target}\n» Lý do: ${reasonban}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => {
					api.unsendMessage(handleReaction.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				break;
			}
			case "unban": {
				const UsersData = UsersAll.find(item => item.id == handleReaction.target);
				UsersData.banned = false;
				UsersData.reasonban = ""
				UsersData.timebanned = ""
				fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
				return api.sendMessage(`[ USERS UNBAN ]\n» Đã unban thành công người dùng!\n» NAME: ${UsersData.name}\n» UID: ${handleReaction.target}`, event.threadID, async (error, info) => {
					api.sendMessage(`[ USERS UNBAN ]\n» Bạn đã được ADMIN BOT gỡ ban!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰`, handleReaction.target, async (error, info) => {
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
					api.unsendMessage(handleReaction.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
			}
			default:
				break;
		}
	} catch (e) { console.log(e) }
}

export async function run({ event, api, args, UsersAll, client, utils }) {
	try {
		let content = args.slice(1, args.length);
		switch (args[0]) {
			case "ban": {
				if (event.messageReply == undefined) return api.sendMessage(`[ USERS BANNED ]\n» Bạn phải reply hoặc nhập UID`, event.threadID);
				const idBan = content[0] || event.messageReply.senderID
				if (isNaN(idBan)) return api.sendMessage(`[ USERS BANNED ]\n» ${idBan} không phải là IDusers!`, event.threadID);
				const UsersData = UsersAll.find(item => item.id == idBan);
				if (!UsersData) return api.sendMessage(`[ USERS BANNED ]\n» Users không tồn tại trong database!\n» UID: ${idBan}`, event.threadID);
				if (UsersData.banned) return api.sendMessage(`[ USERS BANNED ]\n» UID: ${idBan}\n» Đã bị ban từ trước`, event.threadID);
				return api.sendMessage(`[ USERS BANNED ]\n» Bạn muốn ban users này ?\n» NAME: ${UsersData.name}\n» UID: ${idBan}\n\n» Reaction vào tin nhắn này để ban!\n» Reply vào tin nhắn này để ghi lý do ban!`, event.threadID, (error, info) => {
					client.handleReaction.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "ban",
						target: idBan
					});
					client.handleReply.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "ban",
						target: idBan
					});
				})
				break;
			}
			case "unban": {
				if (event.messageReply == undefined) return api.sendMessage(`[ USERS UNBAN ]\n» Bạn phải reply hoặc nhập UID`, event.threadID);
				const idBan = content[0] || event.messageReply.senderID
				if (isNaN(idBan)) return api.sendMessage(`[ USERS UNBAN ]\n» ${idBan} không phải là IDusers`, event.threadID);
				const UsersData = UsersAll.find(item => item.id == idBan);
				if (!UsersData) return api.sendMessage(`[ USERS UNBAN ]\n» USERS không tồn tại trong database!\n» UID: ${idBan}`, event.threadID);
				if (!UsersData.banned) return api.sendMessage(`[ USERS UNBAN ]\n» UID: ${idBan}\n» Không bị ban từ trước`, event.threadID);
				return api.sendMessage(`[ USERS UNBAN ]\n» Bạn muốn unban users này ?\n» NAME: ${UsersData.name}\n» UID: ${idBan}\n\n» Reaction vào tin nhắn này để unban!`, event.threadID, (error, info) => {
					client.handleReaction.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "unban",
						target: idBan
					});
				})
				break;
			}
			case "list": {

				if (!args[1] || !isNaN(args[1])) {
					const numberOfOnePage = 10;
					const page = parseInt(args[1]) || 1;
					let msg = "", listUsers = [], userID = [];
					let i = 0;
					let startSlice = numberOfOnePage * page - numberOfOnePage;
					i = startSlice;
					if (page > parseInt(Math.ceil(UsersAll.length / numberOfOnePage))) return;
					else {
						const usersOfPage = UsersAll.slice(startSlice, startSlice + numberOfOnePage);
						for (let user of usersOfPage) {
							listUsers.push({
								id: user.id,
								name: user.name,
								gender: user.gender,
								banned: user.banned
							});
						}

						for (let Usres of listUsers) {
							msg += `${++i}/ ${Usres.name}\n» UID: ${Usres.id}\n» Giới tính : ${((Usres.gender == "MALE") ? "♂️" : "♀️")} | Banned : ${((Usres.banned == true) ? "✅" : "❎")}\n\n`;
							userID.push(Usres.id);
						}
						return api.sendMessage(`[ USERS LIST ]\n${msg}» Trang [ ${page}/${Math.ceil(UsersAll.length / numberOfOnePage)} ]\n» Reply số thứ tự để\n» [Ban/Info/Noti]`, event.threadID, (error, info) => {
							client.handleReply.push({
								name: this.config.name,
								messageID: info.messageID,
								author: event.senderID,
								type: "list",
								target: userID
							});
						})
					}
				} else return utils.throwError(this.config.name, event.threadID, event.messageID);
				break;
			}
			case "banned": {
				let msg = "", listid = [], number = 1;
				const in4thr = async (idthr) => {
					const UsersData = UsersAll.find(item => item.id == idthr);
					return `Name: ${UsersData.name}\n» UID: ${idthr}\n`;
				};
				for (let idthr of UsersAll) {
					const UsersData = UsersAll.find(item => item.id == idthr.id);
					if (UsersData.banned == true) {
						msg += `${number++}. ${(await in4thr(idthr.id))}`;
						listid.push(idthr.id);
					}
				};
				msg == "" ?
					api.sendMessage('[ ✅ USERS BANNED ]\n» Hiện tại không có người dùng nào bị ban',
						event.threadID,
						event.messageID
					) : api.sendMessage(
						'[ ❎ USERS BANNED ]\n» Những người đã bị ban khỏi hệ thống bot gồm:\n\n' + msg + "\nReply tin nhắn này + số thứ tự để unban người dùng tương ứng",
						event.threadID, (error, info) => {
							client.handleReply.push({
								name: this.config.name,
								messageID: info.messageID,
								author: event.senderID,
								type: 'unban',
								target: listid
							});
						},
						event.messageID
					);
				break;
			}
			case "cmd": {
				if (event.messageReply == undefined) return api.sendMessage(`[ USERS COMMAND ]\n» Bạn phải reply hoặc nhập UID`, event.threadID);
				const idBan = content[0] || event.messageReply.senderID
				return api.sendMessage(`[ USERS COMMAND ]\n» 1/ Xem danh sách commands bị ban!\n» 2/ Ban commands người dùng!`, event.threadID, (error, info) => {
					client.handleReply.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "command",
						target: idBan
					});
				}, event.messageID);
				break;
			}
			default:
				break;
		}
	} catch (e) { console.log(e) }
} 
