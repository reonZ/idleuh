import { templatePath } from '../utils/foundry.js'

/** @param {TokenPF2e} token */
export async function manualToken(token) {
    if (!token || !token.isOwner) {
        ui.notifications.warn('You need to select an owned token.')
        return
    }

    const data = token.document

    const result = await Dialog.wait(
        {
            title: 'Manual Token Update',
            buttons: {
                yes: {
                    label: 'Update',
                    icon: '<i class="fa-solid fa-floppy-disk"></i>',
                    callback: $html => new FormData($html.find('form')[0]),
                },
                no: {
                    label: 'Cancel',
                    icon: '<i class="fas fa-times"></i>',
                    callback: () => null,
                },
            },
            content: await renderTemplate(
                templatePath('manual-token.html'),
                mergeObject(data, { scale: data.texture.scaleX.toFixed(2) })
            ),
            close: () => null,
            render: $html => {
                const $scale = /** @type {JQuery<HTMLInputElement>} */ ($html.filter('.dialog-content').find('input[name=scale]'))
                const $value = $scale.next('span')
                $scale.on('input', () => {
                    const val = $scale[0].valueAsNumber.toFixed(2)
                    $value.text(val)
                })
            },
        },
        undefined,
        { width: 500 }
    )

    if (!result) return

    const newData = {
        ['displayBars']: Number(result.get('hp')),
        ['texture.src']: result.get('img'),
        ['flags.pf2e.linkToActorSize']: !!result.get('link'),
        ['width']: Number(result.get('width')),
        ['height']: Number(result.get('height')),
        ['texture.scaleX']: Number(result.get('scale')),
        ['texture.scaleY']: Number(result.get('scale')),
    }

    const update = {}
    for (const [k, v] of Object.entries(newData)) {
        if (getProperty(data, k) === v) continue
        setProperty(update, k, v)
    }

    if (Object.keys(update).length) token.document.update(update)
}
