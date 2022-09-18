export default {
    name: "fbvideo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "tải video từ fb",
    commandCategory: "Tiện ích",
    usages: "[link]",
    cooldowns: 5
};
  import axios from "axios";
  import fs from "fs-extra"
  import ps, { dirname } from "path";
  import { fileURLToPath } from 'url';
  const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, global, client, utils, ThreadsAll, UsersAll, ThreadSettings, event, args, UserThread }) {
if (!args[0]){ return api.sendMessage("[ SUMIBOT ]\nBạn phải nhập url video facebook !!!", event.threadID, event.messageID);}
const link = args.join(" ");
let mystr = `${link}`;
let split_str = mystr.replace(/[^0-9]/g, '')
try {
const res = await axios.get(`http://sumibot-api.herokuapp.com/fbdown?URLz=${split_str}`);
const data = res.data
const link = data.url
console.log(link)
    path1 = __dirname+`/cache/${event.senderID}.mp4`  
    const getms = (await axios.get(link,{responseType: "arraybuffer"})).data; 
      fs.writeFileSync(path1, Buffer.from(getms, "utf-8"));
      
    if (fs.statSync(__dirname + `/cache/${event.senderID}.mp4`).size > 26000000) return api.sendMessage('[ SUMIBOT ]\nKhông thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${event.senderID}.mp4`), event.messageID);
    else return api.sendMessage({body : "" , attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}.mp4`)}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}.mp4`), event.messageID)
} catch {
            return api.sendMessage('[ SUMIBOT ]\nKhông thể xử lý yêu cầu của bạn!', event.threadID, event.messageID);
        }
}