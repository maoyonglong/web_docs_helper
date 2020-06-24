import Vue from 'vue'
import PageIndex from './pages/index'
// import 'element-ui/lib/theme-chalk/index.css'
import { Switch, Button } from 'element-ui'

Vue.use(Switch)
Vue.use(Button)

new Vue({
  el: '#app',
  components: {
    PageIndex
  },
  template: '<PageIndex />'
})
