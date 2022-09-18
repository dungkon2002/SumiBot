export default {
	name: "photo",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Xóa nền ảnh",
	shortDescription: "Xóa nền ảnh",
	usages: [
	    'photo <reply>: xóa nền ảnh bằng <reply>'
    ],
	cooldowns: 5
};

import FormData from "form-data";
import axios from "axios";
import fs from "fs-extra"
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, event, args, utils, client }) {
	try {
if (event.type !== "message_reply") return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
if (event.messageReply.attachments[0].type != "photo" ) return api.sendMessage("Đây không phải là image", event.threadID, event.messageID);
                    
const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
const KeyApi = JSON.parse(fs.readFileSync(__dirname + "/cache/keyremove.json", { encoding: "utf-8" }));
const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
await utils.downloadFile(content, inputPath)
const formData = new FormData();
formData.append('size', 'auto');
formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
    ...formData.getHeaders(),
    'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
    },
    encoding: null
})
.then((response) => {
    if(response.status != 200) return console.error('Error:', response.status, response.statusText);
    fs.writeFileSync(inputPath, response.data);
	return api.sendMessage({ attachment: fs.createReadStream(inputPath)}, event.threadID, () => fs.unlinkSync(inputPath));
})
.catch((error) => {
    return console.error('Request failed:', error);
});
} catch (e) {
	console.log(e)
	return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}