import {
    MODULE,
    createHTMLElement,
    getSetting,
    htmlClosest,
    htmlQuery,
    registerSetting,
} from "foundry-pf2e";
import { identify } from "./identify";
import { ripImaginarium } from "./imaginarium";
import { groupPerception } from "./perception";
import { selectVictim } from "./select-victim";
import { spikeSkinDamage, spikeSkinDuration } from "./spike-skin";
import { thermalNimbus } from "./thermal-nimbus";

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
            thermalNimbus,
            spikeSkinDamage,
            spikeSkinDuration,
            selectVictim,
        },
    };
});

Hooks.once("ready", () => {
    if (getSetting("jquery")) {
        setJQueryFx(true);
    }
});

Hooks.on("renderSettingsConfig", (app: SettingsConfig, $html: JQuery, data: SettingsConfigData) => {
    const html = $html[0];

    const setGroupName = (group: Maybe<HTMLElement>, scope: "client" | "world") => {
        const label = htmlQuery(group, ":scope > label");
        const icon = createHTMLElement("span", {
            dataset: {
                tooltip: scope.capitalize(),
                tooltipDirection: "UP",
            },
            innerHTML: scope === "world" ? "🌎 " : "👤 ",
        });
        label?.prepend(icon);
    };

    for (const category of data.categories) {
        const section = htmlQuery(html, `section.category[data-category="${category.id}"]`);
        if (!section) continue;

        for (const setting of category.settings) {
            const group = htmlQuery(section, `[data-setting-id="${setting.id}"]`);
            setGroupName(group, setting.scope);
        }

        for (const menu of category.menus) {
            const btn = htmlQuery(section, `[data-key="${menu.key}"]`);
            const group = htmlClosest(btn, ".form-group");
            setGroupName(group, menu.restricted ? "world" : "client");
        }
    }

    const inputs = html.querySelectorAll("input[type='range'], input[type='number']");
    for (const input of inputs) {
        input.addEventListener("wheel", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }
});

function setJQueryFx(disabled: boolean) {
    jQuery.fx.off = disabled;
}
