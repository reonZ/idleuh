import { MODULE, SYSTEM } from "foundry-helpers";
import {
    envisonDoom,
    getEmGood,
    groupPerception,
    ripImaginarium,
    selectVictim,
    setSettings,
    thermalNimbus,
    useFocusAction,
    useHeroAction,
    useManBatStance,
} from "macros";
import { onRenderSettingsConfig } from "settings";

MODULE.register("idleuh");

MODULE.apiExpose("macros", {
    envisonDoom,
    getEmGood,
    groupPerception,
    ripImaginarium,
    selectVictim,
    setUserSettings: () => setSettings(false),
    setWorldSettings: () => setSettings(true),
    thermalNimbus,
    useFocusAction,
    useHeroAction,
    useManBatStance,
});

Hooks.once(
    "triggerEngine.registerTriggers",
    (registerTriggers: (moduleId: string, applicationId: string, filePath: string) => void) => {
        registerTriggers("trigger-engine", "pf2e-trigger", `modules/${MODULE.id}/${SYSTEM.id}-triggers.json`);
    },
);

Hooks.on("renderSettingsConfig", onRenderSettingsConfig);
