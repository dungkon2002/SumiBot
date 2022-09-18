export default {
    name: "ảnh",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "DũngKon",
    description: "Thư viện Ảnh ",
    shortDescription: "Thư viện Ảnh",
    usages: [
        'ảnh: xem ảnh theo stt'
    ],
    cooldowns: 5
};
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
import request from 'request';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function handleReply({ api, event, handleReply }) {
    const { threadID, messageID, body } = event
    const input = body.trim();
    var b;
    switch (input) {
        case "1":
            b = "girl";
            break;
        case "2":
            b = "trai";
            break;
        case "3":
            b = "nobra";
            break;
        case "4":
            b = "duu";
            break;
        case "5":
            b = "mong";
            break;
        case "6":
            b = "loli";
            break;
        case "7":
            b = "nude";
            break;
        case "8":
            b = "beoo";
            break;
        default:
            break;
    }
    const res = axios.get(`https://botviet.me/api/${b}`).then(res => {
        var callback = function () {
            api.sendMessage({
                attachment: fs.createReadStream(__dirname + '/cache/anh.jpg')
            }, threadID, () => fs.unlinkSync(__dirname + '/cache/anh.jpg'), messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + '/cache/anh.jpg')).on("close", callback)
    })
    return api.unsendMessage(handleReply.messageID, err => (err) ? api.sendMessage(getText('error'), threadID, messageID) : '');
};

export async function run({ event, api, args, client }) {
    const { threadID, messageID, body } = event
    var msg = "» Danh sách các ảnh hiện có\n\n» 1.Gái\n» 2.Trai\n» 3.Nobra\n» 4.Dú\n» 5.Mông\n» 6.Loli\n» 7.Nude\n» 8.Beo\n\n» Hãy reply tin nhắn này kèm stt ảnh bạn muốn xem."
    api.sendMessage(msg, event.threadID, ((api, args) => {
        client.handleReply.push({
            name: this.default.name,
            messageID: args.messageID,
            author: event.senderID,
        })
    }), event.messageID)
}
