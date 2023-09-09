export const MODULE_ID = 'idleuh'

export function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

export function socketOn(callback) {
    game.socket.on(`module.${MODULE_ID}`, callback)
}

export function socketEmit(packet) {
    game.socket.emit(`module.${MODULE_ID}`, packet)
}

export function templatePath(...path) {
    path = path.filter(x => typeof x === 'string')
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

export function chatUUID(uuid, name) {
    if (name) return `@UUID[${uuid}]{${name}}`
    return `@UUID[${uuid}]`
}

function getItemSourceIdCondition(sourceId) {
    return Array.isArray(sourceId) ? item => includesSourceId(item, sourceId) : item => getSourceId(item) === sourceId
}

export function getItems(actor, itemTypes) {
    return itemTypes ? itemTypes.flatMap(type => actor.itemTypes[type]) : actor.items
}

export function findItemWithSourceId(actor, sourceId, itemTypes) {
    return getItems(actor, itemTypes).find(getItemSourceIdCondition(sourceId))
}

export function getSourceId(doc) {
    return doc.getFlag('core', 'sourceId')
}

export function includesSourceId(doc, list) {
    const sourceId = getSourceId(doc)
    return sourceId ? list.includes(sourceId) : false
}

export function hasItemWithSourceId(actor, sourceId, itemTypes) {
    return getItems(actor, itemTypes).some(getItemSourceIdCondition(sourceId))
}
