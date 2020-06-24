<template>
  <div>
    <div class="v-menu-box" v-show="isShowMenu">
      <div class="v-menu-bar">
        <i class="el-icon-close" @click="onMenuClose"></i>
      </div>
      <div class="v-menu-content">
        <div>
          <el-popover :value="popover === 'api'" placement="left" width="200">
            <div class="wrapper">
              <el-input class="input" placeholder="switch selector" v-model="titleSelector"></el-input>
              <el-input class="input" placeholder="content selector" v-model="contentSelector"></el-input>
              <el-button @click="setCollapse">生成</el-button>
              <el-button @click="saveCollapse">保存</el-button>
            </div>
            <el-button class="popover-btn" slot="reference">API折叠</el-button>
          </el-popover>
        </div>
        <div>
          <el-popover :value="popover === 'note'" placement="left" width="200">
            <div class="wrapper">
              <el-button type="primary" @click="newNote">新建</el-button>
              <el-button type="success" @click="showDialog('lookNote')">查看</el-button>
            </div>
            <el-button class="popover-btn" slot="reference">笔记</el-button>
          </el-popover>
        </div>
        <div>
          <el-popover :value="popover === 'code'" placement="left" width="200">
            <div class="wrapper">
              <el-button type="primary" @click="showDialog('insertCss')">CSS</el-button>
              <el-button type="success" @click="showDialog('insertJs')">JS</el-button>
            </div>
            <el-button class="popover-btn" slot="reference">嵌入代码</el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <div>
      <el-dialog :close-on-click-modal="true" :visible="dialogVisible && dialog === 'editNote'" @update:visible="closeDialog">
        <mavon-editor v-model="editorValue" @save="editNote"/>
      </el-dialog>
      <el-dialog :visible="dialogVisible && dialog === 'lookNote'" @update:visible="closeDialog">
        <el-card class="card" v-for="(note, noteIdx) in notes" :key="noteIdx" @click="editNote">
          <div>
            <div class="note-abstract">
              {{note}}
            </div>
            <div>
              <el-button @click="lookNote(noteIdx)">查看</el-button>
              <el-button @click="delNote(noteIdx)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-dialog>
      <el-dialog :visible="dialogVisible && dialog === 'insertCss'" @update:visible="closeDialog">
        <el-input type="textarea" v-model="cssCode" :rows="10"></el-input>
        <el-button @click="insertCss">设置</el-button>
        <el-button @click="saveCss">保存</el-button>
      </el-dialog>
      <el-dialog :visible="dialogVisible && dialog === 'insertJs'" @update:visible="closeDialog">
        <el-input type="textarea" v-model="jsCode" :rows="10"></el-input>
        <el-button @click="insertJs">设置</el-button>
        <el-button @click="saveJs">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {insertCode, mixin} from '../utils'
import db from '../db'
import {MessageBox} from 'element-ui'

const LOCATION_HREF = window.location.href

let hasStored = false
let dexiePro = null

const defaultStoredData = {
  url: LOCATION_HREF,
  collapse: {
    titleSelector: '',
    contentSelector: ''
  },
  notes: [],
  cssCode: '',
  jsCode: ''
}

