export default {
	name: "imgur",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Up ảnh lên imgur",
	shortDescription: "Up ảnh lên imgur",
	usages: [
	    'imgur <reply>: Up ảnh lên imgur bằng <reply>'
    ],
    key: {
		"ClientID": "c76eb7edd1459f3"
	},
	cooldowns: 5
};


import fs from "fs-extra"
import imgur from 'imgur';
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, event, utils, global }) {
	try {
	if (event.type !== "message_reply") return api.sendMessage("Bạn phải reply một video, ảnh nào đó", event.threadID, event.messageID);
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một video, ảnh nào đó", event.threadID, event.messageID);
	if (event.messageReply.attachments[0].type == "audio" ) return api.sendMessage("Tệp đính kèm không được hộ trợ", event.threadID, event.messageID);
            
    imgur.setClientId(this.default.key.ClientID);
    const attachmentSend = [];
    async function getAttachments(attachments) {
			let startFile = 0;
			for (const data of attachments) {
			const ext = data.type == "photo" ? "jpg" :
			data.type == "video" ? "mp4" : 
			data.type == "audio" ? "m4a" :
			data.type == "animated_image" ? "gif" : "txt";
			const pathSave = ps.resolve(__dirname, 'cache', `${startFile}.${ext}`);
			++startFile;
			const url = data.url;
			await utils.downloadFile(url, pathSave);
			attachmentSend.push(pathSave);
			}
		}
		if (event.messageReply) {
			if (event.messageReply.attachments.length > 0) {
			await getAttachments(event.messageReply.attachments);
			}
		}
		let mgs = "" , Succes = 0, Error = [];
		for (const getImage of attachmentSend ) {
		try {
		const getLink = await imgur.uploadFile(getImage)
		mgs += `${++Succes}/ ${getLink.link}\n`
		fs.unlinkSync(getImage)
		} catch {
			Error.push(getImage);
			fs.unlinkSync(getImage)
		}
		}
		return api.sendMessage(`[ IMGUR UPLOAD ]\n» Succes : ${Succes}\n» Error : ${Error.length}\n⊱ ⋅ ────────────── ⋅ ⊰\n${mgs ? `${mgs}` : ""}`, event.threadID);
} catch (e) {
	console.log(e)
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}