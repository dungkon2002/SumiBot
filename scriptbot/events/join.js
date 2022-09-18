export default {
	name: "join",
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

import fs from "fs-extra";

import moment from "moment-timezone";

export async function run({ api, event, global, ThreadsAll, ThreadSettings, client }) {
  if (event.logMessageType == "log:subscribe") {
	  try {
	const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`[ ${prefix} ] • ${(!global.config.BOTNAME) ? "Made by NDKhánh" : global.config.BOTNAME}`, event.threadID, api.getCurrentUserID());
		return api.sendMessage(`Kết nối thành công \n + ${prefix}help: để xem toàn bộ lệnh`, event.threadID);
	}
	else {	
	const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
	const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID),
    threadName = threadInfo.threadName;
    var mentions = [],
    nameArray = [],
    memLength = [];
    for (var i = 0, num = 1; i < event.logMessageData.addedParticipants.length; i++) {
    let id = event.logMessageData.addedParticipants[i].userFbId;
    let userName = event.logMessageData.addedParticipants[i].fullName;
    nameArray.push(userName);
    mentions.push({ tag: userName, id });
    memLength.push(threadInfo.participantIDs.length + num++ - i);
	if (!threadInfo.participantIDs.includes(id)) {
		threadInfo.participantIDs.push(id)
		}
		if (!threadInfo.ExpGrpup.some(item => item.id == id)) {
			threadInfo.ExpGrpup.push({ id : id, exp : 0, ExpToday : 0 })
			}
	if (!threadInfo.userInfo.some(item => item.id == id)) {

		const DataI = (await api.getUserInfo(id))
		const Gender =((DataI[id].gender == 2) ? "MALE" : "FEMALE")
		threadInfo.userInfo.push({
			        id:	id,
					name: DataI[id].name,
					firstName : DataI[id].firstName,
					vanity: DataI[id].vanity,
					thumbSrc: DataI[id].thumbSrc,
					profileUrl: DataI[id].profileUrl,
					gender: Gender,
					type: DataI[id].type,
					isFriend: DataI[id].isFriend,
					isBirthday: DataI[id].isBirthday
		})
		}
	fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
	api.changeNickname(`${userName} (TVM)`, event.threadID, event.logMessageData.addedParticipants[i].userFbId);	
	api.sendMessage(`Đã biệt danh tạm thời cho :\n${userName} là (TVM)`, event.threadID)
    }
    memLength.sort((a, b) => a - b);
    let msg =
    `Chào mừng ${nameArray.join(
        ", "
    )} đã đến với Nhóm:\n${threadName}.\n${
        memLength.length > 1 ? "Các bạn" : "Bạn"
    } là thành viên thứ: ${memLength.join(", ")} của nhóm.`+
	`\nChúc ${ memLength.length > 1 ? "Các bạn" : "Bạn" } có một buổi ${(hours <= 10 ? "sáng" : hours > 10 && hours <= 12 ? "trưa" : hours > 12 && hours <= 18 ? "chiều" : "tối")} vui vẻ <3\n` +
    `  + ${prefix}rule: Xem luật nhóm.\n`;
    return api.sendMessage({ body: msg, mentions }, event.threadID)
	}
} catch (e) {console.log(e)}
} else return
}