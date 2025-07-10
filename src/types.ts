/**
 * Defines the settings for the Banner Generator plugin.
 */
export interface BannerGeneratorSettings {
	outputDirectory: string;
	fontSize: number;
	fontFamily: string;
	fontColor: string;
	margin: number;
	icon: string;
	iconMargin: number;
	bannerHeight: number;
	enableStroke: boolean;
	strokeColor: string;
	fontWeight: number;
}

/**
 * Default settings for the plugin.
 */
export const DEFAULT_SETTINGS: BannerGeneratorSettings = {
	outputDirectory: "banners",
	fontSize: 100,
	fontFamily: "sans-serif",
	fontColor: "#FFFFFF",
	margin: 20,
	icon: "✅",
	iconMargin: 10,
	bannerHeight: 50,
	enableStroke: false,
	strokeColor: "#000000",
	fontWeight: 400,
};
