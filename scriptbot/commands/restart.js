export default {
    name: "restart",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Dũngkon",
    description: "Khởi động lại Bot",
    shortDescription: "Khởi động lại Bot",
    usages: [
        'restart: Khởi động lại bot'
    ],
    cooldowns: 5
};
import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, event}) {
    try {
        return api.sendMessage("Đang khởi động lại Bot SumiChan", event.threadID, () => process.exit(0), event.messageID);
} catch (e) {
    return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
}
}