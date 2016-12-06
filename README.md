### Responsive Images Generator
[![Build Status](https://travis-ci.org/felixrieseberg/responsive-images-generator.svg?branch=master)](https://travis-ci.org/felixrieseberg/responsive-images-generator)
Let's say you need to generate some responsive images. Automatically. This package will help you do it. Greatly inspired by [gulp-responsive](https://github.com/mahnunchik/gulp-responsive), which reduced the time it took to build this down to a mere hours. The configuration object is basically the same. If you're using Gulp, just go and use it.

```
npm install responsive-images-generator
```

### Usage Example

#### Simple Scaling
Let's say you have two images `aileen.jpg` and `kevin.jpg` and want said images to be resized.

```
const configs = [
    {width: '20%', rename: {suffix: '@1x'}},
    {width: '40%', rename: {suffix: '@2x'}},
    {width: '60%', rename: {suffix: '@3x'}},
    {width: '80%', rename: {suffix: '@4x'}},
    {width: '100%', rename: {suffix: '@5x'}}
]
const images = [
  path.join(__dirname, 'aileen.jpg'),
  path.join(__dirname, 'kevin.jpg')
]

generateResponsiveImages(images, configs)
```

:mag: Output on disk will be:
```
aileen.jpg
aileen@1x.jpg
aileen@2x.jpg
aileen@3x.jpg
aileen@4x.jpg
aileen@5x.jpg
kevin.jpg
kevin@1x.jpg
kevin@2x.jpg
kevin@3x.jpg
kevin@4x.jpg
kevin@5x.jpg
```

### Renaming Images To Width
If you want to use your scaled images with a `srcset` (or something similar), you might need
to rename your images sensibly. Let's go and do that.

```
const pattern = /(?:.*)(@[0-9]{0,10}x)$/
const files = fs.readdirSync('/path/to/my/images')
  .filter((file) => file !== '.DS_Store')
  .map((file) => `/path/to/my/images/${file}`)

renameImagesToSize(files, pattern)
```

:mag: Output on disk will be:
```
aileen-120x.jpg
aileen-180x.jpg
aileen-240x.jpg
aileen-300x.jpg
aileen-60x.jpg
aileen.jpg
kevin-120x.jpg
kevin-180x.jpg
kevin-240x.jpg
kevin-300x.jpg
kevin-60x.jpg
kevin.jpg
```

### Configuration

Configuration unit is an object:

* **name**: *String* — filename glob pattern.
* **width**: *Number* or *String* — width in pixels or percentage of the original, not set by default.
* **height**: *Number* or *String* — height in pixels or percentage of the original, not set by default.
* [**withoutEnlargement**](http://sharp.dimens.io/en/stable/api/#withoutenlargement): *Boolean* — do not enlarge the output image, default `true`.
* **skipOnEnlargement**: *Boolean* — do not write an output image at all if the original image is smaller than the configured width or height, default `false`.
* [**min**](http://sharp.dimens.io/en/stable/api/#min): *Boolean* — preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to the `width` and `height` specified.
* [**max**](http://sharp.dimens.io/en/stable/api/#max): *Boolean* — resize to the max width or height the preserving aspect ratio (both `width` and `height` have to be defined), default `false`.
* [**quality**](http://sharp.dimens.io/en/stable/api/#qualityquality): *Number* — output quality for JPEG, WebP and TIFF, default `80`.
* [**progressive**](http://sharp.dimens.io/en/stable/api/#progressive): *Boolean* — progressive (interlace) scan for JPEG and PNG output, default `false`.
* [**withMetadata**](http://sharp.dimens.io/en/stable/api/#withmetadatametadata): *Boolean* — include image metadata, default `false`.
* [**compressionLevel**](http://sharp.dimens.io/en/stable/api/#compressionlevelcompressionlevel): *Number* — zlib compression level for PNG, default `6`.
* [**rename**](#renaming): *String*, *Object* or *Function* — renaming options, file will not be renamed by default. When `extname` is specified, output format is parsed from extension. You can override this autodetection with `format` option.
* [**format**](http://sharp.dimens.io/en/stable/api/#toformatformat): *String* — output format `jpeg`, `png`, `webp` or `raw`, default is `null`.
* [**crop**](http://sharp.dimens.io/en/stable/api/#cropgravity): Crop the resized image to the exact size specified, default is `false`.
* [**embed**](http://sharp.dimens.io/en/stable/api/#embed): Preserving aspect ratio, resize the image to the maximum `width` or `height` specified then `embed` on a `background` of the exact `width` and `height` specified, default is `false`.
* [**ignoreAspectRatio**](http://sharp.dimens.io/en/stable/api/#ignoreaspectratio): *Boolean* — Ignoring the aspect ratio of the input, stretch the image to the exact `width` and/or `height` provided via `resize`, default is `false`.
* [**interpolator**](http://sharp.dimens.io/en/stable/api/#resizewidth-height-options): *String* — The interpolator to use for image **enlargement**, defaulting to `bicubic`.
* [**kernel**](http://sharp.dimens.io/en/stable/api/#resizewidth-height-options): *String* — The kernel to use for image **reduction**, defaulting to `lanczos3`.
* [**background**](http://sharp.dimens.io/en/stable/api/#backgroundrgba): [*Color*](https://www.npmjs.com/package/color) — Set the background for the embed and flatten operations, '#default is `fff`'.
* [**flatten**](http://sharp.dimens.io/en/stable/api/#flatten): *Boolean* — Merge alpha transparency channel, if any, with `background`, default is `false`.
* [**negate**](http://sharp.dimens.io/en/stable/api/#negate): *Boolean* — Produces the "negative" of the image, default is `false`.
* [**rotate**](http://sharp.dimens.io/en/stable/api/#rotateangle): *Boolean* — Rotate the output image by either an explicit angle or auto-orient based on the EXIF `Orientation` tag, default is `false`.
* [**flip**](http://sharp.dimens.io/en/stable/api/#flip): *Boolean* — Flip the image about the vertical Y axis. This always occurs after rotation, if any. The use of `flip` implies the removal of the EXIF `Orientation` tag, if any. Default is `false`.
* [**flop**](http://sharp.dimens.io/en/stable/api/#flop): *Boolean* — Flop the image about the horizontal X axis. This always occurs after rotation, if any. The use of `flop` implies the removal of the EXIF `Orientation` tag, if any. Default is `false`.
* [**blur**](http://sharp.dimens.io/en/stable/api/#blursigma): *Boolean* — When used without parameters, performs a fast, mild blur of the output image. This typically reduces performance by 10%. Default is `false`.
* [**sharpen**](http://sharp.dimens.io/en/stable/api/#sharpensigma-flat-jagged): *Boolean* — When used without parameters, performs a fast, mild sharpen of the output image. This typically reduces performance by 10%. Default is `false`.
* [**threshold**](http://sharp.dimens.io/en/stable/api/#thresholdthreshold): *Number* or *Boolean* — Converts all pixels in the image to greyscale white or black, default is `false`.
* [**gamma**](http://sharp.dimens.io/en/stable/api/#gammagamma): *Boolean* — Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of `1/gamma` then increasing the encoding (brighten) post-resize at a factor of `gamma`. Default is `false`.
* [**grayscale**](http://sharp.dimens.io/en/stable/api/#grayscale-greyscale): *Boolean* — Convert to 8-bit greyscale; 256 shades of grey, default is `false`.
* [**normalize**](http://sharp.dimens.io/en/stable/api/#normalize-normalise): *Boolean* — Enhance output image contrast by stretching its luminance to cover the full dynamic range. This typically reduces performance by 30%. Default is `false`.
* [**tile**](http://sharp.dimens.io/en/stable/api/#tileoptions): *Boolean* or *Object* — The size and overlap, in pixels, of square Deep Zoom image pyramid tiles, default is `false`.
* [**withoutChromaSubsampling**](http://sharp.dimens.io/en/stable/api/#withoutchromasubsampling): *Boolean* — Disable the use of [chroma subsampling](http://en.wikipedia.org/wiki/Chroma_subsampling) with JPEG output (4:4:4), default is `false`.

Detailed description of each option can be found in the [sharp API documentation](http://sharp.dimens.io/en/stable/api/).

##### Renaming
Renaming is implemented by the [rename](https://www.npmjs.com/package/rename) module. Options correspond with options of [gulp-rename](https://www.npmjs.com/package/gulp-rename).

## License
MIT, Please see license for details.
Code taken from gulp-responsive MIT © [Evgeny Vlasenko](https://github.com/mahnunchik)