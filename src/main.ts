import { getCurrentModule } from './@utils/foundry/module'
import { getSetting } from './@utils/foundry/settings'
import { esotericCheck } from './macros/esoteric'
import { identify } from './macros/identify'
import { manualToken } from './macros/manual'
import { groupPerception } from './macros/perception'
import MODULE_ID from './module'
import { enableBFF } from './modules/bff'

Hooks.once('init', () => {
    getCurrentModule().api = {
        macros: {
            esotericCheck,
            manualToken,
            groupPerception,
            identify,
        },
    }

    game.settings.register(MODULE_ID, 'bff', {
        name: "Enable BFF's Ire",
        type: Boolean,
        default: true,
        config: true,
        scope: 'world',
        onChange: enableBFF,
    })
})

Hooks.once('ready', () => {
    if (getSetting('bff')) enableBFF(true)
})
