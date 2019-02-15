// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import Vuex from 'vuex'
// import store from './vuex/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import $ from 'jQuery'
import localhost from './util/localhost'

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.upToTop = function () {
  let dom = document.getElementById('el-main')
  dom.scrollTop = 0
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // store,
  router,
  components: { App },
  created () {
    let obj = {
      id: localStorage.getItem('id'),
      userToken: localStorage.getItem('token')
    }
    let href = location.href.split('#')[1]
    $.ajax({
      type: 'post',
      url: localhost + 'backstage/autoLogin',
      dataType: 'json',
      xhrFields: {withCredentials: true},
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: JSON.stringify(obj),
      success: (data) => {
        if (data.code === '200') {
          this.$router.replace(href)
        } else {
          this.$router.replace('/login')
        }
      }
    })
  },
  template: '<App/>'
})
