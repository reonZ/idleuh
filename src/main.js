import { esotericCheck } from './macros/esoteric'
import { extractElement } from './macros/extract'
import { identify } from './macros/identify'
import { ripImaginarium } from './macros/imaginarium'
import { marshalInspiration } from './macros/marshal'
import { thermalNimbus } from './macros/nimbus'
import { groupPerception } from './macros/perception'
import { sandSnatcher } from './macros/snatcher'
import { spikeSkinDamage, spikeSkinDuration } from './macros/spike'
import { cleanExploitVulnerabilityGM, exploitVulnerability, exploitVulnerabilityGM } from './macros/vulnerability'
import { MODULE_ID, getSetting, socketOn } from './module'

Hooks.once('init', () => {
    game.modules.get(MODULE_ID).api = {
        macros: {
            exploitVulnerability,
            esotericCheck,
            groupPerception,
            identify,
            ripImaginarium,
            marshalInspiration,
            sandSnatcher,
            extractElement,
            thermalNimbus,
            spikeSkinDuration,
            spikeSkinDamage,
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

function setJQueryFx(disabled) {
    jQuery.fx.off = disabled
}

function onPacketReceived(packet) {
    if (packet.type === 'exploit-vulnerability') exploitVulnerabilityGM(packet)
    else if (packet.type === 'clean-exploit-vulnerability') cleanExploitVulnerabilityGM()
}
