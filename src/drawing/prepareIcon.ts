import { BannerGeneratorSettings } from "../types";
import { loadImageFromFile, loadImageFromUrl } from "~/utils/helpers";

/**
 * Prepares the icon, either by loading a user-provided file or rendering the default emoji.
 * @returns An HTMLImageElement of the icon, or null if no icon is set.
 */
export async function prepareIcon(
	settings: BannerGeneratorSettings,
	iconFile?: File
): Promise<HTMLImageElement | null> {
	if (iconFile) {
		return loadImageFromFile(iconFile);
	}

	const { icon, fontSize, fontFamily } = settings;
	if (icon) {
		const tempCanvas = document.createElement("canvas");
		const tempCtx = tempCanvas.getContext("2d");
		if (!tempCtx) return null;

		tempCtx.font = `${fontSize * 2}px ${fontFamily}`;
		const metrics = tempCtx.measureText(icon);
		tempCanvas.width = metrics.width;
		tempCanvas.height =
			metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		tempCtx.font = `${fontSize * 2}px ${fontFamily}`;
		tempCtx.fillText(icon, 0, metrics.actualBoundingBoxAscent);

		return loadImageFromUrl(tempCanvas.toDataURL());
	}

	return null;
}
