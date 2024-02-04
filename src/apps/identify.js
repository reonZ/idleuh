import { templatePath } from '../module'
import { getItemIdentificationDCs } from '../pf2e'
import * as R from 'remeda'

export class Identify extends Application {
    constructor(items, options) {
        super(options)
        this.items = items
    }

    static get defaultOptions() {
        return mergeObject(Application.defaultOptions, {
            id: 'idleuh-identify',
            title: 'Identify Items',
            template: templatePath('identify.html'),
            width: 500,
        })
    }

    getData(options) {
        return mergeObject(super.getData(options), {
            items: this.items.map(item => {
                const data = item.system.identification.identified
                const identified = item.isIdentified
                const checked = !identified && item.getFlag('world', 'identify.checked')

                const classes = []
                if (identified) classes.push('identified')
                if (checked) classes.push('checked')

                return {
                    uuid: item.uuid,
                    img: data.img,
                    name: item.isOfType('treasure') ? `($) ${data.name}` : data.name,
                    css: classes.join(' '),
                    identified,
                    checked,
                }
            }),
        })
    }

    activateListeners(html) {
        html.find('[data-action="chat"]').on('click', this.#onChat.bind(this))
        html.find('[data-action="checks"]').on('click', this.#onChecks.bind(this))
        html.find('[data-action="identify"]').on('click', this.#onIdentify.bind(this))
        html.find('[data-action="remove"]').on('click', this.#onRemove.bind(this))
        html.find('[data-action="reset"]').on('click', this.#onReset.bind(this))
    }

    async #onChat(event) {
        const item = await getItemFromEvent(event)
        item?.toMessage(undefined, { create: true })
    }

    async #onChecks(event) {
        const item = await getItemFromEvent(event)
        const identifiedName = item.system.identification.identified.name
        const dcs = getItemIdentificationDCs(item, {
            pwol: game.pf2e.settings.variants.pwol.enabled,
            notMatchingTraditionModifier: game.settings.get('pf2e', 'identifyMagicNotMatchingTraditionModifier'),
        })
        const action = item.isMagical ? 'identify-magic' : item.isAlchemical ? 'identify-alchemy' : null

        const content = await renderTemplate('systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs', {
            identifiedName,
            action,
            skills: R.omit(dcs, ['dc']),
            unidentified: item.system.identification.unidentified,
            uuid: item.uuid,
        })

        await ChatMessage.implementation.create({ user: game.user.id, content })
    }

    async #onIdentify(event) {
        const item = await getItemFromEvent(event)
        if (!item) return
        await item.setIdentificationStatus(item.isIdentified ? 'unidentified' : 'identified')
        this.render()
    }

    async #onRemove(event) {
        const item = await getItemFromEvent(event)
        if (!item) return

        const checked = item.getFlag('world', 'identify.checked')
        await item.setFlag('world', 'identify.checked', !checked)

        this.render()
    }

    async #onReset(event) {
        event.preventDefault()

        for (const item of this.items) {
            if (item.isIdentified || !item.getFlag('world', 'identify.checked')) continue
            await item.setFlag('world', 'identify.checked', false)
        }

        this.render()
    }
}

async function getItemFromEvent(event) {
    const parent = $(event.currentTarget).closest('[data-item]')
    const uuid = parent.attr('data-item')
    const item = await fromUuid(uuid)
    if (!item) parent.remove()
    return item
}
