export default {
    name: "fbuser",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "Dũngkon",
    description: "lọc người dùng facebook",
    commandCategory: "group",
    usages: "",
    cooldowns: 15
}
export async function run({ api: a, event: b }) {
    var { userInfo: c, adminIDs: d } = await a.getThreadInfo(b.threadID), f = 0, e = 0, g = [];
    for (const d of c) void 0 == d.gender && g.push(d.id);
    return d = d.map((a) => a.id).some((b) => b == a.getCurrentUserID()), 0 == g.length ? a.sendMessage("Trong nhóm bạn không tồn tại Facebook.", b.threadID) : a.sendMessage("Nhóm bạn hiện có " + g.length + " Người dùng Facebook.", b.threadID, function() {
        return d ? a.sendMessage("Bắt đầu lọc ..", b.threadID, async function() {
            for (const c of g) try {
                await new Promise((a) => setTimeout(a, 1e3)),
                await a.removeUserFromGroup(parseInt(c), b.threadID),
                f++
            } catch (a) {
                e++
            }
            a.sendMessage("Đã lọc thành công " + f + " ng.", b.threadID, function() {
                if (0 != e) return a.sendMessage("Lọc thất bại " + e + " người.", b.threadID)
            })
        }) : a.sendMessage("Nhưng bot không phải quản trị viên nên không lọc được, hay thêm bot làm quản trị viên rồi thử lại.", b.threadID)
    })
};