import { getCurrentModule } from '@utils/foundry/module'
import { setModuleID } from '@utils/module'
import { socketOn } from '@utils/socket'
import { getSetting } from '@utils/foundry/settings'
import { esotericCheck } from './macros/esoteric'
import { cleanExploitVulnerabilityGM, exploitVulnerability, exploitVulnerabilityGM } from './macros/exploit-vulnerability'
import { identify } from './macros/identify'
import { ripImaginarium } from './macros/imaginarium'
import { manualToken } from './macros/manual-token'
import { groupPerception } from './macros/perception'
import { marshalInspiration } from './macros/inspiring-marshal'

const MODULE_ID = 'idleuh'
setModuleID(MODULE_ID)

Hooks.once('init', () => {
    getCurrentModule<IdleuhApi>().api = {
        macros: {
            exploitVulnerability,
            esotericCheck,
            manualToken,
            groupPerception,
            identify,
            ripImaginarium,
            marshalInspiration,
        },
    }

    game.settings.register(MODULE_ID, 'jquery', {
        name: 'Disable JQuery Animations',
        hint: 'Will cancel sliding animations on different parts of the UI.',
        type: Boolean,
        default: false,
        config: true,
        scope: 'client',
        onChange: setJQueryFx,
    })
})

Hooks.once('ready', () => {
    if (game.user.isGM) {
        socketOn(onPacketReceived)
    }

    if (getSetting('jquery')) setJQueryFx(true)
})

function setJQueryFx(disabled: boolean) {
    jQuery.fx.off = disabled
}

function onPacketReceived(packet: ModulePacket) {
    if (packet.type === 'exploit-vulnerability') exploitVulnerabilityGM(packet)
    else if (packet.type === 'clean-exploit-vulnerability') cleanExploitVulnerabilityGM()
}
