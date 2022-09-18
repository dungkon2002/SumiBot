export default {
	name: "leave",
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

import fs from "fs-extra";

export async function run({ api, event, UsersAll, ThreadsAll, client }) {
	if (event.logMessageType == "log:unsubscribe") {
		try {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
			let msg
			const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
			if (Object.keys(threadInfo.nicknames || {}).includes(event.logMessageData.leftParticipantFbId.toString())) {
				delete threadInfo.nicknames[event.logMessageData.leftParticipantFbId.toString()]
			}
			if (threadInfo.ExpGrpup.some(item => item.id == event.logMessageData.leftParticipantFbId)) {
				threadInfo.ExpGrpup.splice(threadInfo.ExpGrpup.findIndex(item => item.id == event.logMessageData.leftParticipantFbId), 1)
			}
			if (threadInfo.ExpWeek.some(item => item.id == event.logMessageData.leftParticipantFbId)) {
				threadInfo.ExpWeek.splice(threadInfo.ExpWeek.findIndex(item => item.id == event.logMessageData.leftParticipantFbId), 1)
			}
			if (threadInfo.adminIDs.some(item => item.id == event.logMessageData.leftParticipantFbId)) {
				threadInfo.adminIDs.splice(threadInfo.adminIDs.findIndex(item => item.id == event.logMessageData.leftParticipantFbId), 1)
			}
			if (threadInfo.userInfo.some(item => item.id == event.logMessageData.leftParticipantFbId)) {
				threadInfo.userInfo.splice(threadInfo.userInfo.findIndex(item => item.id == event.logMessageData.leftParticipantFbId), 1)
			}
			if (threadInfo.participantIDs.includes(event.logMessageData.leftParticipantFbId)) {

				threadInfo.participantIDs.splice(threadInfo.participantIDs.indexOf(event.logMessageData.leftParticipantFbId.toString()), 1)
			}
			fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
			if (UsersAll.some(item => item.id.toString() == event.logMessageData.leftParticipantFbId.toString())) {
				var name = UsersAll.find(item => item.id == event.logMessageData.leftParticipantFbId).name
			} else var name = "Người Dùng Facebook"
			let getAuthor = UsersAll.find(item => item.id == event.author).name || (await api.getUserInfo(event.author))[event.author].name
			let type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời " : `bị ${getAuthor} đấm bay`;
			msg = "{name} Đã {type} khỏi nhóm"
			msg = msg
				.replace(/\{name}/g, name)
				.replace(/\{type}/g, type);
			return api.sendMessage("GGWP, " + msg, event.threadID)
		} catch (e) { console.log(e) }
	} else return;
}
