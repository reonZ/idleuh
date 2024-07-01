import { rollDamage } from "./damage";

const FEAT_UUID = "Compendium.pf2e.feats-srd.Item.XJCsa3UbQtsKcqve";

async function thermalNimbus(actor: ActorPF2e, token: TokenPF2e) {
    const item = actor?.itemTypes.feat.find((item) => item.sourceId === FEAT_UUID);

    if (!item) {
        ui.notifications.warn(
            "You need to select a kineticist with the <strong>Thermal Nimbus</strong> feat."
        );
        return;
    }

    const formula = `${Math.floor(actor.level / 2)}[fire]`;

    await rollDamage(actor, item, formula, token);
}

export { thermalNimbus };
