import {
    envisonDoom,
    groupPerception,
    ripImaginarium,
    selectVictim,
    thermalNimbus,
    useFocusAction,
    useHeroAction,
    useManBatStance,
} from "macros";
import { MODULE } from "module-helpers";
import { onRenderSettingsConfig } from "settings";

MODULE.register("idleuh");

MODULE.apiExpose({
    macros: {
        envisonDoom,
        groupPerception,
        ripImaginarium,
        selectVictim,
        thermalNimbus,
        useFocusAction,
        useHeroAction,
        useManBatStance,
    },
});

Hooks.once(
    "triggerEngine.registerTriggers",
    (registerTriggers: (moduleId: string, applicationId: string, filePath: string) => void) => {
        registerTriggers("trigger-engine", "pf2e-trigger", `modules/${MODULE.id}/pf2e-triggers.json`);
    },
);

Hooks.on("renderSettingsConfig", onRenderSettingsConfig);
