export default  {
    name: "sim",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Chat cùng con simsimi dễ thương nhất",
    shortDescription: "Chat cùng con simsimi dễ thương nhất",
    usages: "[args]",
    cooldowns: 5
}
import axios from "axios"

async function simsimi(text) {
    try {
        var { data } = await axios.get(encodeURI(`https://api.simsimi.net/v2/?text=${text}&lc=vn&key=API-1234-abcd-1234-abcd`));
        return { error: !1, data: data }
        //console.log();
    } catch (p) {
        return { error: !0, data: {} }
    }
    
}
export async  function event({api, event, args, utils, UsersAll, client, Users }) {
    const { threadID, messageID, senderID, body} = event;
    if (!client.simmi) client.simmi = new Map();
    if (!client.simmi.has(threadID)) return;
   
    if (client.simmi.has(threadID)) {
        if (senderID == api.getCurrentUserID() || "" == body || messageID == client.simmi.get(threadID)) return;
        var { data, error } = await simsimi(body);
        return !0 == error ? void 0 : !1 == data.success ? api.sendMessage(data.error, event.threadID) : api.sendMessage(data.success, event.threadID);
    }
}
export async  function run({api, event, args, utils, UsersAll, client, Users }) {
  if (!client.simmi) client.simmi = new Map();
    const { threadID, messageID} = event;
    if (0 == args.length) return api.sendMessage(`Bạn chưa nhập tin nhắn`, event.threadID);;
    switch (args[0]) {
        case "on":
            return client.simmi.has(threadID) ? api.sendMessage(`Bạn chưa bật sim`, event.threadID) : client.simmi.set(threadID, messageID), api.sendMessage(`Bật sim thành công`, event.threadID);
        case "off":
            return client.simmi.has(threadID) ? (client.simmi.delete(threadID), api.sendMessage(`Tắt sim thành công`, event.threadID))  : api.sendMessage(`Bạn chưa bật sim`, event.threadID);
        default:
            var { data, error } = await simsimi(args.join(" "));
            console.log(await simsimi(args.join(" ")))
            console.log(data)
            return !0 == data ? void 0 : !1 == data.success ? api.sendMessage(data.error, event.threadID) : api.sendMessage(data.success, event.threadID);
    }
};