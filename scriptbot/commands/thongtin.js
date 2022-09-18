export default {
    name: "thongtin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "lấy thông tin người dùng",
    commandCategory: "người dùng",
    usages: "",
    cooldowns: 5
};
import fs from "fs-extra"
import request from "request"
import axios from "axios"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, ThreadsAll, args, UsersAll, utils }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;
    let targetID = senderID;
    if (type == 'message_reply') {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    }
    var data = await api.getUserInfoV2(targetID);
    var name = data.name
    //name = 'No name'
    //(e, i) => if(e) name = 'noname'

    var username = data.username
    var follow = data.follow
    var uid = targetID
    var about = data.about
    var gender = data.gender == 'male' ? "Nam" : res.data.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = data.birthday
    var love = data.relationship_status
    var rela = data.love.name
    var id = data.love.id
    var location = data.location.name
    var place = data.location.id
    var hometown = data.hometown.name
    var home = data.hometown.id
    var url_profile = data.link
    var web = data.website
    var quotes = data.quotes
    var link = data.imgavt

    var callback = () => api.sendMessage({ body: `👤 Tên: ${name}\n🍁 UserName: ${username}\n🔎 UID: ${uid}\n👀 Follow: ${follow}\n👭 Giới tính: ${gender}\n🎂 Sinh Nhật: ${birthday}\n💌 Mối quan hệ: ${love}\n💞 Love name: ${rela}\n💓 UID love: ${id}\n🏡 Sống tại: ${location}\n🌆 ID Place: ${home}\n🌏 Đến từ: ${hometown}\n🏙️ ID Hometown: ${home}\n📌 URL cá nhân: ${url_profile}`, attachment: fs.createReadStream(__dirname + "/cache/1.png") }, threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
    return request(encodeURI(`https://graph.facebook.com/${targetID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close',
        () => callback());

}
