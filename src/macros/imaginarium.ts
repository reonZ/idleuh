import { createSpellScroll } from '@utils/pf2e/spell'

const packId = 'pf2e.spells-srd'
const bookId = 'Item.dcALVAyJbYSovzqt'

export async function ripImaginarium(actor: ActorPF2e) {
    if (!actor) return ui.notifications.warn('You must select an actor with the Imaginarium')

    const book = actor.itemTypes.equipment.find(x => x.getFlag('core', 'sourceId') === bookId)
    if (!book || book.system.equipped.carryType === 'dropped')
        return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession")

    const level = Math.floor(actor.level / 2) as OneToTen
    const pack = game.packs.get(packId)!
    const index = await pack.getIndex({ fields: ['system.level.value', 'system.traits', 'system.category.value'] })

    const spells = index.filter(
        x =>
            x.system.level.value <= level &&
            !x.system.traits.value.includes('cantrip') &&
            x.system.category.value !== 'ritual' &&
            x.system.category.value !== 'focus' &&
            x.system.traits.rarity === 'common'
    )

    const roll = Math.floor(Math.random() * spells.length)
    const spell = spells[roll]
    const uuid = `Compendium.${packId}.${spell._id}` as ItemUUID

    let messageUUID = uuid
    let extraMessage = ''
    const scroll = await createSpellScroll(uuid, level)
    if (scroll) {
        scroll.name = scroll.name + ' *'
        const [item] = (await actor.createEmbeddedDocuments('Item', [scroll])) as ItemPF2e[]
        extraMessage = ' and received the following:'
        messageUUID = item.uuid
    }

    ChatMessage.create({
        content: `<p>Ripped the last page of the Imaginarium${extraMessage}</p><p>@UUID[${messageUUID}]</p>`,
        speaker: ChatMessage.getSpeaker({ actor: actor as Actor }),
    })
}
