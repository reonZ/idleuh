import { findItemWithSourceId } from '@utils/foundry/item'
import { getDcByLevel } from '@utils/pf2e/dc'

const effectUUID = 'Compendium.idleuh.effects.jjFsfolNR04KzPVh'
const featUUID = 'Compendium.idleuh.feats.X3SZ0gTpBkGw3UGX'
const debuffUUID = 'Compendium.idleuh.effects.r0hicuQPY0OEAC6g'

export async function marshalInspiration(event: JQuery.TriggeredEvent, actor: ActorPF2e) {
    if (!actor || !actor.isOwner || !actor.isOfType('character')) {
        ui.notifications.warn('You must select a character token you own.')
        return
    }

    if (!findItemWithSourceId(actor as Actor, featUUID, ['feat'])) {
        ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.")
        return
    }

    if (findItemWithSourceId(actor as Actor, debuffUUID, ['effect'])) {
        ui.notifications.warn('This character cannot enter <strong>Inspiring Marshal Stance</strong>.')
        return
    }

    const dc = getDcByLevel(actor)
    const roll = (await actor.skills.diplomacy.roll({ createMessage: false }))!
    const result = roll.total
    const die = roll.dice[0]!.total!
    const success = getSuccess(result, die, dc)

    if (success >= 2) {
        await setEffect(actor, success)
    } else {
        await (await getEffect(actor))?.delete()
        if (success === 0) await setDebuff(actor)
    }

    createMsg(actor as Actor, success, result, die, dc)
}

function createMsg(actor: Actor, success: number, result: number, die: number, dc: number) {
    const by = result - dc
    const mod = result - die
    const css = success >= 3 ? 'criticalSuccess' : success === 2 ? 'success' : success === 1 ? 'failure' : 'criticalFailure'
    const txt = success >= 3 ? 'Critical Success' : success === 2 ? 'Success' : success === 1 ? 'Failure' : 'Critical Failure'

    let flavor = `<h4 class="action"><span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <p class="compact-text">(Diplomacy Check)</p></h4>
    <div class="target-dc-result">
        <div class="target-dc"><span data-whose="target">Standard DC ${dc}</span></div>
        <div class="result degree-of-success">
            Result: <span title="Roll: ${result} ${mod >= 0 ? '+' : '-'} ${Math.abs(mod)}">${result}</span> 
            <span data-whose="self" class="${css}">${txt}</span> <span data-whose="target">by ${by >= 0 ? '+' : ''}${by}</span>
        </div>
    </div>`

    flavor += '<section class="roll-note">'

    if (success === 3) {
        flavor += `<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and 
grants you and allies a +1 status bonus to attack rolls and saves against mental effects.`
    } else if (success === 2) {
        flavor += `<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to 
attack rolls and saves against mental effects.`
    } else if (success === 1) {
        flavor += `<strong>Failure</strong> You fail to enter the stance.`
    } else {
        flavor += `<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute.`
    }

    flavor += '</section>'

    ChatMessage.create({ flavor, speaker: ChatMessage.getSpeaker({ actor }) })
}

function getSuccess(result: number, die: number, dc: number) {
    let success = result >= dc + 10 ? 3 : result >= dc ? 2 : result > dc - 10 ? 1 : 0
    if (die === 20) success++
    else if (die === 1) success--
    return Math.clamped(success, 0, 3)
}

async function setDebuff(actor: CharacterPF2e) {
    const effect = await fromUuid<EffectPF2e>(debuffUUID)
    if (!effect) return
    await actor.createEmbeddedDocuments('Item', [effect.toObject()])
}

async function setEffect(actor: CharacterPF2e, success: number) {
    const radius = success === 3 ? 20 : 10
    const existing = await getEffect(actor)

    if (existing) {
        const rules = deepClone(existing._source.system.rules)
        const rule = rules.find(rule => rule.key === 'ChoiceSet') as ChoiceSetSource
        if (rule.selection === radius) return

        rule.selection = radius
        existing.update({ 'system.rules': rules })
        return
    }

    const effect = await fromUuid<EffectPF2e>(effectUUID)
    if (!effect) return

    const source = effect.toObject()
    const rule = source.system.rules.find(rule => rule.key === 'ChoiceSet') as ChoiceSetRuleElement

    rule.selection = radius
    await actor.createEmbeddedDocuments('Item', [source])
}

async function getEffect(actor: CharacterPF2e) {
    return findItemWithSourceId(actor as Actor, effectUUID, ['effect']) as EffectPF2e | undefined
}
