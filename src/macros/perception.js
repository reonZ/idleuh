const proficiency = ['untrained', 'trained', 'expert', 'master', 'legendary']

export async function groupPerception() {
    if (!game.user.isGM) {
        ui.notifications.warn('You not the GM yo!')
        return
    }

    let content = ''

    const party = game.actors.party
    const actors = party?.members ?? []

    await Promise.all(
        actors.map(async actor => {
            const roll = await actor.perception.roll({ createMessage: false })
            const die = roll.dice[0].total

            content += `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`
            content += `<span>${actor.name} (${proficiency[actor.perception.rank]})</span><span`
            if (die == 20) content += ' style="color: green;"'
            else if (die == 1) content += ' style="color: red;"'
            content += `>${roll.total}</span></div>`
        })
    )

    if (content) ChatMessage.create({ content, flavor: 'Group Perception Checks<hr>', whisper: [game.user.id] })
}
