import logger from "../../utils/log.js";

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
            const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID);
            const UsersData = UsersAll.find(item => item.id == event.senderID);
            if (ThreadsData.banned || UsersData.banned) return;
            const commands = client.noprefixRegister.values() || [];
            for (const command of commands) {
                for (const Getcommands of command) {
                    const commandModule = client.noprefix.get(Getcommands)
                    try {
                        commandModule.noprefix({
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
                        logger(error + " at event command: " + commandModule.config.name, "error");
                    }

                }

            }
        } catch {
            return;
        }
    }
};
