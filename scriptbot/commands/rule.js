export default {
	name: "rule",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Thêm Luật nhóm",
	shortDescription: "Luật nhóm",
	usages: [
        'rule : xem luật nhóm',
	    'rule add <xxx>: Nhập nội dung',
        'rule image: reply ảnh muốn làm luật nhóm',
	    'rule [list/all]: xem toàn bộ luật nhóm',
		'rule [rm/remove/del] <xxxx>: số thứ tự luật muốn xóa',
        'rule [rm/remove/del] image: xóa ảnh luật của nhóm',
        'rule [rm/remove/del] all: xóa toàn bộ luật có trong nhóm'
    ],
	cooldowns: 5
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function onLoad() {
    const pathData = ps.join(__dirname, "cache", "rules.json");
    if (!fs.existsSync(pathData)) return fs.writeFileSync(pathData, "[]", "utf-8"); 
}

export async function run({ event, api, args, permssion, utils })  {
    const { threadID, messageID } = event;
    const pathData = ps.join(__dirname, "cache", "rules.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, image : false, listRule: [] };

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
    switch (args[0]) {
        case "image" : {
                if (event.type !== "message_reply") return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
                if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
                if (event.messageReply.attachments[0].type != "photo" ) return api.sendMessage("Đây không phải là image", event.threadID, event.messageID);
                const path = ps.resolve(__dirname, 'cache', 'rule', `${event.threadID}.png`);
                await utils.downloadFile(event.messageReply.attachments[0].url, path)
                 thisThread.image = true
                 fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
                return api.sendMessage(`[ Rule ] Đã thêm thành công ảnh luật nhóm!`, threadID, messageID);

        }
        case "add": {
                if (permssion == 0) return api.sendMessage("[Rule] Bạn không đủ quyền hạn để có thể sử dụng thêm luật!", threadID, messageID);
                if (content.length == 0) return api.sendMessage("[Rule] Phần nhập thông tin không được để trống", threadID, messageID);
                if (content.indexOf("\n") != -1) {
                    const contentSplit = content.split("\n");
                    for (const item of contentSplit) thisThread.listRule.push(item);
                    thisThread.image = false
                }
                else {
                    thisThread.listRule.push(content);
                    thisThread.image = false
                }
                fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
                api.sendMessage('[Rule] Đã thêm luật mới cho nhóm thành công!', threadID, messageID);        
        }
        case "list":
        case"all": {
            var msg = "", index = 0;
            for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
            if (msg.length == 0) return api.sendMessage("[Rule] Nhóm của bạn hiện tại chưa có danh sách luật để hiển thị!", threadID, messageID);
            api.sendMessage(`⊱ ⋅ ─ Luật của nhóm ─ ⋅ ⊰\n\n${msg}`, threadID, messageID);
            break;
            
        }
        case "rm":
        case "remove":
        case "del": {
            if (!isNaN(content) && content > 0) {
                if (permssion == 0) return api.sendMessage("[Rule] Bạn không đủ quyền hạn để có thể sử dụng xóa luật!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[Rule] Nhóm của bạn chưa có danh sách luật để có thể xóa!", threadID, messageID);
                thisThread.listRule.splice(content - 1, 1);
                api.sendMessage(`[Rule] Đã xóa thành công luật có số thứ tự thứ ${content}`, threadID, messageID);
                break;
            }
            else if (content == "all") {
                if (permssion == 0) return api.sendMessage("[Rule] Bạn không đủ quyền hạn để có thể sử dụng xóa luật!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[Rule] Nhóm của bạn chưa có danh sách luật để có thể xóa!", threadID, messageID);
                thisThread.listRule = [];
                api.sendMessage(`[Rule] Đã xóa thành công toàn bộ luật của nhóm!`, threadID, messageID);
                break;
            }
            else if (content == "image") {
                if (permssion == 0) return api.sendMessage("[Rule] Bạn không đủ quyền hạn để có thể sử dụng xóa ảnh luật!", threadID, messageID);
                try {
                    const path = ps.resolve(__dirname, 'cache', 'rule', `${event.threadID}.png`);
                    thisThread.image = false
                    fs.unlinkSync(path)  
                    fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8"); 
                    api.sendMessage(`[Rule] Đã xóa thành công Ảnh luật của nhóm!`, threadID, messageID);
                } catch {
                    return api.sendMessage("[Rule] Nhóm của bạn chưa có ảnh luật để có thể xóa!", threadID, messageID);
                }
                break;
            }
        }
        default: {
            try {
                try {
                    if (thisThread.image) {
                        const path = ps.resolve(__dirname, 'cache', 'rule', `${event.threadID}.png`);
                        return api.sendMessage({ body: `⊱ ⋅ ─ Luật của nhóm ─ ⋅ ⊰`, attachment: fs.createReadStream(path)}, event.threadID);   
                        }
                        var msg = "", index = 0;
                        for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
                        if (msg.length == 0) return api.sendMessage("[Rule] Nhóm của bạn hiện tại chưa có danh sách luật để hiển thị!", threadID, messageID);
                        api.sendMessage(`⊱ ⋅ ─ Luật của nhóm ─ ⋅ ⊰\n\n${msg}`, threadID, messageID);
                    
                } catch {
                    var msg = "", index = 0;
                    for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
                    if (msg.length == 0) return api.sendMessage("[Rule] Nhóm của bạn hiện tại chưa có danh sách luật để hiển thị!", threadID, messageID);
                    api.sendMessage(`⊱ ⋅ ─ Luật của nhóm ─ ⋅ ⊰\n\n${msg}`, threadID, messageID);
                }
                
            break;
                } catch {
             return
           }
        }
    }
}