<template>
  <div>
    <div class="content">
      <div>
        <h1>启用插件的页面</h1>
        <div class="item" v-for="(include, includeIdx) in includes" :key="includeIdx">
          <el-input placeholder="includes e.g. example1.com, example2.com..." v-model="includes[includeIdx]"></el-input>
          <div class="item-opera">
            <el-button @click="saveOptions">保存</el-button>
            <el-button @click="addItem('includes', includeIdx)">添加</el-button>
            <el-button @click="delItem('includes', includeIdx)">删除</el-button>
          </div>
        </div>
        <div class="item-opera" v-if="includes.length === 0">
          <el-button @click="addItem('includes', 0)">添加</el-button>
          <el-button @click="delItem('includes', 0)">删除</el-button>
        </div>
      </div>
      <div>
        <h1>禁用插件的页面</h1>
        <div class="item" v-for="(exclude, excludeIdx) in excludes" :key="excludeIdx">
          <el-input placeholder="excludes e.g. example1.com, example2.com..." v-model="excludes[excludeIdx]"></el-input>
          <div class="item-opera">
            <el-button @click="saveOptions">保存</el-button>
            <el-button @click="addItem('excludes', excludeIdx)">添加</el-button>
            <el-button @click="delItem('excludes', excludeIdx)">删除</el-button>
          </div>
        </div>
        <div class="item-opera" v-if="excludes.length === 0">
          <el-button @click="addItem('excludes', 0)">添加</el-button>
          <el-button @click="delItem('excludes', 0)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {setChromeStorage, getChromeStorage, throttle} from '../../utils'
import { MessageBox } from 'element-ui'

export default {
  data () {
    return {
      includes: [],
      excludes: []
    }
  },
  methods: {
    addItem (urlsText, urlIdx) {
      const url = this[urlsText]
      url.splice(urlIdx, 0, '')
    },
    delItem (urlsText, urlIdx) {
      MessageBox.confirm('确认删除？')
        .then(() => {
          const url = this[urlsText]
          url.splice(urlIdx, 1)
          this.saveOptions()
        }).catch(() => {})
    },
    saveOptions () {
      const includes = this.includes
      const excludes = this.excludes

      setChromeStorage({includes, excludes})
    }
  },
  created () {
    getChromeStorage({includes: [], excludes: []})
      .then(data => {
        this.includes = data.includes
        this.excludes = data.excludes
      })
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  &-opera {
    display: flex;
  }
}
</style>