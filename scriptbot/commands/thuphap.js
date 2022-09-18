export default {
    name: "thuphap",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Tạo bìa chữ thư pháp",
    shortDescription: "Tạo bìa chữ thư pháp",
    usages: [
        'thuphap: <mã số> | <chữ> |',
    ],
    cooldowns: 5
};
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, args , utils}) {
        const content = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g,  "|").split("|");
        let id = content[0];
        const color = content[1];
        const tex1 = content[2];
        const tex2  = content[3];
        const tex3 = content[4];
        let dong;
        if (!tex2 && !tex3) dong = 1;
        else if (!tex2 || !tex3) dong = 2;
        else dong = 3;  
        if (!isNaN(parseInt(content[0]))) {
          id = parseInt(content[0]);
          if (id < 0) id *= -1;
          if (id > 5) return api.sendMessage("Vui lòng chọn id từ 0->5", event.threadID, event.messageID);
        }
        else {
          id = Math.floor(Math.random()*6);
        }
       api.sendMessage(`Đang khởi tạo hình ảnh\n⊱ ⋅ ────────────── ⋅ ⊰\n» Mã số: ${id}\n» Text1: ${tex1 || "thư pháp"}\n» Text2: ${tex2 || ""}\n» Text3: ${tex3 || ""}\n» Dòng: ${dong}\n» Màu: ${color || "black"}`, event.threadID, (err, info) => setTimeout(() => {
            api.unsendMessage(info.messageID)
        }, 4000));
        const path = __dirname + "/cache/thuphap.png";
        const getImg = encodeURI(`https://sumibot-api.herokuapp.com/thuphap?&api_key=NDK_API_SumiChan&id=${id}&text1=${tex1 || "thư pháp"}&text2=${tex2 || ""}&text3=${tex3 || ""}&dong=${dong}&color=${color || "black"}`)
                await utils.downloadFile(getImg, path)
              return api.sendMessage({body: ``,
                    attachment: 
                    fs.createReadStream(path)
                }, event.threadID, () => fs.unlinkSync(path), event.messageID);
            }