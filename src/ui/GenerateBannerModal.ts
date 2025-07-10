import { App, Editor, Modal, Notice, Setting } from "obsidian";
import BannerGeneratorPlugin from "../main";
import { drawBanner } from "~/drawing/drawBanner";
import { prepareIcon } from "~/drawing/prepareIcon";
import { saveCanvasToFile } from "~/file/saveBanner";
import { loadImageFromFile } from "~/utils/helpers";

export class GenerateBannerModal extends Modal {
	plugin: BannerGeneratorPlugin;
	editor: Editor;

	// --- User Inputs ---
	bannerText: string = "";
	imageFile?: File;
	iconFile?: File;

	constructor(app: App, plugin: BannerGeneratorPlugin, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.editor = editor;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Generate Banner" });
		this.createForm(contentEl);
	}

	onClose() {
		this.contentEl.empty();
	}

	/**
	 * Creates and encapsulates the modal's form UI.
	 */
	private createForm(container: HTMLElement): void {
		new Setting(container)
			.setName("Banner Text")
			.setDesc("The primary text to display on the banner.")
			.addText((text) =>
				text
					.setPlaceholder("Enter banner text...")
					.onChange((value) => (this.bannerText = value))
			);

		this.createFileInput(
			container,
			"Reference Image",
			"The background image for the banner.",
			"image/*",
			(file) => (this.imageFile = file)
		);

		this.createFileInput(
			container,
			"Icon (Optional)",
			"Overrides the default icon. Supports image files or SVGs.",
			"image/*, .svg",
			(file) => (this.iconFile = file)
		);

		new Setting(container).addButton((button) =>
			button
				.setButtonText("Generate")
				.setCta()
				.onClick(() => this.handleSubmit())
		);
	}

	/**
	 * A helper to create a file input setting.
	 */
	private createFileInput(
		container: HTMLElement,
		name: string,
		desc: string,
		accept: string,
		onFileSelected: (file: File) => void
	): void {
		new Setting(container)
			.setName(name)
			.setDesc(desc)
			.addText((text) => {
				text.inputEl.type = "file";
				text.inputEl.accept = accept;
				text.inputEl.addEventListener("change", (event) => {
					const files = (event.target as HTMLInputElement).files;
					if (files && files.length > 0) {
						onFileSelected(files[0]);
					}
				});
			});
	}

	/**
	 * Handles the validation and submission logic.
	 */
	private async handleSubmit(): Promise<void> {
		if (!this.bannerText) {
			new Notice("Please enter banner text.");
			return;
		}
		if (!this.imageFile) {
			new Notice("Please select a reference image.");
			return;
		}

		this.close();
		await this.generateBanner();
	}

	/**
	 * The main orchestration function for generating the banner.
	 */
	private async generateBanner(): Promise<void> {
		new Notice("Generating banner...");
		try {
			const [backgroundImage, iconImage] = await Promise.all([
				loadImageFromFile(this.imageFile!),
				prepareIcon(this.plugin.settings, this.iconFile),
			]);

			const finalCanvas = drawBanner(
				this.plugin.settings,
				this.bannerText,
				backgroundImage,
				iconImage
			);

			const bannerFile = await saveCanvasToFile(
				this.app,
				this.plugin.settings,
				finalCanvas,
				this.bannerText
			);

			this.editor.replaceSelection(`![[${bannerFile.path}]]`);
			new Notice("Banner generated successfully!");
		} catch (error) {
			console.error("Banner generation error:", error);
			new Notice("Failed to generate banner. Check console for details.");
		}
	}
}
