<template>
  <div class="wrapper">
    <div>
      <el-switch
        v-model="isShowMenu"
        :active-color="switchColor.active"
        :inactive-color="switchColor.inactive"
        inactive-text="开启/关闭菜单"
        @change="onIsShowMenuChange"
      >
      </el-switch>
    </div>
    <div class="btn-wrapper">
      <!-- <el-button class="btn" icon="el-icon-edit" @click="openNotesPages">查看所有笔记</el-button> -->
      <el-button classs="btn" icon="el-icon-setting" @click="openOptionsPage">选项设置</el-button>
    </div>
  </div>
</template>

<script>
import {sendMessageToContent, getChromeStorage} from '../../utils'
import {isShowMenuKey} from '../../storageKeys'
import {MessageBox} from 'element-ui'

function openChromePage (relativeUrl) {
  return new Promise(resolve => {
    var url = chrome.extension.getURL(relativeUrl)
    chrome.tabs.query({
      url
    }, function(tabs) {
      if (tabs.length)
        chrome.tabs.update(tabs[0].id, {active:true})
      else
        chrome.tabs.create({url})
      resolve()
    })
  })
}

export default {
  data () {
    return {
      // 是否显示悬浮菜单
      isShowMenu: true,
      switchColor: {
        active: '#13ce66',
        inactive: '#ff4949'
      }
    }
  },
  methods: {
    openNotesPages () {
      window.open('notes.html')
    },
    openOptionsPage () {
      openChromePage('options.html')
    },
    onIsShowMenuChange () {
      const isShowMenu = this.isShowMenu
      sendMessageToContent({
        cmd: 'isShowMenuChange',
        data: isShowMenu
      })
    }
  },
  created () {
    getChromeStorage({[isShowMenuKey]: true})
      .then(items => {
        this.isShowMenu = items[isShowMenuKey]
      })
  }
}
</script>

<style lang="scss">
.wrapper {
  min-width: 300px;
}
.input {
  margin-bottom: 10px;
}
.btn {
  font-size: 14px;
  margin: 10px;
  &-wrapper {
    padding: 10px;
  }
}
</style>