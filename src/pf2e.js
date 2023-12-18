const MAGIC_TRADITIONS = new Set(['arcane', 'divine', 'occult', 'primal'])

export function getItemIdentificationDCs(item, { proficiencyWithoutLevel = false, notMatchingTraditionModifier }) {
    const baseDC = calculateDC(item.level, { proficiencyWithoutLevel })
    const rarity = getDcRarity(item)
    const dc = adjustDCByRarity(baseDC, rarity)
    if (item.isMagical) {
        return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier)
    } else if (item.isAlchemical) {
        return { crafting: dc }
    } else {
        return { dc: dc }
    }
}

function setHasElement(set, value) {
    return set.has(value)
}

function getMagicTraditions(item) {
    const traits = item.system.traits.value
    return new Set(traits.filter(t => setHasElement(MAGIC_TRADITIONS, t)))
}

function getIdentifyMagicDCs(item, baseDC, notMatchingTraditionModifier) {
    const result = {
        occult: baseDC,
        primal: baseDC,
        divine: baseDC,
        arcane: baseDC,
    }
    const traditions = getMagicTraditions(item)
    for (const key of MAGIC_TRADITIONS) {
        // once an item has a magic tradition, all skills
        // that don't match the tradition are hard
        if (traditions.size > 0 && !traditions.has(key)) {
            result[key] = baseDC + notMatchingTraditionModifier
        }
    }
    return { arcana: result.arcane, nature: result.primal, religion: result.divine, occultism: result.occult }
}

function getDcRarity(item) {
    return item.traits.has('cursed') ? 'unique' : item.rarity
}

const dcByLevel = new Map([
    [-1, 13],
    [0, 14],
    [1, 15],
    [2, 16],
    [3, 18],
    [4, 19],
    [5, 20],
    [6, 22],
    [7, 23],
    [8, 24],
    [9, 26],
    [10, 27],
    [11, 28],
    [12, 30],
    [13, 31],
    [14, 32],
    [15, 34],
    [16, 35],
    [17, 36],
    [18, 38],
    [19, 39],
    [20, 40],
    [21, 42],
    [22, 44],
    [23, 46],
    [24, 48],
    [25, 50],
])

const dcAdjustments = new Map([
    ['incredibly-easy', -10],
    ['very-easy', -5],
    ['easy', -2],
    ['normal', 0],
    ['hard', 2],
    ['very-hard', 5],
    ['incredibly-hard', 10],
])

function rarityToDCAdjustment(rarity = 'common') {
    switch (rarity) {
        case 'uncommon':
            return 'hard'
        case 'rare':
            return 'very-hard'
        case 'unique':
            return 'incredibly-hard'
        default:
            return 'normal'
    }
}

function adjustDC(dc, adjustment = 'normal') {
    return dc + (dcAdjustments.get(adjustment) ?? 0)
}

function adjustDCByRarity(dc, rarity = 'common') {
    return adjustDC(dc, rarityToDCAdjustment(rarity))
}

function calculateDC(level, { proficiencyWithoutLevel, rarity = 'common' } = {}) {
    const pwlSetting = game.settings.get('pf2e', 'proficiencyVariant')
    proficiencyWithoutLevel ??= pwlSetting === 'ProficiencyWithoutLevel'

    // assume level 0 if garbage comes in. We cast level to number because the backing data may actually have it
    // stored as a string, which we can't catch at compile time
    const dc = dcByLevel.get(level) ?? 14
    if (proficiencyWithoutLevel) {
        // -1 shouldn't be subtracted since it's just
        // a creature level and not related to PC levels
        return adjustDCByRarity(dc - Math.max(level, 0), rarity)
    } else {
        return adjustDCByRarity(dc, rarity)
    }
}

export function getDcByLevel(actor) {
    const level = Math.clamped(actor.level, -1, 25)
    return dcByLevel.get(level)
}

const scrollCompendiumIds = {
    1: 'RjuupS9xyXDLgyIr', // Compendium.pf2e.equipment-srd.Item.RjuupS9xyXDLgyIr
    2: 'Y7UD64foDbDMV9sx',
    3: 'ZmefGBXGJF3CFDbn',
    4: 'QSQZJ5BC3DeHv153',
    5: 'tjLvRWklAylFhBHQ',
    6: '4sGIy77COooxhQuC',
    7: 'fomEZZ4MxVVK3uVu',
    8: 'iPki3yuoucnj7bIt',
    9: 'cFHomF3tty8Wi1e5',
    10: 'o1XIHJ4MJyroAHfF',
}

const scrolls = []

export async function createSpellScroll(uuid, level, temp = false) {
    const spell = await fromUuid(uuid)
    if (!spell) return null

    if (level === false) level = spell.system.level.value

    const scrollUUID = `Compendium.pf2e.equipment-srd.Item.${scrollCompendiumIds[level]}`
    scrolls[level] ??= await fromUuid(scrollUUID)

    const scrollSource = scrolls[level]?.toObject()
    if (!scrollSource) return null

    const traits = scrollSource.system.traits
    traits.value = Array.from(new Set([...traits.value, ...spell.traits]))
    traits.rarity = spell.rarity
    if (traits.value.includes('magical') && traits.value.some(trait => MAGIC_TRADITIONS.has(trait))) {
        traits.value.splice(traits.value.indexOf('magical'), 1)
    }
    traits.value.sort()

    scrollSource._id = null
    scrollSource.name = game.i18n.format('PF2E.Item.Physical.FromSpell.Scroll', { name: spell.name, level })

    const description = scrollSource.system.description.value
    scrollSource.system.description.value = (() => {
        const paragraphElement = document.createElement('p')
        paragraphElement.append(spell.sourceId ? `@UUID[${spell.sourceId}]{${spell.name}}` : spell.description)

        const containerElement = document.createElement('div')
        const hrElement = document.createElement('hr')
        containerElement.append(paragraphElement, hrElement)
        hrElement.insertAdjacentHTML('afterend', description)

        return containerElement.innerHTML
    })()

    scrollSource.system.temporary = temp
    scrollSource.system.spell = spell.clone({ 'system.location.heightenedLevel': level }).toObject()

    return scrollSource
}
