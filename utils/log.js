import chalk from 'chalk';
import readline from 'readline';
import process from 'process';

var loadingID, prevLoadingData = '', prevUpdatableData = '';


export default (data, option) => {
	if (option == 'LOAD') {
		let i = 0;
		const frames = [
			"LOAD",
			"OADI",
			"ADIN",
			"DING",
			"INGL",
			"NGLO",
			"GLOA"
		];
		loadingID = setInterval(() => {
			const frame = frames[i = ++i % frames.length];
			readline.clearLine(process.stdout, 1);
			readline.cursorTo(process.stdout, 0);
			process.stdout.write(`[ ${chalk.blue.bold(frame)} ] ${data}`);
		}, 150);
	}
	else if (option == 'DONE' || option == 'FAIL') {
		let clearMode = data.length > prevLoadingData.length ? 1 : 0;
		prevLoadingData = data;
		clearInterval(loadingID);
		readline.clearLine(process.stdout, clearMode);
		readline.cursorTo(process.stdout, 0);
		return process.stdout.write(chalk.magenta(`» ${option == 'DONE' ? chalk.bgMagenta.yellow.bold('[ DONE ]') : chalk.bgRed.yellow.bold('[ FAIL ]')} « ${option == 'DONE' ? `${chalk.bgGreen.white.bold(data)}\n` : `${chalk.bgRed.white.bold(data)}\n`}`));
	}
	else {
		let clearMode = data.length > prevLoadingData.length ? 1 : 0;
		prevLoadingData = data;
		clearInterval(loadingID);
		readline.clearLine(process.stdout, clearMode);
		readline.cursorTo(process.stdout, 0);
		return process.stdout.write(chalk.magenta(`» ${chalk.bgMagenta.yellow.bold(option)} « ${chalk.bgMagenta.yellow.bold(data)}\n`));
	}
}

export function loader(data, option) {
	switch (option) {
		case "warn":
			console.log(chalk.yellow('» [ LOADER ] « ') + data);
			break;
		case "error":
			console.log(chalk.red('» [ LOADER ] « ') + data);
			break;
		default:
			console.log(chalk.green(`» [ LOADER ] « `) + data);
			break;
	}
}

export function updatableLog(data, option) {
	let clearMode = data.length > prevUpdatableData.length ? 1 : 0;
	prevUpdatableData = data;
	readline.clearLine(process.stdout, clearMode);
	readline.cursorTo(process.stdout, 0);
	return process.stdout.write(`[ ${option == 0 ? chalk.bgMagenta.yellow.bold('INFO') : chalk.bgRed.yellow.bold('ERRO')} ] » ${data}`);
}
