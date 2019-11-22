'use strict'

function mergeConfig (config) {
  var defaultConfig = {
    crop: false,
    embed: false,
    min: false,
    max: false,
    withoutEnlargement: true,
    skipOnEnlargement: false,
    ignoreAspectRatio: false,
    kernel: 'lanczos3',
    extractBeforeResize: false,
    extractAfterResize: false,
    background: '#fff',
    flatten: false,
    negate: false,
    rotate: false,
    flip: false,
    flop: false,
    blur: false,
    sharpen: false,
    threshold: false,
    gamma: false,
    grayscale: false,
    normalize: false,
    quality: 80,
    progressive: false,
    withMetadata: false,
    tile: false,
    withoutChromaSubsampling: false,
    compressionLevel: 6,
    format: null
  }

  return Object.assign({}, defaultConfig, config)
}

module.exports = mergeConfig
