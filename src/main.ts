import { getCurrentModule } from './@utils/foundry/module'
import { getSetting } from './@utils/foundry/settings'
import { esotericCheck } from './macros/esoteric'
import { identify } from './macros/identify'
import { ripImaginarium } from './macros/imaginarium'
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
            ripImaginarium,
        },
    }

    game.settings.register(MODULE_ID, 'bff', {
        name: "Enable BFF's Ire",
        hint: "Should the BFF's Ire be handled.",
        type: Boolean,
        default: true,
        config: true,
        scope: 'world',
        onChange: enableBFF,
    })

    game.settings.register(MODULE_ID, 'bffDistance', {
        name: "BFF's Ire Distance",
        hint: 'Distance in square(s) for the curse to apply.',
        type: Number,
        default: 1,
        config: true,
        scope: 'world',
    })
})

Hooks.once('ready', () => {
    if (getSetting('bff')) enableBFF(true)
})
