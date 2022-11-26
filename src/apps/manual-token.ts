import { templatePath } from '~src/@utils/foundry/path'

export class IdleuhManualTokenApp extends FormApplication<TokenDocumentPF2e> {
    static get defaultOptions(): FormApplicationOptions {
        return mergeObject(super.defaultOptions, {
            id: 'idleuh-manual-token',
            template: templatePath('manual-token.html'),
            title: 'Manual Token Update',
            width: 500,
        })
    }

    activateListeners(html: JQuery<HTMLElement>): void {
        super.activateListeners(html)

        html.find('button[type=button]').on('click', () => this.close())

        const scale = html.find('input[name=scale]') as JQuery<HTMLInputElement>
        const scaleValue = scale.next('span')
        scale.on('input', () => {
            const val = scale[0].valueAsNumber
            scaleValue.text(val.toFixed(2))
        })

        const grid = html.find('input[name=grid]') as JQuery<HTMLInputElement>
        const gridValue = grid.next('span')
        grid.on('input', () => {
            const val = grid[0].valueAsNumber
            gridValue.text(val.toFixed(1))
        })
    }

    protected async _updateObject(event: Event, formData: Record<string, unknown>) {
        const data = this.object

        const newData = {
            ['displayName']: Number(formData.name),
            ['displayBars']: Number(formData.hp),
            ['texture.src']: formData.img,
            ['flags.pf2e.linkToActorSize']: !!formData.link,
            ['width']: Number(formData.grid),
            ['height']: Number(formData.grid),
            ['texture.scaleX']: Number(formData.scale),
            ['texture.scaleY']: Number(formData.scale),
        }

        const update = {}
        for (const [k, v] of Object.entries(newData)) {
            if (getProperty(data, k) === v) continue
            setProperty(update, k, v)
        }

        if (Object.keys(update).length) this.object.update(update)
    }
}
