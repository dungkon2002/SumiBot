export default {
  name: "fb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Dũngkon",
  description: "Tải video vad âm thanh fb",
  commandCategory: "Tiện ích",
  usages: "fbget audio/video [link]",
  cooldowns: 0
};
import FormData from "form-data";
import axios from "axios";
import fs from "fs-extra"
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, serAll, UsersAll, event, args, Currencies }) {
  try {
    if (args[0] == 'audio') {
      api.sendMessage(`Đang Xử Lý Yêu Cầu!\n⊱ ⋅ ────SUMICHAN──── ⋅ ⊰`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);
      const path = __dirname + `/cache/hi2.mp3`;
      let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getPorn, "utf-8"));
      return api.sendMessage({
        body: `Tải Thành Công\n⊱ ⋅ ────SUMICHAN──── ⋅ ⊰`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    };
  } catch { return api.sendMessage(`Không Thể Load Mp3`, event.threadID, event.messageID) }
  try {
    if (args[0] == 'video') {
      api.sendMessage(`Đang Xử Lý Yêu Cầu!\n⊱ ⋅ ────SUMICHAN──── ⋅ ⊰`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);
      const path1 = __dirname + `/cache/hi.mp4`;
      let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path1, Buffer.from(getPorn, "utf-8"));
      return api.sendMessage({
        body: `Tải Thành Công\n⊱ ⋅ ────SUMICHAN──── ⋅ ⊰`,
        attachment: fs.createReadStream(path1)
      }, event.threadID, () => fs.unlinkSync(path1), event.messageID);
    };
  } catch { return api.sendMessage(`Không Thể Load Video`, event.threadID, event.messageID) }
}
