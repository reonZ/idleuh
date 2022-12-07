export function esotericCheck(event: JQuery.TriggeredEvent, actor: ActorPF2e) {
    const targets = game.user.targets as Set<TokenPF2e>
    const [target] = targets

    if (!actor || !actor.isOwner || !actor.isOfType('character') || targets.size !== 1 || !target.actor) {
        ui.notifications.warn('You must select a character token you own and target another one.')
        return
    }

    const skillKeys = ['esoteric', 'esoteric-lore', 'lore-esoteric']
    const skill = Object.values(actor.system.skills).find(x => skillKeys.includes(x.slug))

    if (!skill) {
        ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`)
        return
    }

    const skillName = skill.label
    const actionSlug = 'action:recall-knowledge'
    const actionName = game.i18n.localize('PF2E.RecallKnowledge.Label')

    const DCbyLevel = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50]

    const targetLevel = target.actor.system.details.level.value
    const DC = targetLevel < 0 ? 13 : DCbyLevel[targetLevel]

    const options = actor.getRollOptions(['all', 'skill-check', skillName.toLowerCase()])
    options.push(`action:${actionSlug}`)
    options.push(`secret`)

    const dv = /** @type {Array<{type: String, value: number}>} */ target.actor.system.traits.dv
    const vulnerability = dv.reduce((prev, curr) => {
        if (curr.value > prev) return curr.value
        return prev
    }, 0)

    const v = vulnerability ? ` ${vulnerability}` : ''
    const uuid = '@UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]'
    const success = game.i18n.localize('PF2E.Check.Result.Degree.Check.success')
    const failure = game.i18n.localize('PF2E.Check.Result.Degree.Check.failure')
    const criticalFailure = game.i18n.localize('PF2E.Check.Result.Degree.Check.criticalFailure')

    let content = `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName}</p>`
    content += `<p><strong>${success}</strong> ${uuid}{Effect: Exploit Vulnerability${v}}</p>`
    content += `<p><strong>${failure}</strong> ${uuid}</p>`
    content += `<p><strong>${criticalFailure}</strong> @UUID[Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg]</p>`

    game.pf2e.Check.roll(
        new game.pf2e.CheckModifier(content, skill),
        {
            actor,
            target: { actor: target.actor, token: target.document },
            title: game.i18n.format('PF2E.SkillCheckWithName', { skillName }),
            type: 'skill-check',
            options,
            dc: { value: DC },
        },
        event
    )
}
