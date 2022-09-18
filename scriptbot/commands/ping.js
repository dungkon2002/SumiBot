export default {
	name: "ping",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "NDKhánh",
	description: "Tag toàn bộ thành viên trong nhom!",
	shortDescription: "tag all",
	usages: [
	'ping: để tag toàn bộ thành viên',
	'ping <xxxx>: Nội dung để ping, có thể để trống'
],
	cooldowns: 5
};

export async function run({ api, event, UsersAll, ThreadsAll, args }) {
	try {
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
	const UsersData = UsersAll.find(item => item.id == event.senderID);
	let listUserID, arrayUID = [];
	for (const data of ThreadsData.busyData) arrayUID.push(data.id)
	const botID = api.getCurrentUserID();
	listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
	listUserID = listUserID.filter(item => !arrayUID.includes(item));
	let job = ["Đã nhắc bạn trong 1 tin nhắn!","Đã xóa bạn ra khỏi nhóm!","Đã thêm bạn làm quản trị viên","Đã thêm bạn vào nhóm!"]
	var body = (args.length != 0) ? args.join(" ") : `${UsersData.name} ${job[Math.floor(Math.random() * job.length)]}`, mentions = [], index = 0;
    for(const idUser of listUserID) {
	body = body;
	mentions.push({ id: idUser, tag: body, fromIndex: index - 1 });
	index -= 1;
    }

    return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
} catch (e) { console.log(e) }
}
