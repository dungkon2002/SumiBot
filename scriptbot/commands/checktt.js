export default {
	name: "checktt",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Check tương tác toàn bộ thành viên",
	shortDescription: "Check tương tác",
	usages: [
	'checktt: Xem tương tác của bản thân',
	'checktt all: Xem tương tác của thành viên theo ngày',
	'checktt week: Xem tương tác của thành viên trong 1 tuần'
],
	cooldowns: 5
};

export async function run({ api, event, ThreadsAll, args, UsersAll, utils })  {
        try {
			const ThreadsData = ThreadsAll.find(item => item.threadID == event.threadID).ExpGrpup;
			const ThreadData = ThreadsAll.find(item => item.threadID == event.threadID).ExpWeek;
			switch (args[0]) {
				case "week": {
					let array = [], mgs = "";
					const date = new Date();
                    let current_day = date.getDay();
					if (current_day == 0) {
						try {
						ThreadData.sort((a, b) => {
						if (a.exp > b.exp) return -1;
						if (a.exp < b.exp) return 1;
					});
					for (let data of ThreadData) {	
					const UsersData = UsersAll.find(item => item.id == data.id);
						array.push({
							name: UsersData.name,
							exp: data.exp
						})
			        }
					let top1 = `🥇Top1: ${array[0].name} với ${array[0].exp} Tin nhắn`;
					//=======================//
					let top2 = `🥈Top2: ${array[1].name} với ${array[1].exp} Tin nhắn`;
					//=======================//
					let top3 = `🥉Top3: ${array[2].name} với ${array[2].exp} Tin nhắn`;
					for (let num = 3; num < 5; num++) {
						mgs += `•Top${num + 1}: ${array[num].name} với ${array[num].exp} Tin nhắn\n`;
					}
					return api.sendMessage(`Top 5 thành viên tương tác cao trong tuần:\n${top1}\n${top2}\n${top3}\n${mgs}\n`, event.threadID);
					ca	
				} catch {
					return
				}
					} else return api.sendMessage(`Dữ liệu sẽ được cập nhập vào cuối tuần!`, event.threadID);
					break;
				}
				case "all": {
				if (!args[1] || !isNaN(args[1])) {
                ThreadsData.sort((a, b) => {
					if (a.exp > b.exp) return -1;
					if (a.exp < b.exp) return 1;
				});
			const numberOfOnePage = 1000000;
		    const page = parseInt(args[1]) || 1;
				let msg = "";
				let i = 0;
				let startSlice = numberOfOnePage * page - numberOfOnePage;
				i = startSlice;
				if(page > parseInt(Math.ceil(ThreadsData.length / numberOfOnePage))) return;
				const threadOfPage = ThreadsData.slice(startSlice, startSlice + numberOfOnePage);
				for (let Users of threadOfPage) {
					const UsersData = UsersAll.find(item => item.id == Users.id);
					msg += `${++i}/ ${UsersData.name}\n» Tổng tin nhắn: ${Users.exp} Tin nhắn\n» Tin nhắn trong ngày : ${Users.ExpToday} Tin nhắn\n`;
					}
				return api.sendMessage(`${msg}\n» Trang [ ${page}/${Math.ceil(ThreadsData.length / numberOfOnePage)} ]\n» checktt all <xxxx>: số trang để qua trang!\n» Dữ liệu sẽ được làm mới sau 00:00 Giờ!`, event.threadID);	
			} else return utils.throwError(this.config.name, event.threadID, event.messageID);
					break;
				}
				default: {
					ThreadsData.sort((a, b) => {
						if (a.exp > b.exp) return -1;
						if (a.exp < b.exp) return 1;
						if (a.id > b.id) return 1;
						if (a.id < b.id) return -1;
					});
					let rank = ThreadsData.findIndex(info => parseInt(info.id) == parseInt(event.senderID)) + 1;
					let infoUser = ThreadsData[rank - 1];
					return api.sendMessage(`Bạn đứng hạng ${rank} với:\n» Tổng tin nhắn: ${infoUser.exp} tin nhắn\n» Tin nhắn trong ngày : ${infoUser.ExpToday} Tin nhắn`, event.threadID);
						break;
					}
			}

		} catch (e) { console.log(e) }
}
