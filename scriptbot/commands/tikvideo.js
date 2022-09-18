export default {
    name: "tikvideo", // Tên lệnh, được sử dụng trong việc gọi lệnh
    version: "1.0.0", // phiên bản của module này
    hasPermssion: 0, // Quyền hạn sử dụng, với 0 là toàn bộ thành viên, 1 là quản trị viên trở lên, 2 là admin/owner
    credits: "Dũngkon", // Công nhận module sở hữu là ai
    description: "tai video tik tok no logo", // Thông tin chi tiết về lệnh
    usages: [
    'tiktok: link tiktok'
    ], // Cách sử dụng lệnh
    cooldowns: 5, // Thời gian một người có thể lặp lại lệnh
};
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
import request from 'request';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run ({ api, event, args }) {
  const { threadID, messageID } = event;
  if (event.type == "message_reply") {
    try {
      let results = {};
      let key = await axios.get(
        `http://api.leanhtruong.net/api-no-key/tiktok?url=${event.messageReply.args[0]}`,
      );
      console.log(key)
      key = JSON.parse(JSON.stringify(key.data, null, 2));
      if (key.error != 0)
        return api.sendMessage(
          "Đã có lỗi sảy ra ;-;",
          event.threadID,
        );
  
        results = {
          author: key.author_video,
          description: key.title,
          video: {
            with_watermark: key.data_watermark[0].url,
            no_watermark: key.data_nowatermark[0].url,
          },
          Mname: key.data_music.title,
          music: key.data_music.url,
        };
        
      var path = __dirname + `/cache/tiktok.mp4`;
      const { data: stream } = await axios.get(results.video.no_watermark, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(path, Buffer.from(stream, "utf-8"));
      return api.sendMessage(
        {
          body: `Tên : ${results.author} | Nội Dung : ${results.description || "Không Có Nội Dung"} | Nhạc: ${results.Mname}`,
          attachment: createReadStream(path),
        },
        threadID,
        () => fs.unlinkSync(path),
        messageID,
      );
    } catch (e) {
      console.log(e);
      return api.sendMessage(
        "Đã có lỗi sảy ra ;-;",
        event.threadID,
      );
    }
  }
  if (args.length == 0)
    return api.sendMessage(
      "vui lòng nhập link , kiểu : '/tiktok https://www.tiktok.com/@choul2002/video/6996459846480465179' hoặc lấy nhạc thông qua : '/tiktok music https://www.tiktok.com/@choul2002/video/6996459846480465179'",
      event.threadID,
      event.messageID,
    );
  switch (args[0]) {
    case "music": {
      try {
        let results = {};
        if (args.length == 0)
          return api.sendMessage(
            "vui lòng nhập link , kiểu : '/tiktok https://www.tiktok.com/@choul2002/video/6996459846480465179'",
            event.threadID,
            event.messageID,
          );
        let key = await axios.get(
          `http://api.leanhtruong.net/api-no-key/tiktok?url=${args[1]}`,
        );
        key = JSON.parse(JSON.stringify(key.data, null, 2));
        if (key.error != 0)
          return api.sendMessage(
            "Đã có lỗi sảy ra ;-;",
            event.threadID,
          );
       
      results = {
        author: key.author_video,
        description: key.title,
        video: {
          with_watermark: key.data_watermark[0].url,
          no_watermark: key.data_nowatermark[0].url,
        },
        Mname: key.data_music.title,
        music: key.data_music.url,
      };

        var path = __dirname + `/cache/tiktok.mp3`;
        const { data: stream } = await axios.get(results.music, {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(path, Buffer.from(stream, "utf-8"));
        return api.sendMessage(
          {
            body: `Tên : ${results.author} | Nội Dung : ${results.description || "Không Có Nội Dung"} | Nhạc: ${results.Mname}`,
            attachment: fs.createReadStream(path),
          },
          threadID,
          () => fs.unlinkSync(path),
          messageID,
        );
      } catch (e) {
        console.log(e);
        return api.sendMessage(
          "Đã có lỗi sảy ra ;-;",
          event.threadID,
        );
      }
    } break;
    default:
      try {
        let results = {};
        let key = await axios.get(
          `http://api.leanhtruong.net/api-no-key/tiktok?url=${args[0]}`,
        );
        key = JSON.parse(JSON.stringify(key.data, null, 2));
        
        if (key.error != 0)
          return api.sendMessage(
            "Đã có lỗi sảy ra ;-;",
            event.threadID,
          );
       
         
      results = {
        author: key.author_video,
        description: key.title,
        video: {
          with_watermark: key.data_watermark[0].url,
          no_watermark: key.data_nowatermark[0].url,
        },
        Mname: key.data_music.title,
        music: key.data_music.url,
      };

        var path = __dirname + `/cache/tiktok.mp4`;
        const { data: stream } = await axios.get(results.video.no_watermark, {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(path, Buffer.from(stream, "utf-8"));
        return api.sendMessage(
          {
            body: `Tên : ${results.author} | Nội Dung : ${results.description || "Không Có Nội Dung"} | Tên Nhạc: ${results.Mname}`,
            attachment: fs.createReadStream(path),
          },
          threadID,
          () => fs.unlinkSync(path),
          messageID,
        );
      } catch (e) {
        return api.sendMessage(
          "Đã có lỗi sảy ra ;-;",
          event.threadID,
        );
      }
  }
};