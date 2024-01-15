import { rollDamage } from './shared/damage'

const FEAT_UUID = 'Compendium.pf2e.feats-srd.Item.XJCsa3UbQtsKcqve'

export async function thermalNimbus(actor, token) {
    const item = actor?.itemTypes.feat.find(x => x.sourceId === FEAT_UUID)

    if (!item) {
        ui.notifications.warn('You need to select a kineticist with the <strong>Thermal Nimbus</strong> feat.')
        return
    }

    const formula = `${Math.floor(actor.level / 2)}[fire]`

    await rollDamage({ actor, token, item, formula })
}
