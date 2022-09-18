export default function ({
    api,
    global,
    client,
    utils,
    ThreadsAll,
    UsersAll,
    ThreadSettings
}) {

    return async function ({
        event
    }) {
        const {
            handleReaction
        } = client;
        if (handleReaction.length !== 0) {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == event.messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReaction[indexOfHandle];
            const handleNeedExec = client.commands.get(indexOfMessage.name)
            if (!handleNeedExec) return api.sendMessage("Thiếu dữ kiện để thực thi phản hồi lại câu trả lời của bạn!", event.threadID, event.messageID);
            try {
                handleNeedExec.handleReaction({
                    event,
                    api,
                    global,
                    client,
                    utils,
                    ThreadsAll,
                    UsersAll,
                    ThreadSettings,
                    handleReaction: indexOfMessage
                });
                return;
            } catch (e) {
                console.log(e);
                return api.sendMessage("Đã có lỗi xảy ra khi đang thực thi trả lời câu hỏi của bạn!", event.threadID, event.messageID);
            }
        }
    }
};
