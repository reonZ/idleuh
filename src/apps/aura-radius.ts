import { templatePath } from '~src/@utils/foundry/path'

export class AuraRadiusApp extends Application {
    actor: ActorPF2e
    aura: number

    constructor(actor: ActorPF2e, options?: Partial<ApplicationOptions>) {
        super(options)
        this.actor = actor
        this.aura = 0
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'aura-radius',
            title: 'Update Aura Radius',
            template: templatePath('aura-radius.html'),
            width: 400,
        })
    }

    get auras() {
        return this.actor.itemTypes.effect.filter(x => x.rules.some(y => y.key === 'Aura'))
    }

    getData(options?: Partial<ApplicationOptions> | undefined) {
        const auras = this.auras
        const aura = auras[this.aura >= 0 && this.aura <= auras.length ? this.aura : 0]
        const radius = (aura.rules as AuraRuleElement[]).find(x => x.key === 'Aura')!.radius

        return mergeObject(super.getData(options), {
            auras,
            aura: aura.id,
            radius,
        })
    }

    activateListeners(html: JQuery<HTMLElement>): void {
        html.find<HTMLSelectElement>('[name="aura"]').on('change', this.#onAuraChange.bind(this))

        html.find<HTMLInputElement>('[name="radius"]')
            .on('input', this.#onRadiusInput.bind(this))
            .on('change', this.#onRadiusChange.bind(this))
    }

    render(force?: boolean | undefined, options?: RenderOptions | undefined) {
        this.actor.apps[this.appId] = this
        return super.render(force, options)
    }

    async close(options?: ({ force?: boolean | undefined } & Record<string, unknown>) | undefined) {
        await super.close(options)
        delete this.actor.apps?.[this.appId]
    }

    #onAuraChange(event: JQuery.ChangeEvent<any, any, HTMLSelectElement>) {
        event.preventDefault()
        this.aura = this.auras.findIndex(x => x.id === event.currentTarget.value)
        this.render()
    }

    #onRadiusInput(event: JQuery.TriggeredEvent<any, any, HTMLInputElement>) {
        event.preventDefault()
        const radius = event.currentTarget.value
        this.element.find<HTMLInputElement>('[name="radius"] + .range-value').text(radius)
    }

    #onRadiusChange(event: JQuery.ChangeEvent<any, any, HTMLInputElement>) {
        event.preventDefault()

        const auraId = this.element.find<HTMLSelectElement>('[name="aura"]').val()
        const aura = this.actor.items.get(auraId as string)
        if (!aura) return

        const rules = (aura as EffectPF2e).system.rules
        const rule = rules.find(x => x.key === 'Aura') as AuraRuleElement | undefined
        if (!rule) return

        rule.radius = event.currentTarget.valueAsNumber
        aura.update({ 'system.rules': rules })
    }
}
