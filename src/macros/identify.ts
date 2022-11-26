import { IdleuhIdentifyApp } from '~src/apps/identify'

export function identify() {
    if (!game.user.isGM) {
        ui.notifications.warn('You not the GM yo!')
        return
    }

    const actors = game.actors as Actors<ActorPF2e>
    const items = actors.reduce((acc, actor) => {
        if (!actor.hasPlayerOwner) return acc
        const filtered = actor.items.filter(
            item => item.isOfType('physical') && !(item as PhysicalItemPF2e).isIdentified
        ) as PhysicalItemPF2e[]
        acc.push(...filtered)
        return acc
    }, [] as PhysicalItemPF2e[])

    new IdleuhIdentifyApp(items).render(true)
}
