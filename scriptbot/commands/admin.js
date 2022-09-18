export default {
	name: "admin",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Quản lý admin",
	shortDescription: "Quản lý admin",
	usages: [
	    'admin add [reply/@tag/uid]: thêm admin bot bằng [reply/@tag/uid]',
		'admin list: xem danh sách admin bot',
		'admin -r [reply/@tag/uid]: xóa admin bot bằng [reply/@tag/uid]',
    ],
	cooldowns: 5
};

import fs from "fs-extra";

export async function run({ api, event, global, args, permssion, utils, client, UsersAll }) {
	try {
    const content = args.slice(1, args.length);
    const option = args[0];
    if (option == "list") {
        const listAdmin = global.config.ADMINBOT;
        var msg = [];
        for (const id of listAdmin) {
            if (parseInt(id)) {
                const UsersData = UsersAll.find(item => item.id == id);
                msg.push(`» ${UsersData.name}\nhttps://fb.me/${id}`);
            }
        }

        return api.sendMessage(`[ ADMIN LIST ] Danh sách toàn bộ admin bot: \n${msg.join("\n")}`, event.threadID, event.messageID);
    }


    else if (option == "add" && permssion == 2) {
        if (event.type == "message_reply") {
            const name = UsersAll.find(item => item.id == event.messageReply.senderID).name || "Người dùng facebook";
            if (global.config.ADMINBOT.includes(event.messageReply.senderID.toString()))  return api.sendMessage(`[ ADMIN ADD ] Người dùng :\n+ [ ${event.messageReply.senderID} ] » ${name}\nĐã tồn tại trong danh sách ADMINBOT`, event.threadID, event.messageID);
            global.config.ADMINBOT.push(event.messageReply.senderID);    
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN ADD ] Đã thêm người dùng vào admin bot:\n+ [ ${event.messageReply.senderID} ] » ${name}`, event.threadID, event.messageID);
        }
        else if (Object.keys(event.mentions).length !== 0) {
            var listAdd = [];
            const mention = Object.keys(event.mentions);
            for (const id of mention) {
                const name = UsersAll.find(item => item.id == id).name || "Người dùng facebook";
            if (global.config.ADMINBOT.includes(id.toString()))  return api.sendMessage(`[ ADMIN ADD ] Người dùng :\n+ [ ${id} ] » ${name}\nĐã tồn tại trong danh sách ADMINBOT`, event.threadID, event.messageID);
                global.config.ADMINBOT.push(id);
                listAdd.push(`+ [ ${id} ] » ${event.mentions[id]}`);
            }
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN ADD ] Đã thêm người dùng vào admin bot:\n${listAdd.join("\n").replace(/\@/g, "")}`, event.threadID, event.messageID);
        }
        else if (content.length != 0 && !isNaN(content)) {
            const name = UsersAll.find(item => item.id == content).name || "Người dùng facebook";
            if (global.config.ADMINBOT.includes(content.toString()))  return api.sendMessage(`[ ADMIN ADD ] Người dùng :\n+ [ ${content} ] » ${name}\nĐã tồn tại trong danh sách ADMINBOT`, event.threadID, event.messageID);
            global.config.ADMINBOT.push(content);
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN ADD ] Đã thêm người dùng vào admin bot:\n+ [ ${content} ] » ${name}`, event.threadID, event.messageID);
        }
        else return utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    else if (option == "-r" && permssion == 2) {
        if (event.type == "message_reply") {
            const index = global.config.ADMINBOT.findIndex(item => item == event.messageReply.senderID);
            if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${event.messageReply.senderID} không tồn tại trong admin bot!`, event.threadID, event.messageID);
            global.config.ADMINBOT.splice(index, 1);
            const name = UsersAll.find(item => item.id == event.messageReply.senderID).name || "Người dùng facebook";
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN REMOVE ] Đã xóa người dùng khỏi admin bot:\n- [ ${event.messageReply.senderID} ] » ${name}`, event.threadID, event.messageID);
        }
        else if (event.mentions.length != 0) {
            var listAdd = [];
            const mention = Object.keys(event.mentions);
            for (const id of mention) {
                const index = global.config.ADMINBOT.findIndex(item => item == id);
                if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${id} không tồn tại trong admin bot!`, event.threadID, event.messageID);
                global.config.ADMINBOT.splice(index, 1);
                listAdd.push(`- [ ${id} ] » ${event.mentions[id]}`);
            }
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN REMOVE ] Đã xóa người dùng khỏi admin bot:\n${listAdd.join("\n").replace(/\@/g, "")}`, event.threadID, event.messageID);
        }
        else if (!isNaN(content)) {
            const index = global.config.ADMINBOT.findIndex(item => item == event.messageReply.senderID);
            if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${content} không tồn tại trong admin bot!`, event.threadID, event.messageID);
            global.config.ADMINBOT.splice(index, 1);
            const name = UsersAll.find(item => item.id == content).name || "Người dùng facebook";
            fs.writeFileSync(client.dirMain + "/data/global.json" , JSON.stringify(global, null, 4), 'utf8');
            return api.sendMessage(`[ ADMIN REMOVE ] Đã xóa người dùng khỏi admin bot:\n- [ ${content} ] » ${name}`, event.threadID, event.messageID);
        }
        else return utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    else return utils.throwError(this.config.name, event.threadID, event.messageID);
   } catch (e) { console.log(e) }
}