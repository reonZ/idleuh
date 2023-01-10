import { AuraRadiusApp } from '~src/apps/aura-radius'

export async function auraRadius(actor: ActorPF2e) {
    if (!actor || !actor.isOwner) {
        ui.notifications.warn('You must select a token you own.')
        return
    }

    const hasAuras = actor.itemTypes.effect.some(x => x.rules.some(y => y.key === 'Aura'))

    if (!hasAuras) {
        ui.notifications.warn("This actor doesn't have any aura.")
        return
    }

    new AuraRadiusApp(actor).render(true)
}
