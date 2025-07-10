/**
 * Extracts the first alphanumeric word from the banner text for use in the filename.
 * @param text The user-provided banner text.
 * @returns A sanitized, lowercase version of the first word, or "unknown".
 */
export function getSanitizedFirstWord(text: string): string {
	const words = text.match(/[a-zA-Z0-9]+/g);
	if (words && words.length > 0) {
		return words[0].toLowerCase();
	}
	return "unknown";
}

/**
 * Loads an image from a File object.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
	const url = URL.createObjectURL(file);
	const image = loadImageFromUrl(url);
	image.then(() => URL.revokeObjectURL(url));
	return image;
}

/**
 * Loads an image from a URL (including data URLs).
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = (err) => reject(err);
		image.src = url;
	});
}
