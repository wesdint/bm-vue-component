'use strict'

import BMWeek from './components/Week.vue'
import BMRegion from './components/Region.vue'
import VueTouch from 'vue-touch'

function install (Vue, options = {}) {
  Vue.use(VueTouch)
  Vue.component('BMWeek', BMWeek)
  Vue.component('BMRegion', BMRegion)
}

export default install

if (typeof module === 'object' && module.exports) {
  module.exports.install = install
}