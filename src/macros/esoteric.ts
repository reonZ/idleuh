export function esotericCheck(event: JQuery.TriggeredEvent, actor: ActorPF2e) {
    const targets = game.user.targets as unknown as Set<TokenDocumentPF2e>
    const [target] = targets

    if (!actor || !actor.isOwner || !actor.isOfType('character') || targets.size !== 1 || !target.actor) {
        ui.notifications.warn('You must select a character token you own and target another one.')
        return
    }

    const skillName = 'Esoteric'
    const skillKey = 'esoteric'
    const actionSlug = 'action:recall-knowledge'
    const actionName = 'Recall Knowledge'

    if (!(skillKey in actor.system.skills)) {
        ui.notifications.warn(`This character doesn't have the '${skillName}' skill`)
        return
    }

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
    const link = `@UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]{Effect: Exploit Vulnerability${v}}`

    game.pf2e.Check.roll(
        new game.pf2e.CheckModifier(
            `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName} Skill Check</p><p><strong>Success</strong> ${link}</p><p><strong>Failure</strong> @UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]{Effect: Exploit Vulnerability}</p><p><strong>Critical Failure</strong> @UUID[Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg]{Flat-Footed}</p>`,
            actor.system.skills[skillKey as SkillAbbreviation]
        ),
        {
            actor,
            title: game.i18n.format('PF2E.SkillCheckWithName', { skillName }),
            type: 'skill-check',
            options,
            dc: { value: DC },
        },
        event
    )
}
