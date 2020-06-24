if (!window.indexedDB) {
  throw new Error('[chrome-extension: web_docs_helper]: this extension need indexdb.')
}