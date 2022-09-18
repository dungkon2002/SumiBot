import moment from "moment-timezone";
import logger from "../../utils/log.js";
import fs from "fs-extra";
export default function ({
    api,
    global,
    client,
    utils,
    ThreadsAll,
    UsersAll,
    ThreadSettings,
    UserThread
}) {
    return async function ({
        event
    }) {
        try {
            setInterval(() => {
                try {
                    var timer = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm");
                    if (timer == "00:00") {
                        if (client.resetExp == true) {
                            for (let Data of ThreadsAll) {
                                if (ThreadsAll.some(item => item.threadID == Data.threadID)) {
                                    let DataThread = ThreadsAll.find(item => item.threadID == Data.threadID)
                                    let DataExp = [],
                                        DataToday = [];
                                    for (let DataI of DataThread.ExpGrpup) {
                                        if (DataI.ExpToday > 0) {
                                            DataToday.push({
                                                id: DataI.id,
                                                exp: parseInt(DataI.ExpToday)
                                            })
                                        }
                                        DataExp.push({
                                            id: DataI.id,
                                            exp: parseInt(DataI.exp),
                                            ExpToday: 0
                                        })
                                    }
                                    if (DataThread.ExpToday > 0) {
                                        DataThread.ExpYesterday = parseInt(DataThread.ExpToday)
                                    } else {
                                        DataThread.ExpYesterday = 0
                                    }
                                    for (let dataZ of DataToday) {
                                        if (DataThread.ExpWeek.some(item => item.id == dataZ.id)) {
                                            let getData = DataThread.ExpWeek.find(item => item.id == dataZ.id)
                                            getData.id = dataZ.id
                                            getData.exp = parseInt(getData.exp) + parseInt(dataZ.exp)
                                        } else DataThread.ExpWeek.push({
                                            id: dataZ.id,
                                            exp: parseInt(dataZ.exp)
                                        })
                                    }
                                    DataThread.ExpToday = 0
                                    DataThread.ExpGrpup = DataExp

                                }
                                fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
                            }
                            client.resetExp = false
                            logger(`[ CLIENT RESETEXP ] » ${((client.resetExp == true) ? "ON" : "OFF")} » Đã làm mới dữ liệu Thread`, "[ SUMIBOT ]");
                        }
                    }
                    if (timer == "00:05") {
                        if (client.resetExp == false) {
                            client.resetExp = true
                            logger(`[ CLIENT RESETEXP ] » ${((client.resetExp == true) ? "ON" : "OFF")}`, "[ SUMIBOT ]");
                        }
                    }
                    const date = new Date();
                    let current_day = date.getDay();
                    if (current_day == 0) {
                        if (timer == "23:59") {
                            if (client.resetWeek == true) {
                                for (let DataZ of ThreadsAll) {
                                    if (ThreadsAll.some(item => item.threadID == DataZ.threadID)) {
                                        let DataThread = ThreadsAll.find(item => item.threadID == DataZ.threadID)
                                        DataThread.ExpWeek = []
                                    }
                                    fs.writeFileSync(client.dirMain + "/data/Thread.json", JSON.stringify(ThreadsAll, null, "\t"));
                                }
                                client.resetWeek = false
                                logger(`[ CLIENT RESETWEEK ] » ${((client.resetWeek == true) ? "ON" : "OFF")} » Đã làm mới dữ liệu ExpWeek`, "[ SUMIBOT ]");
                            }
                        }
                        if (timer == "00:00") {
                            if (client.resetWeek == false) {
                                client.resetWeek = true
                                logger(`[ CLIENT RESETWEEK ] » ${((client.resetWeek == true) ? "ON" : "OFF")}`, "[ SUMIBOT ]");
                            }
                        }
                    }
                } catch (e) {
                    console.log(e)
                };
            }, 1000);
            const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
            const UsersData = UsersAll.find(item => item.id == event.senderID);
            if (ThreadsData.banned || UsersData.banned) return;
            const commands = client.commandRegister.values() || [];

            for (const command of commands) {
                for (const Getcommands of command) {
                    const commandModule = client.commands.get(Getcommands)
                    try {
                        commandModule.event({
                            event,
                            api,
                            global,
                            client,
                            utils,
                            ThreadsAll,
                            UsersAll,
                            ThreadSettings,
                            UserThread
                        });
                    } catch (error) {
                        logger(error + " at event command: " + commandModule.default.name, "error");
                    }

                }

            }

        } catch {
            return;

        }
    }
};
