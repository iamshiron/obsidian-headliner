# **Obsidian Headliner**

A simple Obsidian plugin to generate custom banners and header images for your notes directly within your vault.

✨ **Features:**

* Create banners from background images.
* Add custom text and icons (emojis or images).
* Customize fonts, colors, and styles.
* Automatically organizes banners into folders based on your note titles.

## **How it Works**

The plugin uses an HTML \<canvas\> element to dynamically generate banner images. Here's a breakdown of the process:

1. **User Input**: When you run the "Generate Banner" command, a modal window appears asking for banner text, a background image, and an optional icon.
2. **Image Loading**: The background and icon images are loaded into the browser. If you don't provide a custom icon, the default emoji from the settings is rendered onto a temporary canvas and used as an image.
3. **Canvas Drawing**:
   * A high-resolution (2x supersampled) canvas is created in memory.
   * The background image is drawn onto the canvas. It's cropped vertically based on the "Banner Height" setting to ensure the banner has the correct dimensions.
   * The icon (if any) and the banner text are drawn on top of the background.
   * The canvas is then downscaled to its final size, which provides anti-aliasing for sharper text and graphics.
4. **File Saving**:
   * The final canvas content is converted into a PNG image.
   * The plugin creates a subfolder within your specified "Output Directory" named after the current note's title (e.g., banners/my-cool-note/).
   * The generated PNG is saved into this subfolder with a filename derived from the first word of your banner text and a timestamp (e.g., project\_1678886400000.png).
5. **Insertion**: A Markdown link to the newly created banner image is inserted at your cursor's position in the active note.

## **How to Use**

1. Open a note in Obsidian.
2. Open the command palette (Ctrl/Cmd \+ P).
3. Search for "Generate Banner" and run the command.
4. Fill in the details in the modal:
   * **Banner Text**: The text you want to display.
   * **Reference Image**: The background image for your banner.
   * **Icon (Optional)**: An image or SVG to place before the text.
5. Click "Generate".
6. The banner will be created and a link to it will be inserted into your note.

## **Settings**

You can configure the default appearance of your banners in the plugin settings:

* **Output Directory**: The main folder where all banners will be saved.
* **Font Size/Family/Weight/Color**: Customize the appearance of the banner text.
* **Margin**: The space around the text and icon.
* **Default Icon**: An emoji or character to use if no custom icon is provided.
* **Icon Margin**: The space between the icon and the text.
* **Banner Height**: The vertical position (as a percentage) from which to crop the background image.
* **Enable/Color for Text Stroke**: Add an outline to the text for better visibility.

## **Contributing**

Contributions are welcome\! If you have ideas for new features or have found a bug, please open an issue or submit a pull request on the GitHub repository.

## **License**

This plugin is released under the MIT License.
