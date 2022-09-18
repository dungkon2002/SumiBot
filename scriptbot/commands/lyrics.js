export default {
	name: "lyrics",
  version: "1.0.1", 
	hasPermssion: 0,
	credits: "Dũngkon",
	description: "lyrics", 
	commandCategory: "Lyrics",
	usages: "Tìm lời bài hát",
	cooldowns: 5,
    dependencies: {
    	"lyrics-finder": ""
    }
};
import lyrics from "lyrics-finder"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))
export async function run({ api, event, args })  {
    var lyrics = await lyrics(args.join(" ")) || "Đéo thấy";
    console.log(lyrics);
api.sendMessage(`${lyrics}`, event.threadID, event.messageID);
}