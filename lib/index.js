'use strict'

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const debug = require('debug')('responsive-images-creator')

const mergeConfig = require('./config')
const generate = require('./generate')

/**
 * Generates responsive images for a list of files,
 * according to specified configuration and options
 *
 * @param {Array} files
 * @param {Object} configs
 * @param {Object} options
 * @returns {Promise}
 */
function generateResponsiveImages (files, configs, options) {
  const promises = []

  files.forEach((file) => {
    configs.forEach((config) => {
      promises.push(generate(file, mergeConfig(config), options))
    })
  })

  return Promise.all(promises)
}

/**
 * Gets all files in a directory that are scaled
 * (aka named @2x, @3x, @4x, etc)
 *
 * @param {String} directory
 * @returns {Promise}
 */
function getResponsiveImages (directory) {
  return new Promise((resolve, reject) => {
    const nameMatch = /(?:.*)(@[0-9]{0,10}x)\.[A-Za-z]{0,5}$/

    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err)
      }

      resolve(files.filter((f) => nameMatch.test(f)))
    })
  })
}

/**
 * Generates responsive images for a list of files,
 * according to specified configuration and options
 *
 * @param {Array} files
 * @param {RegExp} pattern - Regexp to replace with
 * @returns {Promise}
 */
function renameImagesToSize (files, pattern) {
  const promises = []

  files.forEach((file) => {
    promises.push(renameImageToSize(file, pattern))
  })

  return Promise.all(promises)
}

/**
 * Renames an image according to it's own width.
 * Example input:    myimage@4x.png
 * Example output:   myimage-1246x.png
 *
 * @param {String} input - Path to the image
 * @param {RegExp} pattern - Regexp to replace with
 * @returns {Promise}
 */
function renameImageToSize (input, pattern) {
  return new Promise((resolve, reject) => {
    const imagePath = path.parse(input)
    const image = sharp(input)

    if (!image) {
      return reject(new Error('Unable to open image file'))
    }

    if (!pattern) {
      return reject(new Error('Pattern missing'))
    }

    image
      .metadata()
      .then((metadata) => {
        const newNamePortion = `-${metadata.width}x`
        const execResult = pattern.exec(imagePath.name)
        const renamePortion = execResult && execResult.length > 0 ? execResult[1] : null

        if (!renamePortion) {
          debug((`Pattern did not match file ${input}, not doing anything for this file`))
          resolve()
        }

        const newName = imagePath.name.replace(renamePortion, newNamePortion)
        const newPath = Object.assign({}, imagePath, { name: newName, base: `${newName}${imagePath.ext}` })

        fs.rename(path.format(imagePath), path.format(newPath), (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(path.format(newPath))
          }
        })
      })
  })
}

module.exports = {
  getResponsiveImages: getResponsiveImages,
  renameImageToSize: renameImageToSize,
  renameImagesToSize: renameImagesToSize,
  generateResponsiveImages: generateResponsiveImages
}
