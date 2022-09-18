export default {
	name: "adminOnly",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "NDKhánh",
	description: "AdminOnly",
	shortDescription: "AdminOnly",
	usages: [
	    'AdminOnly',
    ],
	cooldowns: 5
};

import fs from "fs-extra";

export async function run({ api, event, global, args, permssion, utils, client, UsersAll , AdminOnly}) {
	try {
	 if(!AdminOnly.some(item => item.threadID == event.threadID)) {
	     AdminOnly.push({threadID : event.threadID, hasPermssion : 1 })
	       fs.writeFileSync(client.dirMain + "/data/AdminOnly.json", JSON.stringify(AdminOnly, null, "\t"));
	       return api.sendMessage("⊱ ⋅ ──SUMICHAN── ⋅ ⊰\nĐã Bật Chế Độ AdminOnly Thành Công ! chế độ chỉ QTV box mới dùng được",event.threadID);
	 }
	 if(AdminOnly.some(item => item.threadID == event.threadID)){
	     const adminData = AdminOnly.find(item => item.threadID == event.threadID) 
	     if(adminData.hasPermssion == 1){
	         adminData.hasPermssion = 0
	        fs.writeFileSync(client.dirMain + "/data/AdminOnly.json", JSON.stringify(AdminOnly, null, "\t"));
	      return api.sendMessage("⊱ ⋅ ──SUMICHAN── ⋅ ⊰\nĐã Tắt Chế Độ AdminOnly Thành Công ! Thành viên đều được sử dụng bot",event.threadID); 
	     } else {
	         adminData.hasPermssion = 1
	        fs.writeFileSync(client.dirMain + "/data/AdminOnly.json", JSON.stringify(AdminOnly, null, "\t"));
	        return api.sendMessage("⊱ ⋅ ──SUMICHAN── ⋅ ⊰\nĐã Bật Chế Độ AdminOnly Thành Công ! chế độ chỉ QTV box mới dùng được",event.threadID);
	     }
	 }
	} catch (e) {
	    console.log(e)
	    return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
	}
}