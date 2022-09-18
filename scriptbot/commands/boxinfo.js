export default {
	name: "boxinfo",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Xem Thông tin nhóm",
	shortDescription: "Thông tin nhóm",
	usages: [
	'boxinfo: Xem Thông tin nhóm bạn'
    ],
	cooldowns: 5
};

import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function run({ api, event, UsersAll, ThreadsAll, utils })  {
           try {
			let threadInfo = ThreadsAll.find(item => item.threadID == event.threadID);
			let threadMem = threadInfo.participantIDs.length;
			let gendernam = [];
			let gendernu = [];
			let nope = [];
			for (let z in threadInfo.userInfo) {
				let gioitinhone = threadInfo.userInfo[z].gender;
		
				let nName = threadInfo.userInfo[z].name;
		
				if (gioitinhone == 'MALE') {
					gendernam.push(z + gioitinhone);
				} else if (gioitinhone == 'FEMALE') {
					gendernu.push(gioitinhone);
				} else {
					nope.push(nName);
				}
			}
			let nam = gendernam.length;
			let nu = gendernu.length;
			let qtv = threadInfo.adminIDs.length;
			let sl = threadInfo.messageCount;
			let icon = threadInfo.emoji;
			let threadName = threadInfo.threadName;
			let id = threadInfo.threadID;
			let ExpToday = threadInfo.ExpToday;
			let ExpYesterday = threadInfo.ExpYesterday;
			let tong =  Math.ceil((100/parseInt(ExpYesterday) * parseInt(ExpToday)) - 100)
			let listad = '';
			let qtv2 = threadInfo.adminIDs;
			for (let i = 0; i < qtv2.length; i++) {
		    const infu = UsersAll.find(item => item.id == qtv2[i].id)
		    const name = infu.name;
				listad += '•' + name + '\n';
			}
			let sex = threadInfo.approvalMode;
			let pd = sex == false ? 'tắt' : sex == true ? 'bật' : 'Kh';
			let pdd = sex == false ? '❎' : sex == true ? '✅' : '⭕';
			
		
			if (threadInfo.imageSrc == null || "") return api.sendMessage(`Tên box: ${threadName}\nID Box: ${id}\n${pdd} Phê duyệt: ${pd}\nEmoji: ${icon}\n-Thông tin:\nTổng ${threadMem} thành viên\n👨‍🦰Nam: ${nam} thành viên \n👩‍🦰Nữ: ${nu} thành viên\n\n🕵️‍♂️Với ${qtv} quản trị viên gồm:\n${listad}\n» Tổng số tin nhắn:\n» Tổng: ${sl} tin nhắn\n» Hôm qua: ${ExpYesterday} tin nhắn\n» Hôm Nay: ${ExpToday} tin nhắn\n» Độ tương tác: ${((tong  == Infinity) ? "" : (tong > 0) ? "📈" : "📉")} ${((tong == Infinity) ? "Chưa có dữ liệu!" : `${tong}%`)}.`,event.threadID)
			try{
			const path = ps.resolve(__dirname, 'cache', `${event.threadID}.png`);
			await utils.downloadFile(threadInfo.imageSrc, path);
				api.sendMessage(
					{
						body: `Tên box: ${threadName}\nID Box: ${id}\n${pdd} Phê duyệt: ${pd}\nEmoji: ${icon}\n-Thông tin:\nTổng ${threadMem} thành viên\n👨‍🦰Nam: ${nam} thành viên \n👩‍🦰Nữ: ${nu} thành viên\n\n🕵️‍♂️Với ${qtv} quản trị viên gồm:\n${listad}\n» Tổng số tin nhắn:\n» Tổng: ${sl} tin nhắn\n» Hôm qua: ${ExpYesterday} tin nhắn\n» Hôm Nay: ${ExpToday} tin nhắn\n» Độ tương tác: ${((tong  == Infinity) ? "" : (tong > 0) ? "📈" : "📉")} ${((tong == Infinity) ? "Chưa có dữ liệu!" : `${tong}%`)}.`, 
						attachment: fs.createReadStream(path)
					},
					event.threadID,
					() => fs.unlinkSync(path),
					event.messageID
				);
			} catch {
				return api.sendMessage(`Tên box: ${threadName}\nID Box: ${id}\n${pdd} Phê duyệt: ${pd}\nEmoji: ${icon}\n-Thông tin:\nTổng ${threadMem} thành viên\n👨‍🦰Nam: ${nam} thành viên \n👩‍🦰Nữ: ${nu} thành viên\n\n🕵️‍♂️Với ${qtv} quản trị viên gồm:\n${listad}\n» Tổng số tin nhắn:\n» Tổng: ${sl} tin nhắn\n» Hôm qua: ${ExpYesterday} tin nhắn\n» Hôm Nay: ${ExpToday} tin nhắn\n» Độ tương tác: ${((tong  == Infinity) ? "" : (tong > 0) ? "📈" : "📉")} ${((tong == Infinity) ? "Chưa có dữ liệu!" : `${tong}%`)}.`,event.threadID)
			}


	} catch (e) { console.log(e) }
}
