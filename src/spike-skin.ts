import {
    ActorPF2e,
    FeatPF2e,
    getItemWithSourceId,
    hasItemWithSourceId,
    rollDamageFromFormula,
    TokenPF2e,
} from "module-helpers";

const effectName = "<strong>Spike Skin</strong> effect";

const EFFECT_UUID = "Compendium.idleuh.effects.Item.aJWj25WLTiG67a1y";
const FEAT_UUID = "Compendium.pf2e.feats-srd.Item.9p28s0zg4Vv4r5i2";

function effectMissing() {
    ui.notifications.warn(`You need to select an actor with the ${effectName}.`);
}

async function spikeSkinDuration(actor?: ActorPF2e) {
    const effect = actor && getItemWithSourceId(actor, EFFECT_UUID, "effect");
    if (!effect) return effectMissing();

    const remaining = effect.system.duration.value;
    if (remaining <= 0) {
        ui.notifications.warn(`The ${effectName} is already expired on the selected actor.`);
        return;
    }

    await effect.update({ "system.duration.value": Math.max(0, remaining - 1) });
    ui.notifications.info(`The ${effectName} duration has been reduced by 1 minute.`);
}

async function spikeSkinDamage(actor?: ActorPF2e, token?: TokenPF2e) {
    const item = await fromUuid<FeatPF2e>(FEAT_UUID);
    if (!item) return;

    const effect = actor && hasItemWithSourceId(actor, EFFECT_UUID, "effect");
    if (!effect) return effectMissing();

    const formula = `${Math.floor((actor.level - 8) / 2) * 2 + 2}[piercing]`;

    await rollDamageFromFormula(formula, {
        item,
        origin: { actor, token: token?.document },
    });
}

export { spikeSkinDamage, spikeSkinDuration };
