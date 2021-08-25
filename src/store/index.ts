import { reactive } from "@vue/reactivity";

const settings = reactive({
	darkMode: false,
	fontSize: 20,
	themeColor: '',
	pages_per_process: 10,
	quantum: 4,
});

const methods = {

	toggleTheme(): void {
		settings.darkMode = !settings.darkMode;
	},

	setTheme(theme: boolean): void { settings.darkMode = theme; },
	setFontSize(font_size: number) : void { settings.fontSize = font_size; },
	setColor(color: string): void { settings.themeColor = color; },
	setPagesPerProcess(pages: number): void { settings.pages_per_process = pages },
	setQuantum(quantum: number): void { settings.quantum = quantum }


};

const getters = {

	getTheme(): boolean { return settings.darkMode },
	getFontSize(): number { return settings.fontSize },
	getColor() : string { return settings.themeColor },
	getPagesPerProcess() : number { return settings.pages_per_process; },
	getQuantum(): number { return settings.quantum },
}

export default {
	settings,
	methods,
	getters
}