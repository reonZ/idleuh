import { getCurrentModule } from './@utils/foundry/module'
import { esotericCheck } from './macros/esoteric'
import { identify } from './macros/identify'
import { manualToken } from './macros/manual'
import { groupPerception } from './macros/perception'

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
