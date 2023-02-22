import { Identify } from '@apps/identify'

export function identify() {
    if (!game.user.isGM) {
        ui.notifications.warn('You not the GM yo!')
        return
    }

    const actors = game.actors
    const items = actors.reduce((acc, actor) => {
        if (!actor.hasPlayerOwner) return acc
        const filtered = actor.items.filter(item => item.isOfType('physical') && !item.isIdentified) as PhysicalItemPF2e[]
        acc.push(...filtered)
        return acc
    }, [] as PhysicalItemPF2e[])

    new Identify(items).render(true)
}
