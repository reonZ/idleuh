import { findItemWithSourceId } from '../module'

const FEAT_UUID = 'Compendium.pf2e.classfeatures.Item.jyCEC3eC4B6YaGoy'
const EFFECT_UUID = 'Compendium.idleuh.effects.Item.9IapmSGjH0hDaVMv'

const PHYSICAL_TYPES = ['bludgeoning', 'slashing', 'piercing']
const TYPES = ['fire', 'earth', ...PHYSICAL_TYPES]

export async function extractElement(event, actor) {
    if (!actor?.isOfType('character')) {
        ui.notifications.warn('You need to select a character')
        return
    }

    const feat = findItemWithSourceId(actor, FEAT_UUID, ['feat'])
    if (!feat) {
        ui.notifications.warn('Your selected character needs to have the feat <strong>Extract Element</strong>')
        return
    }

    const targetToken = game.user.targets.first()
    const targetActor = targetToken?.actor
    if (!targetActor || targetActor === actor) {
        ui.notifications.warn('You need to target another actor')
        return
    }

    const existing = findItemWithSourceId(targetActor, EFFECT_UUID, ['effect'])
    if (existing) {
        ui.notifications.warn("Your target's elements have already been extracted")
        return
    }

    const saveRoll = await targetActor.saves.fortitude.roll({
        event,
        label: 'Fortitude Save - Extract Element',
        dc: {
            slug: 'class',
            label: 'Kineticist DC',
            value: actor.classDC.dc.value,
        },
    })

    if (saveRoll.degreeOfSuccess > 2) return

    const source = (await fromUuid(EFFECT_UUID))?.toObject()
    const rules = source.system.rules

    source.flags.core.sourceId = EFFECT_UUID

    const warnings = {}

    rules.push({
        key: 'Immunity',
        mode: 'remove',
        type: TYPES.slice(),
        predicate: ['origin:effect:kinetic-aura'],
    })

    let hasEarth = false
    const resistances = targetActor.attributes.resistances.filter(({ type }) => TYPES.includes(type))
    for (const { type, value, exceptions, doubleVs } of resistances) {
        if (type === 'earth') {
            hasEarth = {
                value,
                exceptions,
            }
        } else {
            rules.push({
                key: 'Weakness',
                type,
                value,
                exceptions,
                predicate: ['origin:effect:kinetic-aura'],
            })
        }

        if (doubleVs.length) warnings.doubleVs = true
    }

    if (hasEarth) {
        for (const type of PHYSICAL_TYPES) {
            rules.push({
                key: 'Weakness',
                type,
                value: hasEarth.value,
                exceptions: hasEarth.exceptions,
                predicate: ['origin:effect:kinetic-aura'],
            })
        }
    }

    targetActor.createEmbeddedDocuments('Item', [source])

    const notes = []
    if (warnings.doubleVs) {
        notes.push(
            `The creature has some resistances that are doubled versus criticals, this can't be automated and will have to be manually handled by the GM.`
        )
    }

    const formula = `${Math.floor((actor.level - feat.level) / 2)}d4`
    const DamageRoll = CONFIG.Dice.rolls.find(Roll => Roll.name === 'DamageRoll')
    const damageRoll = await new DamageRoll(formula).evaluate({ async: true })

    let flavor = `
<h4 class="action">
    <strong>Extract Element</strong>
    <span class="action-glyph">1</span>
</h4>
<div class="target-dc-result" data-tooltip-class="pf2e" data-tooltip-direction="UP">
    <div class="target-dc"><span data-visibility="all" data-whose="target">Target: ${targetActor.name}</span></div>
</div>
`

    notes.forEach(note => (flavor += `<p>${note}</p>`))

    damageRoll.toMessage({
        flavor,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flags: {
            pf2e: {
                context: {
                    target: {
                        token: targetToken.document.uuid,
                        actor: targetActor.uuid,
                    },
                },
            },
        },
    })

    console.log({ saveRoll, damageRoll, source })
}
