import { rollDamage } from './shared/damage'

const effectName = '<strong>Spike Skin</strong> effect'

const EFFECT_UUID = 'Compendium.idleuh.effects.Item.aJWj25WLTiG67a1y'
const FEAT_UUID = 'Compendium.pf2e.feats-srd.Item.9p28s0zg4Vv4r5i2'

function getEffect(actor) {
    return actor?.itemTypes.effect.find(x => x.sourceId === EFFECT_UUID)
}

function effectMissing() {
    ui.notifications.warn(`You need to select an actor with the ${effectName}.`)
}

export async function spikeSkinDuration(actor) {
    const effect = getEffect(actor)

    if (!effect) return effectMissing()

    const remaining = effect.system.duration.value
    if (remaining <= 0) {
        ui.notifications.warn(`The ${effectName} is already expired on the selected actor.`)
        return
    }

    await effect.update({ 'system.duration.value': Math.max(0, remaining - 1) })
    ui.notifications.info(`The ${effectName} duration has been reduced by 1 minute.`)
}

export async function spikeSkinDamage(actor, token) {
    const effect = getEffect(actor)

    if (!effect) return effectMissing()

    const item = await fromUuid(FEAT_UUID)
    const formula = `${Math.floor((actor.level - 8) / 2) * 2 + 2}[piercing]`

    await rollDamage({ actor, token, item, formula })
}
