const proficiency = ['trained', 'expert', 'master', 'legendary', 'untrained']

export async function groupPerception() {
    if (!game.user.isGM) {
        ui.notifications.warn('You not the GM yo!')
        return
    }

    let result = '<hr>'

    const tokens = /** @type {TokenLayerPF2e} */ (canvas.tokens)
    for (const token of tokens.placeables) {
        const actor = token.actor
        if (!actor || !actor.hasPlayerOwner || !actor.attributes.perception) continue
        result += await rollPerception(actor)
    }

    ChatMessage.create({ content: result, flavor: 'Group Perception Checks', whisper: [game.user.id] })
}

/** @param {ActorPF2e} actor */
async function rollPerception(actor) {
    const perception = actor.attributes.perception
    const check = new game.pf2e.CheckModifier('', perception)
    const roll = await game.pf2e.Check.roll(check, { actor: actor, type: 'skill-check', createMessage: false })
    if (!roll) return ''

    const rank = proficiency[(perception.rank ?? 1) - 1]
    const die = roll.dice[0].total
    if (die === undefined) return ''

    let result = `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`
    result += `<span>${actor.name} (${rank})</span><span`
    if (die == 20) result += ' style="color: green;"'
    else if (die == 1) result += ' style="color: red;"'

    return `${result}>${roll.total}</span></div>`
}
