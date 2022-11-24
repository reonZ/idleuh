export const dcByLevel = new Map([
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

export const dcAdjustments = new Map([
    ['incredibly easy', -10],
    ['very easy', -5],
    ['easy', -2],
    ['normal', 0],
    ['hard', 2],
    ['very hard', 5],
    ['incredibly hard', 10],
])

/** @const */
export const MAGIC_TRADITIONS = /** @type {Set<MAGIC_TRADITIONS>} */ (new Set(['arcane', 'divine', 'occult', 'primal']))

/**
 *
 * @param {number} dc
 * @param {DCAdjustment} adjustment
 * @returns
 */
export function adjustDC(dc, adjustment = 'normal') {
    return dc + (dcAdjustments.get(adjustment) ?? 0)
}

/**
 * @param {Rarity} rarity
 * @returns {PositiveDCAdjustment}
 */
export function rarityToDCAdjustment(rarity = 'common') {
    if (rarity === 'uncommon') return 'hard'
    else if (rarity === 'rare') return 'very hard'
    else if (rarity === 'unique') return 'incredibly hard'
    else return 'normal'
}

/**
 * @param {number} dc
 * @param {Rarity} rarity
 * @returns
 */
export function adjustDCByRarity(dc, rarity = 'common') {
    return adjustDC(dc, rarityToDCAdjustment(rarity))
}

/**
 * @param {number} level
 * @param {DCOptions} options
 */
export function calculateDC(level, { proficiencyWithoutLevel = false, rarity = 'common' } = {}) {
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

/**
 * All cursed items are incredibly hard to identify
 * @param {PhysicalItemPF2e} item
 */
export function getDcRarity(item) {
    return item.traits.has('cursed') ? 'unique' : item.rarity
}

/**
 * Check if an element is present in the provided set. Especially useful for checking against literal sets
 * @template {Set<unknown>} T
 * @param {T} set
 * @param {unknown} value
 * @returns {value is SetElement<T>}
 */
export function setHasElement(set, value) {
    return set.has(value)
}

/**
 * Extract all traits from an item, that match a magic tradition
 * @param {PhysicalItemPF2e} item
 * @returns {Set<MAGIC_TRADITIONS>}
 */
function getMagicTraditions(item) {
    const traits = /** @type {string[]} */ (item.system.traits.value)
    return /** @type {Set<MAGIC_TRADITIONS>} */ (new Set(traits.filter(t => setHasElement(MAGIC_TRADITIONS, t))))
}

/**
 * @param {PhysicalItemPF2e} item
 * @param {number} baseDc
 * @param {number} notMatchingTraditionModifier
 */
export function identifyMagic(item, baseDc, notMatchingTraditionModifier) {
    const result = {
        occult: baseDc,
        primal: baseDc,
        divine: baseDc,
        arcane: baseDc,
    }
    const traditions = getMagicTraditions(item)
    for (const key of MAGIC_TRADITIONS) {
        // once an item has a magic tradition, all skills
        // that don't match the tradition are hard
        if (traditions.size > 0 && !traditions.has(key)) {
            result[key] = baseDc + notMatchingTraditionModifier
        }
    }
    return { arc: result.arcane, nat: result.primal, rel: result.divine, occ: result.occult }
}

/**
 * @param {PhysicalItemPF2e} item
 * @param {IdentifyItemOptions} options
 * @returns {Record<string, number>}
 */
export function identifyItem(item, { proficiencyWithoutLevel = false, notMatchingTraditionModifier }, noDC = false) {
    const baseDC = calculateDC(item.level, { proficiencyWithoutLevel })
    const rarity = getDcRarity(item)
    const dc = adjustDCByRarity(baseDC, rarity)
    if (item.isMagical) return identifyMagic(item, dc, notMatchingTraditionModifier)
    if (!noDC) return { cra: dc }
    if (item.isAlchemical) return { cra: dc }
    return { dc: dc }
}

/**
 * Check if a key is present in a given object in a type safe way
 *
 * @template {object} T
 * @param {T} obj The object to check
 * @param {unknown} key The key to check
 * @returns {key is keyof T}
 */
export function objectHasKey(obj, key) {
    return (typeof key === 'string' || typeof key === 'number') && key in obj
}
