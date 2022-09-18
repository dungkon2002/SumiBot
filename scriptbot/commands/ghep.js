export default {
    name: "ghep",
    version: "1.0.1", 
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Ghép đôi",
    commandCategory: "Giải trí", 
    usages: "ghep", 
    cooldowns: 20,
    dependencies: [] 
  };
  import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, serAll, UsersAll, event, args, Currencies }) {
      try {
         var data = global.data.user[parseInt(random)]
          var money = data.money
          if(money >2)
          return api.sendMessage("⚡️Nghèo quá nên tôi không biết ghép cho ai nhé!") 
          else {
          var tile = Math.floor(Math.random() * 101);
          var namee = (await Users.getData(event.senderID)).name
          let loz = await api.getThreadInfo(event.threadID);
          var emoji = loz.participantIDs;
          var id = emoji[Math.floor(Math.random() * emoji.length)];
          var name = (await Users.getData(id)).name
          var arraytag = [];
                  arraytag.push({id: event.senderID, tag: namee});
                  arraytag.push({id: id, tag: name});
          Currencies.setData(event.senderID, options = {money: money - 50})
          let Avatar = (await axios.get( `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data; 
              fs.writeFileSync( __dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8") );
          let Avatar2 = (await axios.get( `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data;
              fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8") );
          var imglove = [];
                imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
                imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
          var msg = {body: `⚡️Ghép đôi thành công!\n⚡️Tỉ lệ hợp đôi: ${tile}%\n`+namee+" "+"💓"+" "+name, mentions: arraytag, attachment: imglove}
          return api.sendMessage(msg, event.threadID, event.messageID)
        }
  } catch (e) {
      console.log(e)
  }
  }