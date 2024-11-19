import { rollDamageFromFormula } from "foundry-pf2e";

const FEAT_UUID = "Compendium.pf2e.feats-srd.Item.XJCsa3UbQtsKcqve";

async function thermalNimbus(actor?: ActorPF2e, token?: TokenPF2e) {
    const item = actor?.itemTypes.feat.find((item) => item.sourceId === FEAT_UUID);

    if (!item || !actor) {
        ui.notifications.warn(
            "You need to select a kineticist with the <strong>Thermal Nimbus</strong> feat."
        );
        return;
    }

    const formula = `${Math.floor(actor.level / 2)}[fire]`;
    await rollDamageFromFormula(formula, {
        item,
        origin: { actor, token: token?.document },
    });
}

export { thermalNimbus };
