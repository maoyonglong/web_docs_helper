import Vue from 'vue'
import VMenu from './menu'
import {Popover, Button, Input, Dialog, Card} from 'element-ui'
import {contentOnMessage, setChromeStorage, getChromeStorage, isMatchedPage} from '../utils'
import {isShowMenuKey} from '../storageKeys'
import mavonEditor from 'mavon-editor'
// import 'element-ui/lib/theme-chalk/index.css'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Card)

let VApp

window.addEventListener('DOMContentLoaded', async () => {
  // 如果是禁用页面
  const isMatched = await isMatchedPage(window.location.href)
  if (!isMatched) return

  const el = document.createElement('div')
  el.id = 'v-app'
  document.body.appendChild(el)
  try {
    const items = await getChromeStorage({[isShowMenuKey]: true})
    VApp = new Vue({
      el: '#v-app',
      components: {
        VMenu
      },
      template: '<v-menu ref="menu" :isShowMenu="isShowMenu" @update:isShowMenu="setIsShowMenu" />',
      data: {
        isShowMenu: items[isShowMenuKey]
      },
      methods: {
        setIsShowMenu (value) {
          const menu = this.$refs.menu
          menu.closePopover()
          menu.closeDialog()
          this.isShowMenu = value
          return setChromeStorage({[isShowMenuKey]: value})
        }
      }
    })
  } catch (err) {}
})

contentOnMessage((request, sender, sendResponse) => {
  const {cmd, data} = request

  if (cmd === 'isShowMenuChange') {
    return VApp.setIsShowMenu(data).then(() => {
      sendResponse()
    })
  }
})
