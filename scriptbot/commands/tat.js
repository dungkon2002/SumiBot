import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
    name: "tat",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "tát người bạn tag",
    commandCategory: "general",
    usages: "tát [tag người bạn cần tát]",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

export async function run({ api, event, args, utils, UsersAll, client, Users }) {
    const { threadID, messageID, senderID } = event;
    var out = (msg) => api.sendMessage(msg, threadID, messageID);
    if (!args.join(" ")) return out("Bạn chưa nhập tin nhắn");
    const nameUser = UsersAll.find(item => item.id == event.senderID).name
    const { data } = await axios.get('https://randomlinkapi-2.dungkon.repl.co/slap')
    var mention = Object.keys(event.mentions)[0];
    let getURL = data.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    const path = ps.resolve(__dirname, 'cache', `slap.${ext}`);
    await utils.downloadFile(getURL, path)
    let tag = event.mentions[mention].replace("@", "");
    return api.sendMessage({
        body: ` ${nameUser} Vừa tát méo mồm ${tag} 👌`,
        mentions: [
            {
                tag: nameUser,
                id: senderID
            },
            {
                tag: tag,
                id: Object.keys(event.mentions)[0]
            }
        ],
        attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
};
