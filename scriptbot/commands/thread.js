export default {
	name: "thread",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "NDKhánh",
	description: "Cấm hoặc gỡ cấm nhóm!",
	shortDescription: "Quản lý Thread",
	usages: [
	"thread ban: ban nhóm bạn thực thi lệnh",
	"thread ban <xxxx>: ban nhóm bằng TID",
	"thread unban: gỡ ban nhóm bạn thực thi lệnh",
	"thread unban <xxxx>: gỡ ban nhóm bằng TID",
	"thread list: danh sách nhóm trong dữ liệu BOT",
	"thread banned: quản lý danh sách nhóm bị ban",
	"thread cmd: quản lý commands nhóm",
	"thread cmd <xxxx>: quản lý commands bằng TID"
	],
	cooldowns: 5

}

import fs from "fs-extra"
import moment from "moment-timezone"

export async function handleReply({ event, api, ThreadsAll, client, handleReply }) {
    if (parseInt(event.senderID) !== parseInt(handleReply.author)) return api.sendMessage(`[ THREAD BANNED ]\n» Bạn không phải là người dùng lệnh!`, event.threadID, async (error, info) => {
        await new Promise(resolve => setTimeout(resolve, 10000));
        return api.unsendMessage(info.messageID);
    });
	try {
	switch (handleReply.type) {
		case "ban": {
			const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");  
            const reasonban = event.body
			const ThreadsData = ThreadsAll.find(item => item.threadID == handleReply.target);
            ThreadsData.banned = true;
            ThreadsData.reasonban = reasonban
			ThreadsData.timebanned = gio
			fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
			return api.sendMessage(`[ THREAD BANNED ]\n» Đã ban thành công nhóm!\n» NAME: ${ThreadsData.threadName}\n» TID: ${handleReply.target}\n» Lý do: ${reasonban}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => { 
                api.unsendMessage(handleReply.messageID)
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
			break;
		}
		case "list": {
			let arg = event.body.split(" ");
			let idgr = handleReply.target[arg[1]-1];
			if(arg[0] == "ban" || arg[0] == "Ban") {
			let reason = arg.slice(2).join(" ")
			if(!reason) reason = "Không có lý do nào được đưa ra";
			api.sendMessage(`[ THREAD BAN ]\n» Đã nhận lệnh BAN nhóm từ admin\n» Với lý do: ${reason}`, idgr, async (error, info) => {
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
			const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");  
			const ThreadsData = ThreadsAll.find(item => item.threadID == idgr);
            ThreadsData.banned = true;
            ThreadsData.reasonban = reason
			ThreadsData.timebanned = gio
			fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
			return api.sendMessage(`[ THREAD BANNED ]\n» Đã ban thành công nhóm!\n» NAME: ${ThreadsData.threadName}\n» TID: ${idgr}\n» Lý do: ${reason}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => { 
                api.unsendMessage(handleReply.messageID)
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
	        }
			if(arg[0] == "out" || arg[0] == "Out") {
				let reason = arg.slice(2).join(" ")
				if(!reason) reason = "Không có lý do nào được đưa ra";
				const ThreadsData = ThreadsAll.find(item => item.threadID == idgr);
	            api.sendMessage(`[ THREAD OUT ]\n» Đã nhận lệnh out nhóm từ admin\n» Với lý do: ${reason}`, idgr, () =>
	            api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr));
	            api.sendMessage(`[ THREAD OUT ]\n» Đã Out thành công nhóm!\n» TID: ${idgr}\n» NAME: ${ThreadsData.threadName}\n» Với lý do: ${reason}`, event.threadID, async (error, info) => { 
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
			}
			if(arg[0] == "Noti" || arg[0] == "noti") {
				let reason = arg.slice(2).join(" ")
				if(!reason) return api.sendMessage(`Nội dung thông báo không được để trống!`, event.threadID, () => api.unsendMessage(handleReply.messageID));
				const ThreadsData = ThreadsAll.find(item => item.threadID == idgr);
	            api.sendMessage(`[ THREAD NOTIFICATION ]\n» Thông Báo Từ ADMINBOT Gửi Đến Nhóm Bạn!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰\n${reason}`, idgr);
	            api.sendMessage(`[ THREAD NOTIFICATION ]\n» Đã gửi thông báo thành công:\n» TID: ${idgr}\n» NAME: ${ThreadsData.threadName}`, event.threadID, async (error, info) => { 
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				}
				if(arg[0] == "Info" || arg[0] == "info") {
					api.sendMessage(`[ THREAD INFO ]\n» UPDATE SAU`, event.threadID, async (error, info) => { 
						api.unsendMessage(handleReply.messageID)
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
				}
				break;	
	    	}
			case "unban": {
				const ThreadsData = ThreadsAll.find(item => item.threadID == handleReply.target[event.body - 1]);
				ThreadsData.banned = false;
				ThreadsData.reasonban = ""
				ThreadsData.timebanned = ""
				fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
				return api.sendMessage(`[ THREAD UNBAN ]\n» Đã unban thành công nhóm!\n» NAME: ${ThreadsData.threadName}\n» TID: ${handleReply.target[event.body - 1]}`, event.threadID, async (error, info) => { 
					api.sendMessage(`[ THREAD UNBAN ]\n» Nhóm bạn đã được ADMIN BOT gỡ ban!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰`, handleReply.target[event.body - 1], async (error, info) => {
						await new Promise(resolve => setTimeout(resolve, 10000));
						return api.unsendMessage(info.messageID);
					});
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				break;
			}
			case "command": {
				switch (event.body) {
					case "1": {
						let msg = "", i = 1, arrayCmd = []; 
						const ThreadsData = ThreadsAll.find(item => item.threadID == handleReply.target);
						for (let getCmd of ThreadsData.commandBanned) {
							msg += `${i++}/ Commands: ${getCmd.cmd}\n» TimeBan: ${getCmd.timebanned}\n`
							arrayCmd.push(getCmd.cmd);
						}
						api.unsendMessage(handleReply.messageID)
						return	msg == "" ?
            api.sendMessage('[ ✅ THREAD BANNED ]\n» Hiện tại không có commands nào bị ban',
                event.threadID,
                event.messageID
            ) :  api.sendMessage(`[ THREAD UNBANCMD ]\n${msg}\n» Reply số tứ thự để unban commands đó!`, event.threadID, (error, info) => {
							client.handleReply.push({
								name: this.default.name,
								messageID: info.messageID,
								author: event.senderID,
								type: "unbanCmd",
								target: handleReply.target,
								cmd: arrayCmd
							});
						}, event.messageID);
						break;
					}
					case "2": {
						api.unsendMessage(handleReply.messageID)
						return api.sendMessage(`[ THREAD BANCMD ]\n» Reply tin nhắn \n» Command ban | Lý do ban`, event.threadID, (error, info) => {
							client.handleReply.push({
								name: this.default.name,
								messageID: info.messageID,
								author: event.senderID,
								type: "banCmd",
								target: handleReply.target
							});
						}, event.messageID);	
					}
				}
				break;
			}
			case "banCmd": {
				let arg = event.body.split(" ");
				let reason = arg.slice(1).join(" ")
				if(!reason) reason = "Không có lý do nào được đưa ra";
				const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");
				const allCommandName = [];
			    for (const cmd of client.commands) allCommandName.push(cmd.config.name);
				if (!allCommandName.includes(arg[0])) return api.sendMessage(`[ ⛔️ THREAD BANCMD ]\n» Lệnh bạn cấm không tồn tại\n\n» ERROR ${arg[0]}`, event.threadID, async (error, info) => {
					await new Promise(resolve => setTimeout(resolve, 5000));
					return api.unsendMessage(info.messageID);
				});  
				const ThreadsData = ThreadsAll.find(item => item.threadID == handleReply.target);
				ThreadsData.commandBanned.push({cmd: arg[0], reasonban: reason, timebanned: gio})
				fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
				return api.sendMessage(`[ THREAD BANCMD ]\n» Đã ban thành công commands!\n» ${arg[0]}\n» Với lý do: ${reason}`, event.threadID, async (error, info) => { 
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				break;
			}
			case "unbanCmd": {
			  const ThreadsData = ThreadsAll.find(item => item.threadID == handleReply.target);
				ThreadsData.commandBanned.splice(ThreadsData.commandBanned.findIndex(item => item.cmd == handleReply.cmd[event.body - 1]), 1)
				fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
				return api.sendMessage(`[ THREAD UNBANCMD ]\n» Đã unban thành công commands!\n» ${handleReply.cmd[event.body - 1]}`, event.threadID, async (error, info) => { 
					api.unsendMessage(handleReply.messageID)
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				break;
			}
		default:
			return;
	}
    } catch (e) { console.log(e) }
}

export async function handleReaction ({ event, api, ThreadsAll, client, handleReaction }) {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return api.sendMessage(`[ THREAD BANNED ]\n» Bạn không phải là người dùng lệnh!`, event.threadID, async (error, info) => {
        await new Promise(resolve => setTimeout(resolve, 10000));
        return api.unsendMessage(info.messageID);
    });
	try {
	switch (handleReaction.type) {
		case "ban": {
            const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm D/MM/YYYY");  
            const reasonban = "Không có lý do nào được đưa ra!" 
			const ThreadsData = ThreadsAll.find(item => item.threadID == handleReaction.target);
            ThreadsData.banned = true;
            ThreadsData.reasonban = reasonban
			ThreadsData.timebanned = gio
			fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
			return api.sendMessage(`[ THREAD BANNED ]\n» Đã ban thành công nhóm!\n» NAME: ${ThreadsData.threadName}\n» TID: ${handleReaction.target}\n» Lý do: ${reasonban}\n» Vào lúc: ${gio}`, event.threadID, async (error, info) => { 
                api.unsendMessage(handleReaction.messageID)
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
			break;
		}
		case "unban": {
			const ThreadsData = ThreadsAll.find(item => item.threadID == handleReaction.target);
            ThreadsData.banned = false;
            ThreadsData.reasonban = ""
			ThreadsData.timebanned = ""
			fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
			return api.sendMessage(`[ THREAD UNBAN ]\n» Đã unban thành công nhóm!\n» NAME: ${ThreadsData.threadName}\n» TID: ${handleReaction.target}`, event.threadID, async (error, info) => { 
                api.sendMessage(`[ THREAD UNBAN ]\n» Nhóm bạn đã được ADMIN BOT gỡ ban!\n   ⊱ ⋅ ─ 🅂🅄🄼🄸🄲🄷🄰🄽 ─ ⋅ ⊰`, handleReaction.target, async (error, info) => {
					await new Promise(resolve => setTimeout(resolve, 10000));
					return api.unsendMessage(info.messageID);
				});
				api.unsendMessage(handleReaction.messageID)
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
		}
		default:
			return;
	}
    } catch (e) { console.log(e) }
}

export async function run({ event, api, args, ThreadsAll, client, utils }) {
	try {
    let content = args.slice(1, args.length);
	switch (args[0]) {
		case "ban": {
			const idBan = content[0] || event.threadID
            if (isNaN(idBan)) return api.sendMessage(`[ THREAD BANNED ]\n» ${idBan} không phải là IDthread!`, event.threadID);
            const ThreadsData = ThreadsAll.find(item => item.threadID == idBan);
            if (!ThreadsData) return api.sendMessage(`[ THREAD BANNED ]\n» Thread không tồn tại trong database!\n» TID: ${idBan}`, event.threadID);
            if (ThreadsData.banned) return api.sendMessage(`[ THREAD BANNED ]\n» TID: ${idBan}\n» Đã bị ban từ trước`, event.threadID);
            return api.sendMessage(`[ THREAD BANNED ]\n» Bạn muốn ban thread này ?\n» NAME: ${ThreadsData.threadName}\n» TID: ${idBan}\n\n» Reaction vào tin nhắn này để ban!\n» Reply vào tin nhắn này để ghi lý do ban!`, event.threadID, (error, info) => {
                client.handleReaction.push({
                    name: this.default.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "ban",
                    target: idBan
                });
                client.handleReply.push({
                    name: this.default.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "ban",
                    target: idBan
                });
            })	
			break;
		}
		case "unban": {
			const idBan = content[0] || event.threadID
            if (isNaN(idBan)) return api.sendMessage(`[ THREAD UNBAN ]\n» ${idBan} không phải là IDthread!`, event.threadID);
            const ThreadsData = ThreadsAll.find(item => item.threadID == idBan);
            if (!ThreadsData) return api.sendMessage(`[ THREAD UNBAN ]\n» Thread không tồn tại trong database!\n» TID: ${idBan}`, event.threadID);
            if (!ThreadsData.banned) return api.sendMessage(`[ THREAD UNBAN ]\n» TID: ${idBan}\n» Không bị ban từ trước`, event.threadID);
            return api.sendMessage(`[ THREAD UNBAN ]\n» Bạn muốn unban thread này ?\n» NAME: ${ThreadsData.threadName}\n» TID: ${idBan}\n\n» Reaction vào tin nhắn này để unban!`, event.threadID, (error, info) => {
                client.handleReaction.push({
                    name: this.default.name,
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
				const numberOfOnePage = 20;
				const page = parseInt(args[1]) || 1;
				let msg = "", listthread = [], groupid = [];
				let i = 0;
				let startSlice = numberOfOnePage * page - numberOfOnePage;
				i = startSlice;
				if(page > parseInt(Math.ceil(ThreadsAll.length / numberOfOnePage))) return;
				else {
					const threadOfPage = ThreadsAll.slice(startSlice, startSlice + numberOfOnePage);
					for (let thread of threadOfPage) {
						listthread.push({
							id: thread.threadID,
							name: thread.threadName,
							sotv: thread.participantIDs.length,
							active: thread.approvalMode,
							banned: thread.banned
						});
					}
					const listbox = listthread.sort((a, b) => {
						if (a.sotv > b.sotv) return -1;
						if (a.sotv < b.sotv) return 1;
					});
					for (let group of listbox) {
					msg += `${++i}/ ${group.name}\n» TID: ${group.id}\n» Số Thành Viên : ${group.sotv}\n» Phê duyệt : ${((group.active == true) ? "✅" : "❎")} | Banned : ${((group.banned == true) ? "✅" : "❎")}\n\n`;
					groupid.push(group.id);
					}
					return api.sendMessage(`[ THREAD LIST ]\n${msg}» Trang [ ${page}/${Math.ceil(ThreadsAll.length / numberOfOnePage)} ]\n» Reply số thứ tự để\n» [Ban/Info/Noti/Out]`, event.threadID, (error, info) => {
						client.handleReply.push({
							name: this.default.name,
							messageID: info.messageID,
							author: event.senderID,
							type: "list",
							target: groupid
						});
					})
				}
			} else return utils.throwError(this.default.name, event.threadID, event.messageID);
			break;
		}
		case "banned": {
			let msg = "", listid = [], number = 1;
			const in4thr = async(idthr) => {
				let ThreadsData = ThreadsAll.find(item => item.threadID == idthr);
				return `Name: ${ThreadsData.threadName}\n» TID: ${idthr}\n`;
			};
			for (let idthr of ThreadsAll) {
				let ThreadsData = ThreadsAll.find(item => item.threadID == idthr.threadID);
				if (ThreadsData.banned == true) {
					msg += `${number++}. ${(await in4thr(idthr.threadID))}`;
					listid.push(idthr.threadID);
				}
			};
			msg == "" ?
            api.sendMessage('[ ✅ THREAD BANNED ]\n» Hiện tại không có nhóm nào bị ban',
                event.threadID,
                event.messageID
            ) : api.sendMessage(
                '[ ❎ THREAD BANNED ]\n» Những nhóm đã bị ban khỏi hệ thống bot gồm:\n\n' + msg + "\nReply tin nhắn này + số thứ tự để unban nhóm tương ứng",
                event.threadID, (error, info) => {
                        client.handleReply.push({
                        name: this.default.name,
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
			const idBan = content[0] || event.threadID
			return api.sendMessage(`[ THREAD COMMAND ]\n» 1/ Xem danh sách commands bị ban!\n» 2/ Ban commands nhóm!`, event.threadID, (error, info) => {
                client.handleReply.push({
                    name: this.default.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "command",
					target: idBan
                });
            }, event.messageID);
			break;
		}
		default:
			return;
	}
    } catch (e) {console.log(e) }
} 