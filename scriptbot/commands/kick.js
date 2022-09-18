export default {
	name: "kick",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Kick Thành Viên Nhóm",
	shortDescription: "Kick Thành Viên",
	usages: [
        'kick @tag : kick người bạn @tag',
	    'kick reply: kick người bạn reply tin nhắn'
    ],
	cooldowns: 5
};


import fs from "fs-extra"

export async function run({ api, event, ThreadsAll, client }) {
          try {
	var mention = Object.keys(event.mentions);
	const data = ThreadsAll.find(item => item.threadID == event.threadID)
		if (!data.adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage('Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!', event.threadID, event.messageID);
		if (event.type == "message_reply") {
			if (data.adminIDs.some(item => item.id == event.senderID)) {
		const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
		if (Object.keys(threadInfo.nicknames|| {}).includes(event.messageReply.senderID.toString())) {
		delete threadInfo.nicknames[event.messageReply.senderID.toString()]
		}
		if (threadInfo.ExpGrpup.some(item => item.id == event.messageReply.senderID)) {
		threadInfo.ExpGrpup.splice(threadInfo.ExpGrpup.findIndex(item => item.id == event.messageReply.senderID), 1)
		}
		if (threadInfo.ExpWeek.some(item => item.id == event.messageReply.senderID)) {
		threadInfo.ExpWeek.splice(threadInfo.ExpWeek.findIndex(item => item.id == event.messageReply.senderID), 1)
		}
		if (threadInfo.adminIDs.some(item => item.id == event.messageReply.senderID)) {
			threadInfo.adminIDs.splice(threadInfo.adminIDs.findIndex(item => item.id == event.messageReply.senderID), 1)
			}
		if (threadInfo.userInfo.some(item => item.id == event.messageReply.senderID)) {
			threadInfo.userInfo.splice(threadInfo.userInfo.findIndex(item => item.id == event.messageReply.senderID), 1)
			}
		if(threadInfo.participantIDs.includes(event.messageReply.senderID)) {

        threadInfo.participantIDs.splice(threadInfo.participantIDs.indexOf(event.messageReply.senderID.toString()), 1)
		
		}
		fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));  
		
            api.removeUserFromGroup(event.messageReply.senderID,event.threadID) 
				}
        }
		else if(!mention[0]) return api.sendMessage("Bạn phải tag hoặc reply người cần kick",event.threadID);
		if (data.adminIDs.some(item => item.id == event.senderID)) {
			for (let o in mention) {
				const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
					if (Object.keys(threadInfo.nicknames|| {}).includes(mention[o].toString())) {
					delete threadInfo.nicknames[mention[o].toString()]
					}
					if (threadInfo.ExpGrpup.some(item => item.id == mention[o])) {
					threadInfo.ExpGrpup.splice(threadInfo.ExpGrpup.findIndex(item => item.id == mention[o]), 1)
					}
					if (threadInfo.ExpWeek.some(item => item.id == mention[o])) {
					threadInfo.ExpWeek.splice(threadInfo.ExpWeek.findIndex(item => item.id == mention[o]), 1)
					}
					if (threadInfo.adminIDs.some(item => item.id ==  mention[o])) {
						threadInfo.adminIDs.splice(threadInfo.adminIDs.findIndex(item => item.id == mention[o]), 1)
						}
					if (threadInfo.userInfo.some(item => item.id == mention[o])) {
						threadInfo.userInfo.splice(threadInfo.userInfo.findIndex(item => item.id == mention[o]), 1)
						}
					if(threadInfo.participantIDs.includes(mention[o])) {
			
					threadInfo.participantIDs.splice(threadInfo.participantIDs.indexOf(mention[o].toString()), 1)
					
					}
					fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));  
					
				setTimeout(() => {	
					api.removeUserFromGroup(mention[o],event.threadID) 
				},3000)
			}
		}	
	} catch (e) {
		console.log(e);
		}
}
