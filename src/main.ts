import { getCurrentModule } from './@utils/foundry/module'
import { getSetting } from './@utils/foundry/settings'
import { socketOn } from './@utils/socket'
import { auraRadius } from './macros/aura-radius'
import { esotericCheck } from './macros/esoteric-check'
import { exploitVulnerability, exploitVulnerabilityGM } from './macros/exploit-vulnerability'
import { identify } from './macros/identify'
import { ripImaginarium } from './macros/imaginarium'
import { manualToken } from './macros/manual'
import { groupPerception } from './macros/perception'
import MODULE_ID from './module'
import { enableBFF } from './modules/bff'

Hooks.once('init', () => {
    getCurrentModule().api = {
        macros: {
            exploitVulnerability,
            esotericCheck,
            manualToken,
            groupPerception,
            identify,
            ripImaginarium,
            auraRadius,
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
    if (game.user.isGM) {
        socketOn(onSocket)
    }
})

function onSocket(packet: Packet) {
    if (packet.type === 'exploit-vulnerability') exploitVulnerabilityGM(packet)
}
