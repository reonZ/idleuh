import { convertToCallOptions, EmitablePacket, MODULE, SYSTEM } from "foundry-helpers";
import {
    enactGetEmGood,
    envisonDoom,
    getEmGood,
    GetEmGoodQueryArgs,
    groupPerception,
    rechargeVitalityNetwork,
    ripImaginarium,
    selectVictim,
    setSettings,
    thermalNimbus,
    transferVitality,
    useFocusAction,
    useHeroAction,
    useManBatStance,
} from "macros";
import { onRenderSettingsConfig } from "settings";
import { id } from "../module.json";

MODULE.register(id);

MODULE.apiExpose("macros", {
    envisonDoom,
    getEmGood,
    groupPerception,
    rechargeVitalityNetwork,
    ripImaginarium,
    selectVictim,
    setUserSettings: () => setSettings(false),
    setWorldSettings: () => setSettings(true),
    thermalNimbus,
    transferVitality,
    useFocusAction,
    useHeroAction,
    useManBatStance,
});

Hooks.once("init", () => {
    CONFIG.queries[MODULE.path("user-query")] = async (data: UserQueryArgs) => {
        if (data._type === "get-em-good") {
            const options = await convertToCallOptions(data);
            enactGetEmGood(options);
        }
    };
});

Hooks.once(
    "triggerEngine.registerTriggers",
    (registerTriggers: (moduleId: string, applicationId: string, filePath: string) => void) => {
        registerTriggers("trigger-engine", "pf2e-trigger", `modules/${MODULE.id}/${SYSTEM.id}-triggers.json`);
    },
);

Hooks.on("renderSettingsConfig", onRenderSettingsConfig);

type UserQueryArgs = EmitablePacket<GetEmGoodQueryArgs>;
