import { getUserSettings, worldSettings } from "force-settings";
import { R, SYSTEM } from "foundry-helpers";

async function setSettings(world: boolean) {
    const isGM = game.user.isGM;
    if (world && !isGM) return;

    const confirm = await foundry.applications.api.DialogV2.confirm({
        content: world
            ? "Make sure you have activated all your modules before executing this."
            : "This will override your user settings, do you want to continue?",
        no: {
            label: "Cancel",
        },
        yes: {
            label: "Continue",
        },
        window: {
            title: `Set ${world ? "World" : "User"} Settings`,
        },
    });

    if (!confirm) return;

    const settings = world ? worldSettings : getUserSettings();

    for (const [_namespace, content] of R.entries(settings)) {
        const namespace = _namespace === "system" ? SYSTEM.id : _namespace;

        for (const [key, value] of R.entries(content) as [string, any][]) {
            if (value === undefined) continue;

            try {
                const setting = game.settings.settings.get(`${namespace}.${key}`);
                if (!setting) continue;
                await game.settings.set(namespace, key, value);
            } catch {}
        }
    }

    if (world) {
        game.socket.emit("reload");
    }

    foundry.utils.debouncedReload();
}

export { setSettings };
