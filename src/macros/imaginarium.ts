const packId = 'pf2e.spells-srd'
const bookId = 'Item.dcALVAyJbYSovzqt'

export async function ripImaginarium(actor: ActorPF2e) {
    if (!actor) return ui.notifications.warn('You must select an actor with the Imaginarium')

    const book = actor.itemTypes.equipment.find(x => x.getFlag('core', 'sourceId') === bookId)
    if (!book || book.system.equipped.carryType === 'dropped')
        return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession")

    const level = Math.floor(actor.level / 2)
    const pack = game.packs.get(packId)!
    const index = await pack.getIndex({ fields: ['system.level.value', 'system.traits', 'system.category.value'] })

    const spells = index.filter(
        x =>
            x.system.level.value === level &&
            !x.system.traits.value.includes('cantrip') &&
            x.system.category.value !== 'ritual' &&
            x.system.category.value !== 'focus' &&
            x.system.traits.rarity === 'common'
    )

    const roll = Math.floor(Math.random() * spells.length)
    const spell = spells[roll]
    const uuid = `Compendium.${packId}.${spell._id}`

    ChatMessage.create({
        content: `<p>Ripped the last page of the Imaginarium</p><p>@UUID[${uuid}]</p>`,
        speaker: ChatMessage.getSpeaker(actor),
    })
}
