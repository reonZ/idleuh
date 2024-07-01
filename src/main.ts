import { MODULE, getSetting, registerSetting } from "foundry-pf2e";
import { identify } from "./identify";
import { groupPerception } from "./perception";
import { ripImaginarium } from "./imaginarium";

MODULE.register("idleuh", "Idleuh");

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

    MODULE.current.api = {
        macros: {
            identify,
            groupPerception,
            ripImaginarium,
        },
    };
});

Hooks.once("ready", () => {
    if (getSetting("jquery")) setJQueryFx(true);
});

function setJQueryFx(disabled: boolean) {
    jQuery.fx.off = disabled;
}
