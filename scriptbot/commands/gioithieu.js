export default {
	name: "gioithieu",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "Dũngkon",
	description: "Thông tin nhà tài trợ và nhà phát triển",
	commandCategory: "Thông tin adminbot", 
	usages: "gioithieu [thông tin cho bạn]", 
	cooldowns: 0,
	dependencies: [] 
};

export async function run({ api, event, ThreadsAll, args, UsersAll, utils })  {
	if (args.join() == "") {api.sendMessage("🌸Thông Tin Admin Bot🌸\n👱Người chạy bot: Nguyễn Đinh Tiến Dũng\n🔗Link Fb: https://www.facebook.com/ban.follow.dao.2002/\n🔗Zalo: 0367281079\n📱SĐT: 0367281079\n📬Gmail: dungnguyen200214@gmail.com\n💵Tk Momo: 0367281079\n💵Tk Mb bank: 0367281079\n💵Tk VCB: 1016475889\n👦Tên Thật: Nguyễn Đinh Tiến Dũng\n👦Biệt Danh: Dũngkon\n🗓Ngày Tháng Năm Sinh: 01/04/2002\n📏Chiều Cao: 1m86\n💣Cân Nặng: 100kg(không biết chính xác)\n✔️Sở Thích: Chơi game, Nghe nhạc\n🔔Tính Cách: Vui vẻ, Hòa đồng, Hơi cục súc,\n💻Ước mơ: Làm streamer\n👫Đã Có Chủ\n💞Cảm ơn mọi người đã sử dụng bot của mình\n💞P/s: Chúc mọi người một ngày tốt lành",event.threadID, event.messageID);
	}
}