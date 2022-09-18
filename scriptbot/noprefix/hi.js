import moment from "moment-timezone";
const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
export default {
  name: "hi",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Dũngkon",
  description: "hi",
  shortDescription: "hi",
  usages: [''],
  cooldowns: 5
};
export async function noprefix({ api, event, UsersAll, global }) {
  const tag = UsersAll.find(item => item.id == event.senderID).name
  var { threadID, messageID, senderID } = event;
  let output = "Xin chào ";
  let varinput = ["Hi", "hi", "Chào", "chào", "hello", "Hello", "Hê lô", "hê lô"];
  let data = [
    "526214684778630",
    "526220108111421",
    "526220308111401",
    "526220484778050",
    "526220691444696",
    "526220814778017",
    "526220978111334",
    "526221104777988",
    "526221318111300",
    "526221564777942",
    "526221711444594",
    "526221971444568"
  ];
  let sticker = data[Math.floor(Math.random() * data.length)];
  let data2 = [
    "tốt lành =)",
    "vui vẻ 😄",
    "hạnh phúc ❤",
    "yêu đời 😘",
    "thoải mái",
    "happy",
    "sảng khoái"
  ];
  let text = data2[Math.floor(Math.random() * data2.length)]
  for (const input of varinput) {
    if (event.body == input) {
      return api.sendMessage({
        body: output + tag + `\nChúc bạn có một buổi ${(hours <= 10 ? "sáng" : hours > 10 && hours <= 12 ? "trưa" : hours > 12 && hours <= 18 ? "chiều" : "tối")} ${text}\n» 𝑺𝒖𝒎𝒊𝑪𝒉𝒂𝒏 «`,
        mentions: [{
          tag: tag,
          id: senderID
        }], sticker: sticker
      }, threadID, messageID);
    }
  }
}
export async function run() { }
