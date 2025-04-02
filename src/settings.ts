import { createHTMLElement, htmlClosest, htmlQuery } from "module-helpers";

function onRenderSettingsConfig(
    app: SettingsConfig,
    $html: JQuery,
    data: ReturnType<SettingsConfig["_prepareCategoryData"]>
) {
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

        const menus = category.menus as (SettingSubmenuConfig & { key: string })[];
        for (const menu of menus) {
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
}

export { onRenderSettingsConfig };
