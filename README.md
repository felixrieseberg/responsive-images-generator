### Responsive Images Generator
Let's say you need to generate some responsive images. Automatically. This package will help you do it. Greatly inspired by [gulp-responsive](https://github.com/mahnunchik/gulp-responsive), which reduced the time it took to build this down to a mere hours. If you're using Gulp, just go and use it.

```
npm install responsive-images-Generator
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

## License
MIT, Please see license for details.
