import { App, PluginSettingTab, Setting } from "obsidian";
import BannerGeneratorPlugin from "~/main";
import { BannerGeneratorSettings } from "~/types";

export class BannerGeneratorSettingTab extends PluginSettingTab {
	plugin: BannerGeneratorPlugin;

	constructor(app: App, plugin: BannerGeneratorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Banner Generator Settings" });

		this.createTextSetting(
			"Output Directory",
			"The folder for saving banners.",
			"banners",
			"outputDirectory"
		);
		this.createNumberSetting(
			"Font Size",
			"The font size in pixels.",
			100,
			"fontSize"
		);
		this.createNumberSetting(
			"Margin",
			"The margin around the text in pixels.",
			20,
			"margin"
		);
		this.createTextSetting(
			"Font Family",
			"The font for the banner text.",
			"sans-serif",
			"fontFamily"
		);
		this.createSliderSetting(
			"Font Weight",
			"The weight of the font.",
			100,
			900,
			100,
			"fontWeight"
		);
		this.createColorSetting(
			"Font Color",
			"The color of the banner text.",
			"fontColor"
		);
		this.createTextSetting(
			"Default Icon",
			"Default icon (emoji or character).",
			"✅",
			"icon"
		);
		this.createNumberSetting(
			"Icon Margin",
			"Margin between the icon and text.",
			10,
			"iconMargin"
		);
		this.createSliderSetting(
			"Banner Height",
			"The percentage of the image to use for the banner.",
			0,
			100,
			1,
			"bannerHeight"
		);
		new Setting(this.containerEl)
			.setName("Enable Text Stroke")
			.setDesc("Enable an outline around the text.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableStroke)
					.onChange(async (value) => {
						this.plugin.settings.enableStroke = value;
						await this.plugin.saveSettings();
					})
			);
		this.createColorSetting(
			"Stroke Color",
			"The color of the text outline.",
			"strokeColor"
		);
	}

	private createTextSetting(
		name: string,
		desc: string,
		placeholder: string,
		key: keyof BannerGeneratorSettings
	) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addText((text) =>
				text
					.setPlaceholder(placeholder)
					.setValue(this.plugin.settings[key] as string)
					.onChange(async (value) => {
						(this.plugin.settings[key] as string) = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private createNumberSetting(
		name: string,
		desc: string,
		placeholder: number,
		key: keyof BannerGeneratorSettings
	) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addText((text) =>
				text
					.setPlaceholder(placeholder.toString())
					.setValue(String(this.plugin.settings[key]))
					.onChange(async (value) => {
						const numValue = Number(value);
						if (!isNaN(numValue)) {
							(this.plugin.settings[key] as number) = numValue;
							await this.plugin.saveSettings();
						}
					})
			);
	}

	private createColorSetting(
		name: string,
		desc: string,
		key: "fontColor" | "strokeColor"
	) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings[key])
					.onChange(async (value) => {
						this.plugin.settings[key] = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private createSliderSetting(
		name: string,
		desc: string,
		min: number,
		max: number,
		step: number,
		key: keyof BannerGeneratorSettings
	) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addSlider((slider) =>
				slider
					.setLimits(min, max, step)
					.setValue(this.plugin.settings[key] as number)
					.onChange(async (value) => {
						(this.plugin.settings[key] as number) = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
