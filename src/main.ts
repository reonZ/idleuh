import { getCurrentModule } from '@utils/foundry/module'
import { setModuleID } from '@utils/module'
import { socketOn } from '@utils/socket'
import { esotericCheck } from './macros/esoteric'
import { exploitVulnerability, exploitVulnerabilityGM } from './macros/exploit-vulnerability'
import { identify } from './macros/identify'
import { ripImaginarium } from './macros/imaginarium'
import { manualToken } from './macros/manual-token'
import { groupPerception } from './macros/perception'

setModuleID('idleuh')

Hooks.once('init', () => {
    getCurrentModule<IdleuhApi>().api = {
        macros: {
            exploitVulnerability,
            esotericCheck,
            manualToken,
            groupPerception,
            identify,
            ripImaginarium,
        },
    }

    // game.settings.register(MODULE_ID, 'bff', {
    //     name: "Enable BFF's Ire",
    //     hint: "Should the BFF's Ire be handled.",
    //     type: Boolean,
    //     default: true,
    //     config: true,
    //     scope: 'world',
    //     onChange: enableBFF,
    // })

    // game.settings.register(MODULE_ID, 'bffDistance', {
    //     name: "BFF's Ire Distance",
    //     hint: 'Distance in square(s) for the curse to apply.',
    //     type: Number,
    //     default: 1,
    //     config: true,
    //     scope: 'world',
    // })
})

Hooks.once('ready', () => {
    // if (getSetting('bff')) enableBFF(true)
    if (game.user.isGM) {
        socketOn(onPacketReceived)
    }
})

function onPacketReceived(packet: ModulePacket) {
    if (packet.type === 'exploit-vulnerability') exploitVulnerabilityGM(packet)
}
