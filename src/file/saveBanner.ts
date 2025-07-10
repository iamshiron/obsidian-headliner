import { App, TFile } from "obsidian";
import { BannerGeneratorSettings } from "~/types";
import { getSanitizedFirstWord } from "~/utils/helpers";

/**
 * Converts a canvas to a PNG, saves it to the vault, and returns the TFile.
 * Banners are saved to a subfolder named after the currently active file.
 * @returns A Promise resolving to the created TFile.
 */
export async function saveCanvasToFile(
	app: App,
	settings: BannerGeneratorSettings,
	canvas: HTMLCanvasElement,
	bannerText: string
): Promise<TFile> {
	const { outputDirectory } = settings;

	const activeFile = app.workspace.getActiveFile();
	let subfolderPath = outputDirectory;

	if (activeFile) {
		const subfolderName = activeFile.basename.toLowerCase();
		subfolderPath = `${outputDirectory}/${subfolderName}`;
	}

	if (!(await app.vault.adapter.exists(subfolderPath))) {
		await app.vault.createFolder(subfolderPath);
	}

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, "image/png")
	);
	if (!blob) throw new Error("Failed to convert canvas to blob.");
	const arrayBuffer = await blob.arrayBuffer();

	const firstWord = getSanitizedFirstWord(bannerText);
	const fileName = `${firstWord}_${Date.now()}.png`;
	const filePath = `${subfolderPath}/${fileName}`;
	return app.vault.createBinary(filePath, arrayBuffer);
}
