const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");

// Setting this conf up front allow us to use them in our
// functions

// Note: You do not need to add markdown-it to package.json.
let markdown = require("markdown-it")({
	html: true,
});

module.exports = function (eleventyConfig) {
	var conf = {
		dir: {
			input: "src/",
			output: "dist",
			includes: "_includes",
			layouts: "_layouts",
		},
		templateFormats: ["html", "md", "njk"],
		htmlTemplateEngine: "njk",

		// 1.1 Enable eleventy to pass dirs specified above
		passthroughFileCopy: true,
	};

	eleventyConfig.addNunjucksShortcode(
		"markdown",
		(content) => `${markdown.render(content)}`
	);

	eleventyConfig.addNunjucksAsyncShortcode("productPicture", async function (
		src,
		alt
	) {
		var src = "src" + src;
		var options = {
			// Optional: use falsy value to fall back to native image size
			widths: [221, 228, 284, 297, 324, 332, 375, 475],
			formats: ["jpeg"], // 'png', 'webp'
			urlPath: "/static/img/",
			outputDir: conf.dir.output + "/static/img/",
			cacheDuration: "15d",
		};
		if (alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on myResponsiveImage from: ${src}`);
		}
		const stats = await Image(src, options);
		const lowestSrc = stats.jpeg[0];
		const sizes =
			" (max-width: 257px) 221px," +
			"(max-width: 360px) 324px," +
			"(max-width: 411px) 375px," +
			"(max-width: 320px) 284px," +
			"(max-width: 667px) 297px," +
			"(max-width: 1023px) 475px," +
			"(max-width: 1024px) 228px," +
			"(max-width: 1440px) 332px," +
			"332px";
		// Iterate over formats and widths
		return `<picture>
      ${Object.values(stats)
				.map((imageFormat) => {
					return `  <source type="image/${
						imageFormat[0].format
					}" srcset="${imageFormat
						.map((entry) => `${entry.url} ${entry.width}w`)
						.join(", ")}" sizes="${sizes}">`;
				})
				.join("\n")}
        <img
          alt="${alt}"
          src="${lowestSrc.url}"
          class="h-64 object-cover w-full"
          >
      </picture>`;
	});

	// works also with addLiquidShortcode or addNunjucksAsyncShortcode
	eleventyConfig.addNunjucksAsyncShortcode("myResponsiveImage", function (
		src,
		options
	) {
		// returns Promise
		return Image(src, options);
	});

	// Folders to copy to build dir (See. 1.1)
	eleventyConfig.addPassthroughCopy("src/static");

	if (process.env.ELEVENTY_ENV === "production") {
		// Minify HTML (including inlined CSS and JS)
		eleventyConfig.addTransform("compressHTML", function (content, outputPath) {
			if (outputPath.endsWith(".html")) {
				const minified = htmlmin.minify(content, {
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true,
					minifyCSS: true,
					minifyJS: true,
				});
				return minified;
			}
			return content;
		});
	}

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, {
			zone: "utc",
		}).toFormat("yyyy-LL-dd");
	});

	// Add a filter to grab a youtube video id
	eleventyConfig.addNunjucksFilter("youtubeId", function (value) {
		// Return the ide as the first matching set of
		// characters not including / or & after watch?v= or
		// embed/
		return value.match(/(?:watch\?v=|embed\/)([^\/&]*)/)[1];
	});

	// Add YAML support for data files
	eleventyConfig.addDataExtension("yaml", (contents) =>
		yaml.safeLoad(contents)
	);

	// This allows Eleventy to watch for file changes during local development.
	eleventyConfig.setUseGitIgnore(false);

	function sortByPriceHighToLow(values) {
		const vals = [...values]; // this *seems* to prevent collection mutation...
		return vals.sort((b, a) => Math.sign(a.data.price - b.data.price));
	}

	eleventyConfig.addFilter("sortByPriceHighToLow", sortByPriceHighToLow);

	eleventyConfig.addNunjucksShortcode("currentYear", () => {
		const d = new Date();
		return JSON.stringify(d.getFullYear()); // Stringifying shouldn't be necessary?
	});

	return conf;
};
