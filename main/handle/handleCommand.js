import stringSimilarity from "string-similarity";
import logger from "../../utils/log.js";

export default function({
    api,
    global,
    client,
    utils,
    ThreadsAll,
    UsersAll,
    ThreadSettings,
    UserThread,
    AdminOnly
}) {
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    return async function({
        event
    }) {
        try {
            const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
            const UsersData = UsersAll.find(item => item.id == event.senderID);
            const dateNow = Date.now();
            var {
                body: contentMessage,
                senderID,
                threadID
            } = event;
            const {
                PREFIX,
                ADMINBOT,
                DeveloperMode
            } = global.config;
            const threadSetting = ThreadSettings.find(item => item.id == event.threadID) || {};
            senderID = parseInt(senderID);
            threadID = parseInt(threadID);
            const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX )})\\s*`);

            if (!prefixRegex.test(contentMessage)) return;

            //////////////////////////////////////////
            //=========Get command user use=========//
            //////////////////////////////////////////
            
            if (ThreadsAll.some(item => item.threadID == event.threadID)) {
                if (ThreadsData.banned && !ADMINBOT.includes(senderID.toString())) return api.sendMessage(`[ ⛔️ BANNED THREAD ]\n» Hiện tại nhóm của bạn đang bị cấm sử dụng bot!\n\n» 📝 Với lý do: ${ThreadsData.reasonban}\n» ⏱ Vào Lúc: ${ThreadsData.timebanned}\n`, threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }
            if (UsersAll.some(item => item.id == event.senderID)) {
                if (UsersData.banned) return api.sendMessage(`[ ⛔️ BANNED USERS ]\n» Hiện tại bạn đang bị cấm sử dụng bot!\n\n» 📝 Với lý do: ${UsersData.reasonban}\n» ⏱ Vào Lúc: ${UsersData.timebanned}\n`, threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }
            
            if (ThreadsAll.some(item => item.threadID == event.threadID)) {
                if(ThreadsData.QTVBOX && !ADMINBOT.includes(senderID.toString()) && !ThreadsData.adminIDs.some(el => el.id.toString() == senderID.toString())) return api.sendMessage(`» Bạn không đủ quyền hạn để có thể sử dụng BOT!\nChức vụ có thể sửa dụng: QTV Nhóm`, event.threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }

            if (ThreadsAll.some(item => item.threadID == event.threadID)) {
                if(ThreadsData.ADMINBOT && !ADMINBOT.includes(senderID.toString())) return api.sendMessage(`» Bạn không đủ quyền hạn để có thể sử dụng BOT!\nChức vụ có thể sửa dụng: ADMINBOT`, event.threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }
            ////////////////////////////////////////
            //========= Check permssion =========//
            ///////////////////////////////////////

            var permssion = 0;
            const find = ThreadsData.adminIDs.find(el => el.id.toString() == senderID.toString());
            if (ADMINBOT.includes(senderID.toString())) permssion = 2;
            else if (!ADMINBOT.includes(senderID) && find) permssion = 1;
            
            if(AdminOnly.some(item => item.threadID == event.threadID)){
                const AdminData = AdminOnly.find(item => item.threadID == event.threadID);
                
               if(AdminData.hasPermssion > permssion) return api.sendMessage(`[ ❎ ADNINONLY ]\n» Hiện Tại Đang Bật Chế Độ AdminOnly, Chỉ QTV Và Admin Được Sử Dụng Bot !`, event.threadID, async (error, info) => {
                await new Promise(resolve => setTimeout(resolve, 5000));
                return api.unsendMessage(info.messageID);
                            });

            }
            
            const [matchedPrefix] = contentMessage.match(prefixRegex);
            const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            let command = client.commands.get(commandName);

            if (!command) {
                const allCommandName = [];
                const commandValues = client.commands.values();
                for (const cmd of commandValues) allCommandName.push(cmd.default.name);
                const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
                if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
                else return api.sendMessage(`[ ${global.config.BOTNAME} ]\n» ⚠️ Lệnh bạn sử dụng không tồn tại!\n» Có phải là lệnh\n» ${matchedPrefix}${checker.bestMatch.target}  hay không?`, threadID);
            }
            
             if (UsersAll.some(item => item.id == event.senderID)) {
                const usercmd = UsersData.commandBanned.find(item => item.cmd == command.default.name) || [];
                if (usercmd.cmd == command.default.name) return api.sendMessage(`[ ⛔️ BANNED COMMAND ]\n» Bạn đã bị cấm sử dụng lệnh\n\n» Commands: ${command.default.name}\n» 📝 Với lý do: ${usercmd.reasonban}\n» ⏱ Vào Lúc:  ${usercmd.timebanned}`, threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }
            if (ThreadsAll.some(item => item.threadID == event.threadID)) {
                const getcmd = ThreadsData.commandBanned.find(item => item.cmd == command.default.name) || [];
                if (getcmd.cmd == command.default.name) return api.sendMessage(`[ ⛔️ BANNED COMMAND ]\n» Nhóm bạn đã bị cấm sử dụng lệnh\n\n» Commands: ${command.default.name}\n» 📝 Với lý do: ${getcmd.reasonban}\n» ⏱ Vào Lúc:  ${getcmd.timebanned}`, threadID, async (error, info) => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return api.unsendMessage(info.messageID);
                });
            }
            
            if (command.default.hasPermssion > permssion) return api.sendMessage(`[ ❎ PERMISSION ]\n» Bạn không đủ quyền hạn để có thể sử dụng\n» 💠Lệnh "${command.default.name}"\n» 👥Role: ${((command.default.hasPermssion == 2) ? "ADMIN BOT" : (command.default.hasPermssion == 1) ? "Quản Trị Viên" : "Người Dùng")}`, event.threadID, async (error, info) => {
                await new Promise(resolve => setTimeout(resolve, 5000));
                return api.unsendMessage(info.messageID);
            });

            //////////////////////////////////////
            //========= Check cooldown =========//
            //////////////////////////////////////
            if (!client.cooldowns.has(command.default.name)) client.cooldowns.set(command.default.name, new Map());
            const timestamps = client.cooldowns.get(command.default.name);
            const cooldownAmount = (command.default.cooldowns || 1) * 1000;
            if (timestamps.has(senderID)) {
                const expirationTime = timestamps.get(senderID) + cooldownAmount;
                if (dateNow < expirationTime) {
                    api.sendMessage(`[ ⏱ COOLDOWN ]\n» Bạn không thể dùng lệnh ngay lúc này vui lòng thử lại sau!\n» ⏱ ${((expirationTime - dateNow)/1000).toString().slice(0, 3)}s`, event.threadID, async (error, info) => {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        return api.unsendMessage(info.messageID);
                    });
                    return api.setMessageReaction('⏱', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
                }
            }
            
            
            ///////////////////////////////////
            //========= Run command =========//
            ///////////////////////////////////
            try {
                command.run({
                    api,
                    global,
                    client,
                    event,
                    args,
                    ThreadsAll,
                    UsersAll,
                    ThreadSettings,
                    utils,
                    permssion,
                    UserThread,
                    AdminOnly
                });
                timestamps.set(senderID, dateNow);
                if (DeveloperMode == true) {
                    const moment = require("moment-timezone");
                    const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
                    logger(`[ ${time} ] Command Executed: ${commandName} | User: ${senderID} | Arguments: ${args.join(" ")} | Group: ${threadID} | Process Time: ${(Date.now()) - dateNow}ms`, "[ DEV MODE ]");
                }
                return;
            } catch (error) {
                logger(`${error.stack}\n» Tại lệnh: ${command.default.name}`, "FAIL");
                return api.sendMessage(`[ ERROR COMMANDS ]\n» ⚠️ Đã có lỗi xảy ra khi thực khi lệnh: ${command.default.name}\n${error}`, threadID);
            }


        } catch (err) {
            console.log(err);
            return;
        };
    };
};