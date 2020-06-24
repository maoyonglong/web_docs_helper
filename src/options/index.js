import Vue from 'vue'
import PageIndex from './pages/index'
// import 'element-ui/lib/theme-chalk/index.css'
import { Input, Button } from 'element-ui'

Vue.use(Input)
Vue.use(Button)

new Vue({
  el: '#app',
  components: {
    PageIndex
  },
  template: '<PageIndex />'
})
