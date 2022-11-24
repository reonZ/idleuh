import { setFlag, templatePath } from '../utils/foundry.js'
import { identifyItem, objectHasKey } from '../utils/pf2e.js'

const BUTTON_DISABLED = 'color: grey; text-shadow: none;'

function getItems() {
    const actors = /** @type {Actors<ActorPF2e>} */ (game.actors)
    return actors.reduce((acc, actor) => {
        if (actor.hasPlayerOwner) acc.push(...actor.items.filter(item => item.isOfType('physical') && !item.isIdentified))
        return acc
    }, /** @type {ItemPF2e[]} */ ([]))
}

/**
 * @param {ItemPF2e} item
 * @param {boolean} checked
 */
function formatName(item, checked) {
    const identified = item.system.identification.identified
    let name = item.isOfType('treasure') ? '($) ' : ''
    name += identified.name
    name = checked ? `<strike>${name}</strike>` : name
    return name
}

/** @param {JQuery.MouseEnterEvent} event */
function onMouseEnter(event) {
    event.currentTarget.style.backgroundColor = '#0000001f'
}

/** @param {JQuery.MouseLeaveEvent} event */
function onMouseLeave(event) {
    event.currentTarget.style.backgroundColor = 'transparent'
}

/** @param {JQuery.TriggeredEvent<any, any, HTMLElement>} event */
async function getItemFromEvent(event) {
    const $item = $(event.currentTarget).closest('[data-type="item"]')
    const uuid = /** @type {string} */ ($item.attr('data-uuid'))
    const item = /** @type {PhysicalItemPF2e | null} */ (await fromUuid(uuid))
    return item?.identificationStatus === 'identified' ? { item: null, $item } : { item, $item }
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
async function onRemove(event) {
    const { item, $item } = await getItemFromEvent(event)
    if (!item) return $item.remove()

    const $remove = $(/** @type {HTMLElement} */ (event.currentTarget.firstChild))
    const checked = item.getFlag('world', 'identify.checked')

    $item.find('[data-type="name"]').html(formatName(item, !checked))

    $remove.toggleClass('fa-square-minus fa-square-plus')

    $item
        .find('[data-type="checks"], [data-type="identify"]')
        .attr('style', checked ? '' : BUTTON_DISABLED)
        .toggleClass('disabled')

    await item.setFlag('world', 'identify.checked', !checked)
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
async function onCheck(event) {
    if (event.currentTarget.classList.contains('disabled')) return

    const { item, $item } = await getItemFromEvent(event)
    if (!item) return $item.remove()

    const itemImg = item.system.identification.unidentified.img
    const itemName = item.system.identification.unidentified.name
    const identifiedName = item.system.identification.identified.name
    const notMatchingTraditionModifier = game.settings.get('pf2e', 'identifyMagicNotMatchingTraditionModifier')
    const proficiencyWithoutLevel = game.settings.get('pf2e', 'proficiencyVariant') === 'ProficiencyWithoutLevel'
    const dcs = identifyItem(item, { proficiencyWithoutLevel, notMatchingTraditionModifier })

    const skills = Object.entries(dcs)
        .filter(([shortForm, dc]) => Number.isInteger(dc) && objectHasKey(CONFIG.PF2E.skills, shortForm))
        .map(([shortForm, dc]) => ({
            shortForm,
            dc,
            name: game.i18n.localize(CONFIG.PF2E.skills[shortForm]),
        }))

    console.log(skills)

    const content = await renderTemplate('systems/pf2e/templates/actors/identify-item-chat-skill-checks.html', {
        itemImg,
        itemName,
        identifiedName,
        skills,
    })

    await ChatMessage.create({ user: game.user.id, content })
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
async function onIdentify(event) {
    if (event.currentTarget.classList.contains('disabled')) return

    const { item, $item } = await getItemFromEvent(event)
    if (!item) return $item.remove()

    await item.update({
        'system.identification.status': 'identified',
        'system.identification.unidentified': item.getMystifiedData('unidentified'),
        'flags.world.identify.checked': false,
    })

    item.toMessage(undefined, { create: true })
    $item.remove()
}

/**
 * @param {JQuery.ClickEvent} event
 * @param {ItemPF2e[]} items
 */
async function onReset(event, items) {
    event.preventDefault()

    for (const item of items) {
        if (getProperty(item, 'flags.world.identify.checked') !== true) continue
        await item.setFlag('world', 'identify.checked', false)
    }

    const $items = $(event.currentTarget).closest('.dialog-content').find('[data-type="item"]')
    $items.find('strike').contents().unwrap()
    $items.find('a').removeClass('disabled').attr('style', '')
    $items.find('.fa-square-plus').toggleClass('fa-square-plus fa-square-minus')
}

export async function identify() {
    const rawItems = getItems()
    const items = rawItems.map(item => {
        const identified = item.system.identification.identified
        const checked = item.getFlag('world', 'identify.checked')

        return {
            uuid: item.uuid,
            img: identified.img,
            name: formatName(item, checked),
            disabled: checked ? `class="disabled" style="${BUTTON_DISABLED}"` : '',
            remove: checked ? 'plus' : 'minus',
        }
    })

    new Dialog({
        title: 'Identify Items',
        buttons: {},
        content: await renderTemplate(templatePath('identify.html'), { items }),
        render: $html => {
            $html.find('[data-type="item"]').on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave)
            $html.find('[data-type="remove"]').on('click', onRemove)
            $html.find('[data-type="checks"]').on('click', onCheck)
            $html.find('[data-type="identify"]').on('click', onIdentify)
            $html.find('button').on('click', event => onReset(event, rawItems))
        },
    }).render(true, { width: 500 })
}

// async function reset() {
//     const confirm = await Dialog.confirm({
//         title: 'Reset Day',
//         content: 'All the items that were removed for the day will appear once again in the list.',
//         defaultYes: true,
//     })
//     if (!confirm) return
//     for (const item of items) await item.setFlag('world', 'identify.checked', false)
//     dialog?.close()
//     createDialog()
// }
