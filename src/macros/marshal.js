import { findItemWithSourceId } from '../module'
import { getDcByLevel } from '../pf2e'

const effectUUID = 'Compendium.idleuh.effects.Item.jjFsfolNR04KzPVh'
const featUUID = 'Compendium.idleuh.feats.Item.X3SZ0gTpBkGw3UGX'
const debuffUUID = 'Compendium.idleuh.effects.Item.r0hicuQPY0OEAC6g'

export async function marshalInspiration(event, actor) {
    if (!actor || !actor.isOwner || !actor.isOfType('character')) {
        ui.notifications.warn('You must select a character token you own.')
        return
    }

    if (!findItemWithSourceId(actor, featUUID, ['feat'])) {
        ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.")
        return
    }

    if (findItemWithSourceId(actor, debuffUUID, ['effect'])) {
        ui.notifications.warn('This character cannot enter <strong>Inspiring Marshal Stance</strong>.')
        return
    }

    const dc = getDcByLevel(actor)

    const roll = await actor.skills.diplomacy.roll({
        dc: { value: dc },
        rollMode: 'roll',
        label: '<span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <span>(Diplomacy Check)</span>',
        extraRollNotes: [
            {
                outcome: ['criticalFailure'],
                text: `<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute.`,
            },
            {
                outcome: ['failure'],
                text: `<strong>Failure</strong> You fail to enter the stance.`,
            },
            {
                outcome: ['success'],
                text: `<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to attack rolls and saves against mental effects.`,
            },
            {
                outcome: ['criticalSuccess'],
                text: `<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and grants you and allies a +1 status bonus to attack rolls and saves against mental effects.`,
            },
        ],
    })

    const success = roll.degreeOfSuccess

    if (success >= 2) {
        await setEffect(actor, success)
    } else {
        await (await getEffect(actor))?.delete()
        if (success === 0) await setDebuff(actor)
    }
}

async function setDebuff(actor) {
    const effect = await fromUuid(debuffUUID)
    if (!effect) return
    await actor.createEmbeddedDocuments('Item', [effect.toObject()])
}

async function setEffect(actor, success) {
    const radius = success === 3 ? 20 : 10
    const existing = await getEffect(actor)

    if (existing) {
        const rules = deepClone(existing._source.system.rules)
        const rule = rules.find(rule => rule.key === 'ChoiceSet')
        if (rule.selection === radius) return

        rule.selection = radius
        existing.update({ 'system.rules': rules })
        return
    }

    const effect = await fromUuid(effectUUID)
    if (!effect) return

    const source = effect.toObject()
    const rule = source.system.rules.find(rule => rule.key === 'ChoiceSet')

    rule.selection = radius
    await actor.createEmbeddedDocuments('Item', [source])
}

async function getEffect(actor) {
    return findItemWithSourceId(actor, effectUUID, ['effect'])
}
