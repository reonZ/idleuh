const diverseUUID = 'Compendium.pf2e.feats-srd.KlqKpeq5OmTRxVHb'

export function getEsotericSkill(actor: CharacterPF2e) {
    const skillKeys = ['esoteric', 'esoteric-lore', 'lore-esoteric']
    const skill = Object.values(actor.skills).find(x => skillKeys.includes(x!.slug))

    if (!skill) ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`)
    return skill
}

export function esotericCheckTitle() {
    return game.i18n.format('PF2E.SkillCheckWithName', { skillName: 'Esoteric' })
}

export function hasDiverseLore(actor: CharacterPF2e) {
    return actor.itemTypes.feat.some(x => x.getFlag('core', 'sourceId') === diverseUUID)
}
