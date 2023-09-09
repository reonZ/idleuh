import { getEsotericSkill } from './shared/esoteric'

export function esotericCheck(event, actor) {
    if (!actor || !actor.isOwner || !actor.isOfType('character')) {
        ui.notifications.warn('You must select a character token you own.')
        return
    }

    const skill = getEsotericSkill(actor)
    if (!skill) return

    const extraRollOptions = new Set()

    const extraRollNotes = [
        {
            text: `Can be used to Recall Knowledge regarding haunts, curses 
    and creatures of any type, but can't be used to Recall Knowledge of other topics.`,
        },
    ]

    skill.roll({
        rollMode: 'blindroll',
        extraRollNotes,
        options: extraRollOptions,
    })
}
