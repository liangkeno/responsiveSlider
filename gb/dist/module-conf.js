'use strict';

module.exports = {
  creator: 'liangkeno',
  app: 'keno',
  common: 'gb',
  module: 'gb',
  moduleId: '7f77fa60-54b2-11e6-8415-0f32ade646d3',
  description: '公共模块',
  support : {
    csslint: {
      enable: true
    },
    jslint: {
      enable: true
    },
    imagemin: { // 图片压缩的配置
      exclude: [] // 图片压缩排除的图片
    },
    autoprefixer: { // 自动前缀的配置
      pc: [
      	'last 3 versions',
      	'Explorer >= 8',
      	'Chrome >= 21',
        'Firefox >= 1',
        'Edge 13'
      ],
      mobile: [
      	'Android >= 4',
      	'iOS >= 6'
      ]
    },
    px2rem: {
      enable: false,
      root_value: 40,
      unit_precision: 5,
      prop_white_list: [],
      selector_black_list: [],
      replace: true,
      media_query: false
    },
    fontcompress : {
      enable: false
    },
    csssprite: {
      enable: true,
      retina: false,
      rootvalue: 0
    }
  }
};
