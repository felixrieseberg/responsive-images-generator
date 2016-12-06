'use strict'

const sharp = require('sharp')
const path = require('path')
const rename = require('rename')
const size = require('./size')
const format = require('./format')
const debug = require('debug')('responsive-images-creator')

function generateResponsiveImage (filePath, config, options) {
  return new Promise((resolve, reject) => {
    const msgPrefix = `File ${filePath}: `
    const image = sharp(filePath)
    const filePathObj = path.parse(filePath)

    image.metadata((err, metadata) => {
      if (err) return reject(err)

      let width, height, extract, toFormat

      if (config.rename) {
        filePath = path.join(filePathObj.base, rename(path.relative(filePathObj.base, filePath), config.rename))
      }

      if (config.format) {
        toFormat = config.format
      } else {
        toFormat = format(filePath)
      }

      try {
        width = size(config.width, metadata.width)
        height = size(config.height, metadata.height)
      } catch (err) {
        return reject(err)
      }

      if (width || height) {
        if (config.withoutEnlargement && (width > metadata.width || height > metadata.height)) {
          let message = `${msgPrefix} Image enlargement is detected`

          if (width) {
            message += `\n  real width: ${metadata.width}px, required width: ${width}px`
          }

          if (height) {
            message += `\n  real height: ${metadata.height}px, required height: ${height}px`
          }

          if (options.errorOnEnlargement) {
            reject(message)
          } else if (config.skipOnEnlargement) {
            if (!options.silent) {
              debug(`${msgPrefix} : (skip for processing)`)
            }

            // passing a null file to the callback stops a new image being added to the pipeline for this config
            return resolve(null)
          }

          if (!options.silent) {
            debug(`${msgPrefix} : (skip for enlargement)`)
          }
        }
      }

      try {
        if (config.extractBeforeResize) {
          extract = config.extractBeforeResize
          image.extract(extract.top, extract.left, extract.width, extract.height)
        }

        image.resize(width, height, {
          interpolator: config.interpolator,
          kernel: config.kernel
        })

        if (config.extractAfterResize) {
          extract = config.extractAfterResize
          image.extract(extract.top, extract.left, extract.width, extract.height)
        }

        if (config.crop !== false) {
          image.crop(config.crop)
        }

        if (config.embed) {
          image.embed()
        }

        if (config.max) {
          image.max()
        }

        if (config.min) {
          image.min()
        }

        if (config.ignoreAspectRatio) {
          image.ignoreAspectRatio()
        }

        image.withoutEnlargement(config.withoutEnlargement)
        image.background(config.background)
        image.flatten(config.flatten)
        image.negate(config.negate)

        if (config.rotate !== false) {
          if (typeof config.rotate === 'boolean') {
            image.rotate()
          } else {
            image.rotate(config.rotate)
          }
        }

        image.flip(config.flip)
        image.flop(config.flop)
        image.blur(config.blur)

        if (typeof config.sharpen === 'boolean') {
          image.sharpen(config.sharpen)
        } else {
          image.sharpen(config.sharpen.sigma, config.sharpen.flat, config.sharpen.jagged)
        }

        image.threshold(config.threshold)

        if (config.gamma !== false) {
          if (typeof config.gamma === 'boolean') {
            image.gamma()
          } else {
            image.gamma(config.gamma)
          }
        }

        image.grayscale(config.grayscale)
        image.normalize(config.normalize)
        image.quality(config.quality)
        image.progressive(config.progressive)
        image.withMetadata(config.withMetadata)
        image.tile(config.tile)
        image.withoutChromaSubsampling(config.withoutChromaSubsampling)
        image.compressionLevel(config.compressionLevel)

        image.toFormat(toFormat)
      } catch (err) {
        err.file = filePath
        return reject(err)
      }

      image.toFile(filePath, (err) => {
        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  })
}

module.exports = generateResponsiveImage
