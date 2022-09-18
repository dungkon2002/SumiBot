import logger from "../../utils/log.js";
import moment from "moment";

export default function({
    api,
    global,
    client,
    utils,
    ThreadsAll,
    UsersAll,
    ThreadSettings,
    UserThread
}) {
    return async function({
        event
    }) {
        try {
            const timeStart = Date.now();
            const {
                threadID
            } = event;
            const eventCommand = client.eventRegister.values() || [];
            for (const Event of eventCommand) {
                for (const GetEvent of Event) {
                    const eventRun = client.events.get(GetEvent)
                    try {
                        eventRun.run({
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
                        if (global.config.DeveloperMode == true) {
                            const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
                            logger(`[ ${time} ] Event Executed: ${eventRun.config.name} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
                        }
                    } catch (error) {
                        logger(JSON.stringify(error) + " at event: " + eventRun.config.name, "error");
                    }

                }

            }
            return;
        } catch (error) {
            console.error(error)
            return;
        }
    }
};