import {
    ActorPF2e,
    CharacterPF2e,
    findItemWithSourceId,
    R,
    ResourceData,
    rollDamageFromFormula,
    TokenPF2e,
    waitDialog,
} from "foundry-helpers";

const TRANSFER_VITALITY_UUID = "Compendium.sf2e.actions.Item.UeMHbnnaXDa3sGfG";

async function transferVitality(token?: TokenPF2e) {
    const actor = token?.actor as CharacterPF2e | undefined;
    if (!token || !actor) return;

    const item = findItemWithSourceId(actor, TRANSFER_VITALITY_UUID, "action");

    if (!item) {
        return ui.notifications.warn("You must select a token with the <strong>Transfer Vitality</strong> action.");
    }

    const resource = getResource(actor);
    if (!resource) return;

    if (resource.value <= 0) {
        return ui.notifications.warn("You don't have any more <strong>Vitality Network</strong> charges.");
    }

    const targetToken = R.only([...game.user.targets]);
    const target = targetToken?.actor;

    if (!target?.isOfType("creature") || !targetToken || targetToken.distanceTo(token) > 60) {
        return ui.notifications.warn("You must target one bonded creature within 60ft.");
    }

    const targetHP = target.hitPoints;
    const needed = targetHP.max - targetHP.value;

    if (needed <= 0) {
        return ui.notifications.info("Your target doesn't need any healing.");
    }

    const level = actor.level;
    const cap = level >= 20 ? 50 : level >= 15 ? 40 : level >= 10 ? 30 : level >= 5 ? 20 : 10;
    const max = Math.min(resource.value, cap, needed);

    const content = `<div class="form-group" style="width: 300px;">
        <label>Heal Transferred</label>
        <div class="form-fields" style="flex: 0 0 4em;">
            <input type="number" name="input" value="${max}" min="1" max="${max}">
        </div>
    </div>`;

    const result = await waitDialog<{ input: number }>({
        content,
        i18n: "",
        title: "Transfer Vitality",
        yes: { label: "Transfer" },
    });

    if (!result || result.input < 1) return;

    const updatedTargetHP = target.hitPoints;
    const given = Math.min(result.input, resource.value, cap, updatedTargetHP.max - updatedTargetHP.value);
    if (given <= 0) return;

    actor.updateResource("vitalityNetwork", resource.value - given);

    const formula = `${given}[healing]`;
    rollDamageFromFormula(formula, {
        item,
        origin: { actor, token: token.document },
        skipDialog: true,
        target: { actor: target, token: targetToken.document },
    });
}

async function rechargeVitalityNetwork(actor: CharacterPF2e) {
    const resource = getResource(actor);
    if (!resource) return;

    if (resource.value >= resource.max) {
        return ui.notifications.info("You don't need to recharge your <strong>Vitality Network</strong> charges.");
    }

    actor.updateResource("vitalityNetwork", resource.max);

    const ChatMessagePF2e = getDocumentClass("ChatMessage");
    ChatMessagePF2e.create({
        content: "Has fully recharged its Vitality Network.",
        speaker: ChatMessagePF2e.getSpeaker({ actor }),
    });
}

function getResource(actor: Maybe<ActorPF2e>): ResourceData | undefined {
    const resource = actor?.isOfType("character") && actor.getResource("vitalityNetwork");

    if (!resource) {
        ui.notifications.warn("You must select a token with the <strong>Vitality Network</strong> resource.");
        return;
    }

    return resource;
}

export { rechargeVitalityNetwork, transferVitality };
