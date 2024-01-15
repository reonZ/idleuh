export async function rollDamage({ actor, token, item, formula }) {
    const DamageRoll = CONFIG.Dice.rolls.find(x => x.name === 'DamageRoll')
    const roll = await new DamageRoll(formula).evaluate({ async: true })
    const traits = Array.from(item.traits)
    const context = {
        type: 'damage-roll',
        sourceType: 'attack',
        actor: actor.id,
        token: token?.id,
        target: null,
        domains: [],
        options: [traits, actor.getRollOptions(), item.getRollOptions('item')].flat(),
        mapIncreases: undefined,
        notes: [],
        secret: false,
        rollMode: 'roll',
        traits,
        skipDialog: false,
        outcome: null,
        unadjustedOutcome: null,
    }

    let flavor = `<h4 class="action"><strong>${item.name}</strong></h4>`
    flavor += '<div class="tags" data-tooltip-class="pf2e">'
    flavor += traits
        .map(tag => {
            const label = game.i18n.localize(CONFIG.PF2E.actionTraits[tag])
            const tooltip = CONFIG.PF2E.traitsDescriptions[tag]
            return `<span class="tag" data-trait="${tag}" data-tooltip="${tooltip}">${label}</span>`
        })
        .join('')
    flavor += '</div><hr>'

    return roll.toMessage({
        flavor,
        speaker: ChatMessage.implementation.getSpeaker({ actor: actor, token: token }),
        flags: {
            pf2e: {
                context,
                origin: item.getOriginData(),
            },
        },
    })
}
