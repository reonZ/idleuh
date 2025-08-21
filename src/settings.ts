import {
    createHTMLElement,
    htmlClosest,
    htmlQuery,
    R,
    RenderSettingsConfigOptions,
} from "module-helpers";

function onRenderSettingsConfig(
    app: SettingsConfig,
    html: HTMLFormElement,
    options: RenderSettingsConfigOptions
) {
    for (const category of R.values(options.categories)) {
        const tab = htmlQuery(
            html,
            `[data-application-part="main"] [data-group="categories"][data-tab="${category.id}"]`
        );

        for (const entry of category.entries) {
            const setting = entry.menu
                ? game.settings.menus.get(entry.key)
                : game.settings.settings.get(entry.field.name);

            if (!setting) continue;

            const scope =
                "scope" in setting ? setting.scope : setting.restricted ? "world" : "user";
            const input = entry.menu
                ? htmlQuery(tab, `[data-key="${entry.key}"]`)
                : htmlQuery(tab, `[name="${entry.field.name}"]`);
            const group = htmlClosest(input, ".form-group");
            const label = htmlQuery(group, ":scope > label");

            const icon = createHTMLElement("span", {
                dataset: {
                    tooltip: scope.capitalize(),
                    tooltipDirection: "UP",
                },
                content: scope === "world" ? "🌎 " : scope === "user" ? "👤 " : "💻 ",
            });

            label?.prepend(icon);
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
