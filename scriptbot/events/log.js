export default {
    name: "log",
    version: "1.0.0",
    credits: "CatalizCS",
    description: "Ghi lại thông báo các hoạt đông của bot!",
    data: {
        enable: true
    }
};

import fs from "fs-extra";

import logger from "../../utils/log.js";
export async function run({ api, event, ThreadsAll, global, client, ThreadSettings, UserThread }) {
    try {
        if (this.default.data.enable != true) return;
        var formReport = "=== Bot Notification ===" +
            "\n\n» Thread mang ID: " + event.threadID +
            "\n» Hành động: {task}" +
            "\n» Hành động được tạo bởi user: https://www.facebook.com/profile.php?id=" + event.author +
            "\n» " + Date.now() + " «",
            task = "";
        switch (event.logMessageType) {
            case "log:subscribe": {
                if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "Người dùng đã thêm bot vào một nhóm mới!";
                break;
            }
            case "log:unsubscribe": {
                if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
                    task = "Người dùng đã kick bot ra khỏi nhóm!"
                    ThreadsAll.splice(ThreadsAll.findIndex(item => item.threadID == event.threadID), 1)
                    if (ThreadSettings.some(item => item.id == event.threadID)) {
                        ThreadSettings.splice(ThreadSettings.findIndex(item => item.id == event.threadID), 1)
                        fs.writeFileSync(client.dirMain + "/data/ThreadSettings.json", JSON.stringify(ThreadSettings, null, "\t"));
                    }
                    if (UserThread.some(item => item.threadID == event.threadID)) {
                        UserThread.splice(UserThread.findIndex(item => item.threadID == event.threadID), 1)
                        fs.writeFileSync(client.dirMain + "/data/UserThread.json", JSON.stringify(UserThread, null, "\t"));
                    }
                    fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
                }
                break;
            }
            default:
                break;
        }
        if (task.length == 0) return;
        formReport = formReport
            .replace(/\{task}/g, task);

        return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
            if (error) return logger(formReport, "[ Logging Event ]");
        });
    } catch (e) { console.log(e) }
}
