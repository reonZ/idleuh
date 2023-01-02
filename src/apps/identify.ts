import { templatePath } from '~src/@utils/foundry/path'
import { objectHasKey } from '~src/@utils/object'
import { identifyItem } from '~src/@utils/pf2e'

export class IdleuhIdentifyApp extends Application {
    items: PhysicalItemPF2e[]

    constructor(items: PhysicalItemPF2e[], options?: Partial<ApplicationOptions>) {
        super(options)
        this.items = items
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'idleuh-identify',
            title: 'Identify Items',
            template: templatePath('identify.html'),
            width: 500,
        })
    }

    getData(options?: Partial<ApplicationOptions> | undefined) {
        return mergeObject(super.getData(options), {
            items: this.items.map(item => {
                const data = item.system.identification.identified
                const identified = item.isIdentified
                const checked = !identified && (item.getFlag('world', 'identify.checked') as boolean)

                const classes = [] as string[]
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

    activateListeners(html: JQuery<HTMLElement>) {
        // super.activateListeners(html)

        html.find('[data-action="chat"]').on('click', this.#onChat.bind(this))
        html.find('[data-action="checks"]').on('click', this.#onChecks.bind(this))
        html.find('[data-action="identify"]').on('click', this.#onIdentify.bind(this))
        html.find('[data-action="remove"]').on('click', this.#onRemove.bind(this))
        html.find('[data-action="reset"]').on('click', this.#onReset.bind(this))
    }

    async #onChat(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        const item = await getItemFromEvent(event)
        item?.toMessage(undefined, { create: true })
    }

    async #onChecks(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        const item = await getItemFromEvent(event)
        if (!item) return

        const itemImg = item.system.identification.unidentified.img
        const itemName = item.system.identification.unidentified.name
        const identifiedName = item.system.identification.identified.name

        const notMatchingTraditionModifier = game.settings.get('pf2e', 'identifyMagicNotMatchingTraditionModifier') as number
        const proficiencyWithoutLevel = game.settings.get('pf2e', 'proficiencyVariant') === 'ProficiencyWithoutLevel'
        const dcs = identifyItem(item, { proficiencyWithoutLevel, notMatchingTraditionModifier })

        const skills = Object.entries(dcs)
            .filter(([shortForm, dc]) => Number.isInteger(dc) && objectHasKey(CONFIG.PF2E.skills, shortForm))
            .map(([shortForm, dc]) => ({
                shortForm,
                dc,
                name: game.i18n.localize(CONFIG.PF2E.skills[shortForm as keyof typeof CONFIG.PF2E.skills]),
            }))

        const content = await renderTemplate('systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs', {
            itemImg,
            itemName,
            identifiedName,
            skills,
        })

        await ChatMessage.create({ user: game.user.id, content })
    }

    async #onIdentify(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        const item = await getItemFromEvent(event)
        if (!item) return

        await item.update({
            'system.identification.status': item.isIdentified ? 'unidentified' : 'identified',
            'system.identification.unidentified': item.getMystifiedData('unidentified'),
            'flags.world.identify.checked': false,
        })

        this.render()
    }

    async #onRemove(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        const item = await getItemFromEvent(event)
        if (!item) return

        const checked = item.getFlag('world', 'identify.checked')
        await item.setFlag('world', 'identify.checked', !checked)

        this.render()
    }

    async #onReset(event: JQuery.ClickEvent) {
        event.preventDefault()

        for (const item of this.items) {
            if (item.isIdentified || !item.getFlag('world', 'identify.checked')) continue
            await item.setFlag('world', 'identify.checked', false)
        }

        this.render()
    }
}

async function getItemFromEvent(event: JQuery.TriggeredEvent<any, any, HTMLElement>) {
    const parent = $(event.currentTarget).closest('[data-item]')
    const uuid = parent.attr('data-item') as string
    const item = await fromUuid(uuid)
    if (!item) parent.remove()
    return item as PhysicalItemPF2e | null
}
