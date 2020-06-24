import Dexie from 'dexie'

const DATABASE = 'chrome_extension_web_docs_helper'

const db = new Dexie(DATABASE)

db.version(1).stores({
  pages: '&url, cssCode, jsCode, notes, collapse'
})

export default db
