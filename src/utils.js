export function sendMessageToContent(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response)
    })
  })
}

/**
 * 
 * @param {*} listener function (request, sender, sendResponse) 
 */
export function contentOnMessage(listener) {
  chrome.runtime.onMessage.addListener(listener)
}

export function getChromeStorage(data, isSync = true) {
  const storage = isSync ? chrome.storage.sync : chrome.storage.local
  return new Promise(resolve => {
    storage.get(data, resolve)
  })
}

export function setChromeStorage(data, isSync = true) {
  const storage = isSync ? chrome.storage.sync : chrome.storage.local
  return new Promise(resolve => {
    storage.set(data, resolve)
  })
}

export function insertCode(code, kind = 'css', parent = document.head) {
  const tag = document.createElement(kind === 'css' ? 'style' : 'script')
  tag.innerText = code
  return parent.appendChild(tag)
}

export async function isMatchedPage(url) {
  const data = await getChromeStorage({ includes: [], excludes: [] })
  const { includes, excludes } = data

  const inIncludes = includes.indexOf(url) >= 0
  const inExcludes = excludes.indexOf(url) >= 0
  const isIncludesEmpty = includes.length === 0
  const isExcludesEmpty = excludes.length === 0

  if (isIncludesEmpty) {
    return !inExcludes
  }

  if (isExcludesEmpty) {
    return inIncludes
  }

  if (!inIncludes) {
    return false
  }

  return inIncludes && !inExcludes
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !value instanceof Array
}

export function mixin(target, source) {
  for (const key in source) {
    const val = source[key]
    if (isPlainObject(val) && isPlainObject(target[key])) {
      mixin(val, source)
    } else {
      target[key] = val
    }
  }
  return target
}

export function throttle(func, wait = 200, type = 2) {
  let previous = 0, timeout

  return function () {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()

      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}