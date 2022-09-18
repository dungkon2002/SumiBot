export default {
	name: "weather",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "NDKhánh",
	description: "Xem thông tin thời tiết tại khu vực",
	shortDescription: "xem thời tiết",
	usages: [
		'weather <xxxx>: Địa điểm muốn xem thởi tiết'
    ],
    dependencies: ["axios","path","fs-extra"],
	key: {
		"OPEN_WEATHER": "db629a22d22d0b642a713686c353190f"
	},
	cooldowns: 5
};


import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({ api, event, args, global, utils }) {
	try {
		try{
		if (args.length == 0 || !args) return api.sendMessage('Vui lòng nhập địa điểm!', event.threadID, event.messageID);
		const { data } = (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args.join(" "))}&appid=${this.default.key.OPEN_WEATHER}&units=metric&lang=vi`))
		if (data.cod !== 200) return api.sendMessage(`Địa điểm ${args.join(" ")} không tồn tại!`, event.threadID, event.messageID);
		const path = ps.resolve(__dirname, 'cache', `weather.png`);
		await utils.downloadFile(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, path)
		const body = `Địa Điểm: ${data.name.toUpperCase()}\n⊱ ⋅ ────────────── ⋅ ⊰\n🌡 Nhiệt độ: ${Math.ceil(data.main.temp)}°C\n🌡 Nhiệt độ cảm nhận được: ${Math.ceil(data.main.feels_like)}°C\n☁️ Cảnh quan hiện tại: ${data.weather[0].description}\n💦 Độ ẩm: ${Math.ceil(data.main.humidity)}%\n💨 Tốc độ gió: ${data.wind.speed}km/h`
		return api.sendMessage({ body: body, attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path));
		} catch {
			return api.sendMessage(`Địa điểm ${args.join(" ")} không tồn tại!`, event.threadID, event.messageID);
		}
	} catch (e) {
	console.log(e)
	return ;
}
}