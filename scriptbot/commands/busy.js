export default {
	name: "busy",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Không làm phiền bot sẽ không tag bạn",
	shortDescription: "Không làm phiền",
	usages: [
	    'busy: bật chế độ không làm phiền',
		'busy <xxxx>: bật chế độ không làm phiền với lý do: <xxxx>'
    ],
	cooldowns: 5
};


import fs from "fs-extra";
export async function handleReply({ api, event, handleReply, client, ThreadsAll, UsersAll }) {
	try {
	if (parseInt(event.senderID) !== parseInt(handleReply.author)) return
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
	const DataBusy = ThreadsData.busyData.find(item => item.id == handleReply.idbusy)
	const UsersData = UsersAll.find(item => item.id == handleReply.idbusy);
	const reasonTag = event.body || null;
	DataBusy.idTag = handleReply.author
	DataBusy.reasonTag = reasonTag
	api.sendMessage(`[ MESSAGE BUSY ]\n» Đã để lại lời nhắn cho:\n» ${UsersData.name} thành công!\n» Với lời nhắn: ${reasonTag}`, event.threadID, async (err, data) => {
		await new Promise(resolve => setTimeout(resolve, 10000));
		return api.unsendMessage(data.messageID);
	} ,event.messageID);
	return fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
    } catch (e) { console.log(e) }
	

}

export async  function event({ api, event, client, ThreadsAll, UsersAll }) {
	try {
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID)
	const UsersData = UsersAll.find(item => item.id == event.senderID);
	const DataBusy = ThreadsData.busyData.find(item => item.id == event.senderID)
	let arrayUID = [];
	for (const data of ThreadsData.busyData) arrayUID.push(data.id)
	 if (!event.mentions || !ThreadsData.busyData) return;
    const mention = Object.keys(event.mentions);
    if (arrayUID.includes(event.senderID)) {
		ThreadsData.busyData.splice(ThreadsData.busyData.findIndex(item => item.id == event.senderID), 1)
		fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
		return api.sendMessage(`[ ${UsersData.name} ]\n» Đã tắt chế độ không làm phiền.${DataBusy.reasonTag ? `\n\n[ MESSAGE BUSY ]\n» ${UsersAll.find(item => item.id == DataBusy.idTag).name}\n» Đã tag bạn và để lại lời nhắn: ${DataBusy.reasonTag}` : ""}`, event.threadID, event.messageID);    
	}
    for (const id of mention) {
        if (arrayUID.includes(id.toString())) {
			const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID)
			const UsersData = UsersAll.find(item => item.id == id);
			const DataBusy = ThreadsData.busyData.find(item => item.id == id)
            const reason = DataBusy.reason;
            return api.sendMessage(`[ BUSY ]\n» Hiện tại người dùng ${UsersData.name} đang bận ${(typeof reason == "string") ? `\n» với lý do: ${reason}` : ""}\n\n» Hãy reply(phản hồi) để lại lời nhắn cho người dùng đang bận!`, event.threadID, async (err, data) => {
				client.handleReply.push({
                        name: this.default.name,
                        messageID: data.messageID,
                        author: event.senderID,
						idbusy: id
                    });
				await new Promise(resolve => setTimeout(resolve, 15000));
				return api.unsendMessage(data.messageID);
			}, event.messageID);
        }
    }
    } catch (e) { console.log(e) }
}

export async function handleReaction({ event, api, UsersAll, client, ThreadsAll, handleReaction }) {
	try {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return
	const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
	const UsersData = UsersAll.find(item => item.id == handleReaction.author);
	ThreadsData.busyData.push({ id: handleReaction.author, reason: handleReaction.reason, idTag: null, reasonTag: null })
	fs.writeFileSync(client.dirMain + "/data/Thread.json",JSON.stringify(ThreadsAll, null, "\t"));
	return api.sendMessage(`[ ${UsersData.name} ]\n» Đã bật chế độ không làm phiền.${handleReaction.reason ? `\n» Với lý do: ${handleReaction.reason}` : ""}`, event.threadID, async (err, data) => {
		api.unsendMessage(handleReaction.messageID)
		await new Promise(resolve => setTimeout(resolve, 10000));
		return api.unsendMessage(data.messageID);
	},event.messageID);
    } catch (e) { console.log(e) }
}

export async function run({ api, event, args, client }) {
	try {
		const content = args.join(" ") || null;
		return api.sendMessage(`[ BUSY ]\n» Bạn có muốn bật chế độ không làm phiền.${content ? `\n» Với lý do: ${content}` : ""}\n\n» Hãy reaction vào tin nhắn này để bật!`, event.threadID, async (err, data) => {
			client.handleReaction.push({
				name: this.default.name,
				messageID: data.messageID,
				author: event.senderID,
				reason : content
			});
		},event.messageID);
        } catch (e) { console.log(e) }

}