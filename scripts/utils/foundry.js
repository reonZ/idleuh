import MODULE_ID from './module.js'

export function getCurrentModule() {
    return /** @type {Module} */ (game.modules.get(MODULE_ID))
}

/** @param {...string} path */
export function templatePath(...path) {
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

/**
 * @param {foundry.Document} document
 * @param {string} key
 * @param {string[]} keys
 */
export function getFlag(document, key, ...keys) {
    keys.unshift(key)
    return document.getFlag(MODULE_ID, keys.join('.'))
}

/**
 * @template {foundry.Document} T
 * @param {T} document
 * @param {string} key
 * @param {any} value
 * @returns T
 */
export function setFlag(document, key, value) {
    return document.setFlag(MODULE_ID, key, value)
}
