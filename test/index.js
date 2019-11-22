/* globals describe, it, after */
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const methods = require('../lib')

const getResponsiveImages = methods.getResponsiveImages
const generateResponsiveImages = methods.generateResponsiveImages
const renameImagesToSize = methods.renameImagesToSize

const imgPath = path.join(__dirname, '../test/images/')

describe('generateResponsiveImage', function () {
  after(() => {
    const files = fs.readdirSync(imgPath)
      .filter((f) => f !== 'aileen.jpg')

    files.forEach((f) => fs.unlinkSync(path.join(imgPath, f)))
  })

  it('should generate some images', function () {
    this.timeout(5000)
    const configs = [
      { width: '20%', rename: { suffix: '@1x' } },
      { width: '40%', rename: { suffix: '@2x' } },
      { width: '60%', rename: { suffix: '@3x' } },
      { width: '80%', rename: { suffix: '@4x' } },
      { width: '100%', rename: { suffix: '@5x' } }
    ]

    return generateResponsiveImages([path.join(imgPath, 'aileen.jpg')], configs)
      .then(() => {
        const contents = fs.readdirSync(path.join(__dirname, '../test/images/')).filter((f) => f !== '.DS_Store')
        const expected = ['aileen.jpg', 'aileen@1x.jpg', 'aileen@2x.jpg', 'aileen@3x.jpg', 'aileen@4x.jpg', 'aileen@5x.jpg']

        assert.deepStrictEqual(contents, expected)
      })
  })

  it('should resolve with a correct set of images', function () {
    return getResponsiveImages(imgPath)
      .then((r) => {
        assert.deepStrictEqual(r, ['aileen@1x.jpg', 'aileen@2x.jpg', 'aileen@3x.jpg', 'aileen@4x.jpg', 'aileen@5x.jpg'])
      })
  })

  it('should rename some images', function () {
    this.timeout(8000)
    const pattern = /(?:.*)(@[0-9]{0,10}x)$/
    const files = fs.readdirSync(imgPath)
      .filter((f) => f !== '.DS_Store')
      .map((f) => `${imgPath}${f}`)

    return renameImagesToSize(files, pattern)
      .then(() => {
        const actual = fs.readdirSync(imgPath)
          .filter((f) => f !== '.DS_Store')
        const expected = ['aileen-120x.jpg', 'aileen-180x.jpg', 'aileen-240x.jpg', 'aileen-300x.jpg', 'aileen-60x.jpg', 'aileen.jpg']

        assert.deepStrictEqual(actual, expected)
      })
  })
})
