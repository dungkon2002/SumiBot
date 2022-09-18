export default {
    name: "threadUpdate",
    version: "1.0.0",
    credits: "NDKhánh",
    description: "Listen events",
};

import fs from "fs-extra";
import axios from "axios";
export async function run({ api, event, ThreadsAll, client, UsersAll }) {
    const { threadID, logMessageType, logMessageData } = event;
    if (event.type == "change_thread_image") {
        try {
            const DataThread = ThreadsAll.find(item => item.threadID == event.threadID)
            DataThread.imageSrc = event.image.url
            let getUser = UsersAll.find(item => item.id == event.author)
            const geturlus = _get(event.image.url);
            const linkpathname = geturlus.uri.pathname;
            const ext = linkpathname.slice(linkpathname.lastIndexOf("."));
            const { data: stream } = await axios.get(event.image.url, { responseType: 'arraybuffer' });
            fs.writeFileSync(__dirname + `/cache/avatar${ext}`, Buffer.from(stream, 'utf-8'));
            api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã thay đổi ảnh nhóm`, mentions: [{ tag: getUser.name, id: event.author }], attachment: fs.createReadStream(__dirname + `/cache/avatar${ext}`) }, event.threadID, async (error, info) => {
                fs.unlinkSync(__dirname + `/cache/avatar${ext}`)
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
            return fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
        } catch (e) {
            let getUser = UsersAll.find(item => item.id == event.author)
            const DataThread = ThreadsAll.find(item => item.threadID == event.threadID)
            DataThread.imageSrc = ""
            api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã gỡ ảnh nhóm`, mentions: [{ tag: getUser.name, id: event.author }] }, event.threadID, async (error, info) => {
                await new Promise(resolve => setTimeout(resolve, 10000));
                return api.unsendMessage(info.messageID);
            });
            return fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
        }

    } else {
        try {
            const threadInfo = ThreadsAll.find(item => item.threadID == event.threadID)
            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT == "add_admin") {
                        threadInfo.adminIDs.push({ id: logMessageData.TARGET_ID })
                        let getUser = UsersAll.find(item => item.id == logMessageData.TARGET_ID);
                        api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Đã cập nhật người dùng: ${getUser.name}\n» Trở thành quản trị viên nhóm`, mentions: [{ tag: getUser.name, id: logMessageData.TARGET_ID }] }, threadID, async (error, info) => {
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            return api.unsendMessage(info.messageID);
                        });
                    }
                    else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                        threadInfo.adminIDs = threadInfo.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                        let getUser = UsersAll.find(item => item.id == logMessageData.TARGET_ID)
                        api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Đã cập nhật người dùng: ${getUser.name}\n» Trở thành thành viên`, mentions: [{ tag: getUser.name, id: logMessageData.TARGET_ID }] }, threadID, async (error, info) => {
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            return api.unsendMessage(info.messageID);
                        });
                    }
                    break;
                }

                case "log:user-nickname": {
                    try {
                        if (threadInfo.nicknames == undefined) return
                        threadInfo.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                        let getUser = UsersAll.find(item => item.id == logMessageData.participant_id)
                        api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Đã cập nhật biệt danh của người dùng: ${getUser.name}\n» Thành: ${(logMessageData.nickname.length == 0) ? "tên gốc" : logMessageData.nickname}`, mentions: [{ tag: getUser.name, id: logMessageData.participant_id }] }, threadID, async (error, info) => {
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            return api.unsendMessage(info.messageID);
                        });
                    } catch { return }
                    break;
                }

                case "log:thread-name": {
                    threadInfo.threadName = event.logMessageData.name || "Không tên";
                    let getUser = UsersAll.find(item => item.id == event.author)
                    return api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã cập nhật tên nhóm thành: ${threadInfo.threadName}`, mentions: [{ tag: getUser.name, id: event.author }] }, threadID, async (error, info) => {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        return api.unsendMessage(info.messageID);
                    });
                    break;
                }
                case "log:thread-icon": {
                    threadInfo.emoji = event.logMessageData.thread_icon;
                    let getUser = UsersAll.find(item => item.id == event.author)
                    api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã cập Emoij nhóm thành: [ ${threadInfo.emoji} ]`, mentions: [{ tag: getUser.name, id: event.author }] }, threadID, async (error, info) => {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        return api.unsendMessage(info.messageID);
                    });
                    break;
                }
                case "log:thread-color": {
                    threadInfo.emoji = event.logMessageData.theme_emoji;
                    threadInfo.color = event.logMessageData.theme_color
                    let getUser = UsersAll.find(item => item.id == event.author)
                    api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã thay đổi màu sắc chủ đề:\n» Chủ đề : ${event.logMessageData.accessibility_label}\n»  Emoji : ${event.logMessageData.theme_emoji}`, mentions: [{ tag: getUser.name, id: event.author }] }, threadID, async (error, info) => {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        return api.unsendMessage(info.messageID);
                    });
                    break;
                }
                case "log:thread-approval-mode": {
                    if (logMessageData.APPROVAL_MODE == 0) var MODE = false
                    else var MODE = true
                    threadInfo.approvalMode = MODE
                    let APPROVAL = ((threadInfo.approvalMode == true) ? "Bật" : "Tắt")
                    let getUser = UsersAll.find(item => item.id == event.author)
                    api.sendMessage({ body: `[ CẬP NHẬP NHÓM ]\n» Người dùng: ${getUser.name}\n» Đã ${APPROVAL} tính năng phê duyệt nhóm!`, mentions: [{ tag: getUser.name, id: event.author }] }, threadID, async (error, info) => {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        return api.unsendMessage(info.messageID);
                    });
                    break;
                }
                case "log:thread-call": {
                    if (logMessageData.event == 'group_call_started') {
                        const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
                        let listUserID, arrayUID = [];
                        for (const data of ThreadsData.busyData) arrayUID.push(data.id)
                        const botID = api.getCurrentUserID();
                        listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
                        listUserID = listUserID.filter(item => !arrayUID.includes(item));
                        var body = event.logMessageBody, mentions = [], index = 0;
                        for (const idUser of listUserID) {
                            body = body;
                            mentions.push({ id: idUser, tag: body, fromIndex: index - 1 });
                            index -= 1;
                        }

                        return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
                    }
                    break;
                }
            }
            return fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
        } catch (e) { console.log(e) };

    }
}
