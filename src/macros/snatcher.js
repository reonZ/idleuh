import { findItemWithSourceId } from '../module'

const FEAT_UUID = 'Compendium.pf2e.feats-srd.Item.40mZVDnIP5qBNhTH'

export function sandSnatcher(event, actor) {
    if (!actor?.isOfType('character')) {
        ui.notifications.warn('You need to select a character')
        return
    }

    const feat = findItemWithSourceId(actor, FEAT_UUID, ['feat'])
    if (!feat) {
        ui.notifications.warn('Your selected character needs to have the feat <strong>Sand Snatcher</strong>')
        return
    }

    const target = game.user.targets.first()?.actor

    actor.getStatistic('impulse').roll({
        event,
        label: 'Sand Snatcher - Grapple',
        target,
        dc: {
            slug: 'fortitude',
            label: 'Fortitude DC',
            value: target?.saves.fortitude.dc.value,
        },
        traits: ['attack', 'impulse', 'kineticist'],
        extraRollNotes: [
            {
                text: game.i18n.localize('PF2E.Actions.Grapple.Notes.criticalSuccess'),
                outcome: ['criticalSuccess'],
            },
            {
                text: game.i18n.localize('PF2E.Actions.Grapple.Notes.success'),
                outcome: ['success'],
            },
            {
                text: game.i18n.localize('PF2E.Actions.Grapple.Notes.failure'),
                outcome: ['failure'],
            },
            {
                text: game.i18n.localize('PF2E.Actions.Grapple.Notes.criticalFailure'),
                outcome: ['criticalFailure'],
            },
        ],
    })
}
