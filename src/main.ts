import { App, Editor, MarkdownView, Plugin } from "obsidian";
import { BannerGeneratorSettings, DEFAULT_SETTINGS } from "./types";
import { BannerGeneratorSettingTab } from "~/ui/BannerGeneratorSettingsTab";
import { GenerateBannerModal } from "~/ui/GenerateBannerModal";

export default class BannerGeneratorPlugin extends Plugin {
	settings: BannerGeneratorSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "generate-banner",
			name: "Generate Banner",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new GenerateBannerModal(this.app, this, editor).open();
			},
		});

		this.addSettingTab(new BannerGeneratorSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
