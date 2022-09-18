export default {
	name: "cardinfo",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Dũngkon",
	description: "Lấy info Facebook",
	shortDescription: "Lấy info Facebook",
	usages: [
		'cardinfo: Lấy info của bạn',
		'cardinfo @tag: Lấy info người bạn tag',
		'cardinfo <xxxx>: Lấy info bằng link'
	],
	cooldowns: 5
};
import fs from "fs-extra"
import request from "request"
import axios from "axios"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, args, utils }) {
	try {
		let { senderID, threadID, messageID } = event;
		// if(event.type == "message_reply") { uid = event.messageReply.senderID }
		// else uid = senderID;
		const res = await api.getUserInfoV2(senderID);
		console.log(senderID)
		var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Bê Đê :v";
		var birthday = res.birthday ? `${res.birthday}` : "Nó ẩn rồi";
		var love = res.relationship_status ? `${res.relationship_status}` : "Nó ẩn rồi"
		var location = res.location.name ? `${res.location.name}` : "Nó ẩn rồi"
		var hometown = res.hometown.name ? `${res.hometown.name}` : "Nó ẩn rồi"
		// const t = (await axios.get(`https://s.hanakuhshsjsjshejsna.repl.co/fbcover/v1?uid=${senderID}&name=${encodeURI(res.name)}&location=${encodeURI(location)}&fl=${res.follow}&birthday=${birthday}&gioitinh=${encodeURI(gender)}&link=${res.link}&love=${encodeURI(love)}&hometown=${encodeURI(hometown)}`,{
		//     responseType: "stream"
		//   })).data;
		var callback = () => api.sendMessage({ body: ``, attachment: fs.createReadStream(__dirname + `/cache/${senderID}.jpg`) }, threadID, () => fs.unlinkSync(__dirname + `/cache/${senderID}.jpg`), messageID);
		return request(encodeURI(`https://api.dungkon.repl.co/fbcover/v1?uid=${senderID}&name=${res.name}&location=${location}&fl=${res.follow}&birthday=${birthday}&gioitinh=${gender}&link=${res.link}&love=${love}&hometown=${hometown}`)).pipe(fs.createWriteStream(__dirname + `/cache/${senderID}.jpg`)).on('close', () => callback());

	} catch (e) {
		console.log(e)
	}
}
//https://s.hanakuhshsjsjshejsna.repl.co/fbcover/v1?uid=${uid}&name=${res.name}&location=${location}&fl=${res.follow}&birthday=${birthday}&gioitinh=${gender}&link=${res.link}&love=${love}&hometown=${hometown}
