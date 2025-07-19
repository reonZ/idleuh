import {
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
        groupPerception,
        ripImaginarium,
        selectVictim,
        thermalNimbus,
        useFocusAction,
        useHeroAction,
        useManBatStance,
    },
});

Hooks.on("renderSettingsConfig", onRenderSettingsConfig);
