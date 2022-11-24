import { esotericCheck } from './macros/esoteric-check.js'
import { groupPerception } from './macros/group-peception.js'
import { identify } from './macros/identify.js'
import { manualToken } from './macros/manual-token.js'
import { getCurrentModule } from './utils/foundry.js'

Hooks.once('init', () => {
    getCurrentModule().api = {
        macros: {
            esotericCheck,
            manualToken,
            groupPerception,
            identify,
        },
    }
})
