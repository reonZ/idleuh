export function getEsotericSkill(actor) {
    const skillKeys = ['esoteric', 'esoteric-lore', 'lore-esoteric']
    const skill = Object.values(actor.skills).find(x => skillKeys.includes(x.slug))

    if (!skill) ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`)
    return skill
}
