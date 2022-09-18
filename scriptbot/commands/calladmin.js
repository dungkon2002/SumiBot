export default {
    name: "callad",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "NDKhánh",
    description: "Gọi ADMIN BOT",
    shortDescription: "Gọi ADMIN BOT",
    usages: [
        'callad : NỘI DUNG'
    ],
    cooldowns: 5
};

import moment from "moment-timezone";
export async function handleReaction({
    api,
    handleReaction
}) {

    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss D/MM/YYYY");
    return api.sendMessage(`Cuộc trò chuyện với ADMINBOT đã kết thúc✅\nTime: ${gio}`, handleReaction.id, (err, data) =>
        setTimeout(() => {
            api.unsendMessage(data.messageID)
        }, 10000));
}


export async function handleReply({
    api,
    event,
    Users,
    handleReply,
    client,
    global,
    UsersAll
}) {
    var name = UsersAll.find(item => item.id == event.senderID).name;

    switch (handleReply.type) {

        case "reply": {
            var soad = global.config.ADMINBOT.length;

            var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss D/MM/YYYY");
            api.unsendMessage(handleReply.messageID)
            api.sendMessage(
                `Đã gửi báo cáo của bạn đến ${soad} admin bot ✅\nTime: ${gio}`,
                event.threadID,
                () => {
                    var idad = global.config.ADMINBOT;
                    for (const arrayiadad of idad) {
                        api.sendMessage({
                            body: "📄Phản hồi từ " + name + `:\n\nUID: ${event.senderID}` + event.body + '\n\nReply để trả lời Hoặc Reaction để kết thúc',
                            mentions: [{
                                id: event.senderID,
                                tag: name
                            }]
                        }, arrayiadad, (e, data) => {
                            client.handleReply.push({
                                name: this.default.name,
                                messageID: data.messageID,
                                messID: event.messageID,
                                author: event.senderID,
                                id: event.threadID,
                                type: "calladmin"
                            })
                            client.handleReaction.push({
                                name: this.default.name,
                                messageID: data.messageID,
                                messID: event.messageID,
                                author: event.senderID,
                                id: event.threadID
                            })
                        })
                    }
                }
            );
            break;
        }

        case "calladmin": {
            api.unsendMessage(handleReply.messageID)
            api.sendMessage({
                body: `📌Phản hồi từ admin ${name} đến bạn:\n⊱ ⋅ ────────────── ⋅ ⊰\n\n${event.body}\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n»💬Phản hồi tin nhắn này để tiếp tục gửi báo cáo về admin`,
                mentions: [{
                    tag: name,
                    id: event.senderID
                }]
            }, handleReply.id, (e, data) => client.handleReply.push({
                name: this.default.name,
                author: event.senderID,
                messageID: data.messageID,
                type: "reply"
            }), handleReply.messID);
            break;
        }

    }


}

export async function run({
    api,
    event,
    args,
    client,
    global,
    UsersAll,
    ThreadsAll
}) {
    if (!args[0])
        return api.sendMessage(
            "Bạn chưa nhập nội dung cần báo cáo",
            event.threadID,
            event.messageID
        );
    var data = UsersAll.find(item => item.id == event.senderID);
    var name = data.name;
    var idbox = event.threadID;
    var datathread = ThreadsAll.find(item => item.threadID == event.threadID);
    var namethread = datathread.threadName;

    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss D/MM/YYYY");
    var soad = global.config.ADMINBOT.length;

    api.sendMessage(
        `Đã gửi báo cáo của bạn đến ${soad} admin bot ✅\nTime: ${gio}`,
        event.threadID,
        () => {
            var idad = global.config.ADMINBOT;
            for (const arrayiadad of idad) {
                api.sendMessage(
                    `👤Báo cáo từ: ${name}\nUID: ${event.senderID}\n\n👥Box: ${namethread}\nID box: ${idbox}\n⊱ ⋅ ────────────── ⋅ ⊰\n⚠️Lỗi: ${args.join(
                        " "
                    )}\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\nTime: ${gio}`,
                    arrayiadad,
                    (error, data) =>
                        client.handleReply.push({
                            name: this.default.name,
                            messageID: data.messageID,
                            author: event.senderID,
                            messID: event.messageID,
                            id: idbox,
                            type: "calladmin"
                        })
                );
            }
        }
    );
}
