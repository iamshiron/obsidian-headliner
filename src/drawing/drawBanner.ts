import { BannerGeneratorSettings } from "../types";

/**
 * Takes a high-resolution canvas and scales it down to 1x size.
 * @returns The downscaled HTMLCanvasElement.
 */
function downscaleCanvas(
	sourceCanvas: HTMLCanvasElement,
	scale: number
): HTMLCanvasElement {
	const finalCanvas = document.createElement("canvas");
	finalCanvas.width = sourceCanvas.width / scale;
	finalCanvas.height = sourceCanvas.height / scale;

	const finalCtx = finalCanvas.getContext("2d");
	if (!finalCtx) throw new Error("Could not get final canvas context");

	finalCtx.drawImage(
		sourceCanvas,
		0,
		0,
		finalCanvas.width,
		finalCanvas.height
	);
	return finalCanvas;
}

/**
 * Draws the background, icon, and text onto a canvas.
 * @returns The final, downscaled HTMLCanvasElement.
 */
export function drawBanner(
	settings: BannerGeneratorSettings,
	bannerText: string,
	backgroundImage: HTMLImageElement,
	iconImage: HTMLImageElement | null
): HTMLCanvasElement {
	const {
		fontSize,
		margin,
		fontFamily,
		fontColor,
		iconMargin,
		bannerHeight,
		enableStroke,
		strokeColor,
		fontWeight,
	} = settings;
	const SCALE = 2; // Use 2x supersampling for sharper text

	const bannerHeightPixels = fontSize + margin * 2;
	const bannerWidth = backgroundImage.width;

	const canvas = document.createElement("canvas");
	canvas.width = bannerWidth * SCALE;
	canvas.height = bannerHeightPixels * SCALE;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not get canvas context");

	const sourceCropY = Math.max(
		0,
		(backgroundImage.height - bannerHeightPixels) * (bannerHeight / 100)
	);
	ctx.drawImage(
		backgroundImage,
		0,
		sourceCropY,
		bannerWidth,
		bannerHeightPixels,
		0,
		0,
		canvas.width,
		canvas.height
	);

	const scaledFontSize = fontSize * SCALE;
	ctx.font = `${fontWeight} ${scaledFontSize}px ${fontFamily}`;
	const textMetrics = ctx.measureText(bannerText);
	const textHeight =
		textMetrics.actualBoundingBoxAscent +
		textMetrics.actualBoundingBoxDescent;

	let iconWidth = 0;
	if (iconImage) {
		const aspect = iconImage.width / iconImage.height;
		iconWidth = textHeight * aspect;
		const iconHeight = textHeight;
		const scaledIconMargin = iconMargin * SCALE;

		ctx.drawImage(
			iconImage,
			margin * SCALE,
			(canvas.height - iconHeight) / 2,
			iconWidth,
			iconHeight
		);
		iconWidth += scaledIconMargin;
	}

	const textX = margin * SCALE + iconWidth;
	const textY =
		canvas.height / 2 +
		textHeight / 2 -
		textMetrics.actualBoundingBoxDescent;
	ctx.textAlign = "left";
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = fontColor;
	if (enableStroke) {
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = Math.max(1, Math.round(fontSize / 50)) * SCALE;
		ctx.strokeText(bannerText, textX, textY);
	}

	ctx.fillText(bannerText, textX, textY);

	return downscaleCanvas(canvas, SCALE);
}
