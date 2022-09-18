import logger from "../../utils/log.js";
import fs from "fs-extra";

export default function({
    api,
    client,
    ThreadsAll,
    UsersAll,
    UserThread
}) {
    return async function({
        event
    }) {

        try {
            if (!ThreadsAll.some(item => item.threadID == event.threadID) && !UserThread.some(item => item.threadID == event.threadID)) {
                try {
                    let ExpData = [];
                    const Data = await api.getThreadInfo(event.threadID);
                    if (Data.participantIDs.length < 3) {
                        UserThread.push({
                            threadID: Data.threadID
                        });
                        logger(`Nhóm mới : [ ${event.threadID} ] » ${Data.threadName}`, "[  THREAD  ]");
                        fs.writeFileSync(client.dirMain + "/data/UserThread.json", JSON.stringify(UserThread, null, "\t"));
                    } else {
                        UserThread.push({
                            threadID: Data.threadID
                        })
                        for (let data of Data.participantIDs) ExpData.push({
                            id: data,
                            exp: 0,
                            ExpToday: 0
                        })
                        ThreadsAll.push({
                            banned: false,
                            settings: {},
                            reasonban: "",
                            timebanned: "",
                            ADMINBOT: false,
                            QTVBOX: false,
                            commandBanned: [],
                            ExpYesterday: 0,
                            ExpToday: 0,
                            ExpGrpup: ExpData,
                            ExpWeek: [],
                            busyData: [],
                            threadID: Data.threadID,
                            threadName: Data.threadName,
                            participantIDs: Data.participantIDs,
                            userInfo: Data.userInfo,
                            unreadCount: Data.unreadCount,
                            messageCount: Data.messageCount,
                            timestamp: Data.timestamp,
                            muteUntil: Data.muteUntil,
                            isGroup: Data.isGroup,
                            isSubscribed: Data.isSubscribed,
                            isArchived: Data.isArchived,
                            folder: Data.folder,
                            cannotReplyReason: Data.cannotReplyReason,
                            eventReminders: Data.eventReminders,
                            emoji: Data.emoji,
                            color: Data.color,
                            nicknames: Data.nicknames,
                            adminIDs: Data.adminIDs,
                            approvalMode: Data.approvalMode,
                            approvalQueue: Data.approvalQueue,
                            reactionsMuteMode: Data.reactionsMuteMode,
                            mentionsMuteMode: Data.mentionsMuteMode,
                            relatedPageThread: Data.relatedPageThread,
                            name: Data.name,
                            snippet: Data.snippet,
                            snippetSender: Data.snippetSender,
                            snippetAttachments: Data.snippetAttachments,
                            serverTimestamp: Data.serverTimestamp,
                            imageSrc: Data.imageSrc,
                            isCanonicalUser: Data.isCanonicalUser,
                            isCanonical: Data.isCanonical,
                            recipientsLoadable: Data.recipientsLoadable,
                            hasEmailParticipant: Data.hasEmailParticipant,
                            readOnly: Data.readOnly,
                            canReply: Data.canReply,
                            lastMessageTimestamp: Data.lastMessageTimestamp,
                            lastMessageType: Data.lastMessageType,
                            lastReadTimestamp: Data.lastReadTimestamp,
                            threadType: Data.threadType
                        });

                        logger(`Nhóm mới : [ ${event.threadID} ] » ${Data.threadName}`, "[  THREAD  ]");
                        fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
                        fs.writeFileSync(client.dirMain + "/data/UserThread.json", JSON.stringify(UserThread, null, "\t"));
                    }
                    for (let UserInfo of Data.userInfo) {
                        if (!UsersAll.some(item => item.id == UserInfo.id)) {
                            try {
                                UsersAll.push({
                                    money: 0,
                                    exp: 0,
                                    banned: false,
                                    reasonban: "",
                                    timebanned: "",
                                    commandBanned: [],
                                    id: UserInfo.id,
                                    name: UserInfo.name,
                                    firstName: UserInfo.firstName,
                                    vanity: UserInfo.vanity,
                                    thumbSrc: UserInfo.thumbSrc,
                                    profileUrl: UserInfo.profileUrl,
                                    gender: UserInfo.gender,
                                    type: UserInfo.type,
                                    isFriend: UserInfo.isFriend,
                                    isBirthday: UserInfo.isBirthday,
                                    Data: {}
                                });
                            } catch {
                                logger(`Không thể ghi người dùng có ID ${UserInfo.id} vào database!`, "[ NEW USER ]");
                            }

                            logger(`Người Dùng Mới: [ ${UserInfo.id} ] » ${UserInfo.name}`, "[ NEW USER ]");
                        }

                    }
                    fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
                } catch {
                    logger(`Không thể ghi nhóm có ID ${event.threadID} vào database!`, "[  THREAD  ]");
                }
            }

            if (!UsersAll.some(item => item.id == event.senderID)) {
                const DataInfo = (await api.getUserInfo(event.senderID))
                const Gender = ((DataInfo[event.senderID].gender == 2) ? "MALE" : "FEMALE")
                try {
                    UsersAll.push({
                        money: 0,
                        exp: 0,
                        banned: false,
                        reasonban: "",
                        timebanned: "",
                        commandBanned: [],
                        id: event.senderID,
                        name: DataInfo[event.senderID].name,
                        firstName: DataInfo[event.senderID].firstName,
                        vanity: DataInfo[event.senderID].vanity,
                        thumbSrc: DataInfo[event.senderID].thumbSrc,
                        profileUrl: DataInfo[event.senderID].profileUrl,
                        gender: Gender,
                        type: DataInfo[event.senderID].type,
                        isFriend: DataInfo[event.senderID].isFriend,
                        isBirthday: DataInfo[event.senderID].isBirthday,
                        Data: {}
                    });
                    logger(`Người Dùng Mới: [ ${event.senderID} ] » ${DataInfo[event.senderID].name}`, "[ NEW USER ]");

                    fs.writeFileSync(client.dirMain + "/data/Users.json", JSON.stringify(UsersAll, null, "\t"));
                } catch {
                    logger(`Không thể ghi người dùng có ID ${event.senderID} vào database!`, "[ NEW USER ]");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
};