import { positionTokenFromCoords, registerKeybind } from "module-helpers";

let TELEPORT = false;

function setupTeleport() {
    Hooks.once("init", () => {
        registerKeybind("teleport", {
            name: "Teleport Tokens",
            hint: "Selected tokens will be move to location when clicking on the scene while holding this keybind.",
            restricted: true,
            onDown: () => {
                TELEPORT = true;
            },
            onUp: () => {
                TELEPORT = false;
            },
        });
    });

    Hooks.on("canvasReady", () => {
        if (game.user.isGM) {
            canvas.stage.on("pointerdown", onCanvasStagePointerDown);
        }
    });
}

async function onCanvasStagePointerDown(event: PIXI.FederatedPointerEvent) {
    if (!TELEPORT) return;

    const tokens = canvas.tokens.controlled;
    if (!tokens.length) return;

    const coords = event.getLocalPosition(canvas.app.stage);

    const updates: { _id: string; x: number; y: number }[] = tokens.map((token) => {
        const { x, y } = positionTokenFromCoords(coords, token);
        return { _id: token.id, x, y };
    });

    const operation = { animate: false, bypass: true };
    await canvas.scene?.updateEmbeddedDocuments("Token", updates, operation);
}

export { setupTeleport };
