import {
    ChatMessagePF2e,
    MODULE,
    R,
    getSetting,
    registerSetting,
    userIsActiveGM,
    userIsGM,
} from "module-helpers";
import { ripImaginarium } from "./imaginarium";
import { groupPerception } from "./perception";
import { selectVictim } from "./select-victim";
import { onRenderSettingsConfig } from "./settings";
import { spikeSkinDamage, spikeSkinDuration } from "./spike-skin";
import { thermalNimbus } from "./thermal-nimbus";
import { useFocusAction, useHeroAction, useManBatStance } from "./use-macro";

MODULE.register("idleuh");

Hooks.once("init", () => {
    if (!Array.prototype.toReversed) {
        Array.prototype.toReversed = function () {
            const reversed = [];
            for (let i = this.length - 1; i >= 0; i--) {
                reversed.push(this[i]);
            }
            return reversed;
        };
    }

    registerSetting({
        key: "jquery",
        name: "Disable JQuery Animations",
        hint: "Will cancel sliding animations on different parts of the UI.",
        type: Boolean,
        default: false,
        scope: "client",
        onChange: setJQueryFx,
    });

    registerSetting({
        key: "chat",
        name: "Chat Messages Limit",
        hint: "Will delete chat messages above that limite to prevent performance loss.",
        type: Number,
        default: 50,
        scope: "world",
        range: {
            min: 10,
            max: 500,
            step: 1,
        },
    });

    MODULE.current.api = {
        macros: {
            groupPerception,
            ripImaginarium,
            thermalNimbus,
            spikeSkinDamage,
            spikeSkinDuration,
            selectVictim,
            useHeroAction,
            useFocusAction,
            useManBatStance,
        },
    };

    if (userIsGM()) {
        Hooks.on("preCreateChatMessage", onPreCreateChatMessage);
    }
});

Hooks.on("renderSettingsConfig", onRenderSettingsConfig);

async function onPreCreateChatMessage(message: ChatMessagePF2e) {
    if (!userIsActiveGM()) return;

    const size = game.messages.size + 1;
    const limit = getSetting<number>("chat");
    if (size < limit) return;

    const messages = game.messages.contents;
    const ids = R.take(messages, size - limit).map((message) => message.id);

    ChatMessage.deleteDocuments(ids);
}

function setJQueryFx(disabled: boolean) {
    jQuery.fx.off = disabled;
}