export default {
  props: {
    isShowMenu: Boolean
  },
  data() {
    return {
      titleSelector: "",
      contentSelector: "",
      dialog: '',
      editorValue: '',
      editorStored: false,
      editorIdx: 0,
      dialogVisible: false,
      popover: '',
      cssCode: '',
      jsCode: '',
      cssEl: null,
      jsEl: null,
      notes: []
    }
  },
  methods: {
    newNote () {
      this.editorIdx = this.notes.length - 1
      this.editorValue = ''
      this.showDialog('editNote')
    },
    editNote () {
      if (this.editorStored) {
        this.$set(this.notes, this.editorIdx, this.editorValue)
      } else {
        this.notes.push(this.editorValue)
      }
      const data = {
        notes: this.notes
      }
      dexiePro.then(() => {
        db.pages.update(LOCATION_HREF, data)
      })
    },
    lookNote (idx) {
      this.editorIdx = idx
      this.editorValue = this.notes[idx]
      this.showDialog('editNote')
    },
    delNote (idx) {
      MessageBox.confirm('确定删除？')
        .then(() => {
          this.notes.splice(idx, 1)
          const data = {
            notes: this.notes
          }
          db.pages.update(LOCATION_HREF, data)
        }).catch(() => {})
    },
    onMenuClose () {
      this.$emit('update:isShowMenu', false)
    },
    closePopover () {
      this.popover = ''
    },
    closeDialog () {
      this.dialogVisible = false
      this.dialog = ''
    },
    showDialog (value) {
      this.dialogVisible = true
      this.dialog = value
    },
    saveCollapse () {
      const data = {
        collapse: {
          titleSelector: this.titleSelector,
          contentSelector: this.contentSelector
        }
      }
      dexiePro.then(() => {
        if (hasStored) {
          db.pages.update(LOCATION_HREF, data)
        } else {
          db.pages.put(mixin(defaultStoredData, data))
          hasStored = true
        }
      })
    },
    setCollapse() {
      const {titleSelector, contentSelector} = this
      const titleDoms = document.querySelectorAll(titleSelector)
      const contentDoms = document.querySelectorAll(contentSelector)

      titleDoms.forEach((titleDom, titleIdx) => {
        const contentDom = contentDoms[titleIdx]
        const btnDom = document.createElement("button")
        let isInserted = false
        let collapse = true
        btnDom.innerText = collapse ? "展开" : "折叠"
        contentDom.style.display = "none"
        titleDom.addEventListener("mouseover", () => {
          if (!isInserted) {
            isInserted = true
            titleDom.appendChild(btnDom)
          } else {
            btnDom.style.display = "inline-block"
          }
        })
        titleDom.addEventListener("mouseout", () => {
          btnDom.style.display = "none"
        })
        btnDom.addEventListener("click", () => {
          collapse = !collapse
          btnDom.innerText = collapse ? "展开" : "折叠"
          contentDom.style.display = collapse ? "none" : "block"
        })
      })
    },
    insertCss () {
      if (this.cssEl) {
        this.cssEl.innerText = this.cssCode
      } else {
        insertCode(this.cssCode)
      }
    },
    saveCss () {
      const data = {
        cssCode: this.cssCode
      }
      dexiePro.then(() => {
        if (hasStored) {
          console.log('saveCss: ' + data)
          db.pages.update(LOCATION_HREF, data)
        } else {
          hasStored = true
          db.pages.put(mixin(defaultStoredData, data))
        }
      })
    },
    insertJs () {
      if (this.jsEl) {
        this.jsEl.innerText = this.jsCode
      } else {
        insertCode(this.jsCode, 'js', document.body)
      }
    },
    saveJs () {
      const data = {
        jsCode: this.jsCode
      }
      dexiePro.then(() => {
        if (hasStored) {
          db.pages.update(LOCATION_HREF, data)
        } else {
          hasStored = true
          db.pages.put(mixin(defaultStoredData, data))
        }
      })
    }
  },
  created () {
    dexiePro = db.pages.get({url: LOCATION_HREF})
      .then(data => {
        console.log(data)
        hasStored = !!data
        if (hasStored) {
          this.titleSelector = data.collapse ? (data.collapse.titleSelector || '') : ''
          this.contentSelector = data.collapse ? (data.collapse.contentSelector || '') : ''
          this.cssCode = data.cssCode
          this.jsCode = data.jsCode
          this.notes = data.notes
          this.editorStored = this.notes.length > 0
          if (jsCode) {
            this.insertJs()
          }
          if (cssCode) {
            this.insertCss()
          }
        }
      })
  }
}
</script>

<style scoped>
.v-menu-bar {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
  background-color: #000;
  color: #fff;
}
.v-menu-box {
  position: fixed;
  top: 30%;
  right: 10px;
  z-index: 10000;
  padding: 10px;
  background-color: #eeeeee;
}
.popover-btn {
  width: 100%;
}
/* .wrapper {
  min-width: 300px;
} */
.input {
  margin-bottom: 10px;
}
.card {
  margin-bottom: 10px;
}
</style>