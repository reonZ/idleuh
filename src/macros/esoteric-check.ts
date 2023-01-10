import { esotericCheckTitle, getEsotericSkill, hasDiverseLore } from './shared/esoteric'

export function esotericCheck(event: JQuery.TriggeredEvent, actor: ActorPF2e) {
    if (!actor || !actor.isOwner || !actor.isOfType('character')) {
        ui.notifications.warn('You must select a character token you own.')
        return
    }

    const skill = getEsotericSkill(actor)
    if (!skill) return

    const options = new Set<string>()
    const title = esotericCheckTitle()

    let flavor = `<h4 class="action">${title}</h4><section class="roll-note">Can be used to Recall Knowledge regarding haunts, curses 
and creatures of any type, but can't be used to Recall Knowledge of other topics.</section>`

    if (event.ctrlKey && hasDiverseLore(actor)) {
        options.add('diverse-lore')

        flavor += `<section class="roll-note"><strong>Diverse Lore</strong> You can take a -2 penalty to your check to Recall 
Knowledge about any topic, not just the usual topics available for Esoteric Lore.</section>`
    }

    game.pf2e.Check.roll(
        new game.pf2e.CheckModifier(flavor, skill),
        {
            actor,
            title,
            type: 'skill-check',
            rollMode: 'blindroll',
            options,
        },
        event
    )
}
