import {
    ActorPF2e,
    actorsRespectAlliance,
    ChoiceSetSource,
    EffectSource,
    findItemWithSourceId,
    getItemSourceFromUuid,
    R,
    TokenMarkRuleElement,
    TokenPF2e,
} from "foundry-helpers";

const GETEM_ACTION_UUID = "Compendium.sf2e.actions.Item.cmCtfURzpbzkxWsy";
const GETEM_EFFECT_UUID = "Compendium.sf2e.feat-effects.Item.ey2zSEnprAGgvrij";

async function getEmGood(originToken?: TokenPF2e) {
    const originActor = originToken?.actor;

    if (!originToken?.scene || !originActor?.isOfType("character")) {
        return ui.notifications.warn("You must have a valid token selected.");
    }

    const action = findItemWithSourceId(originActor, GETEM_ACTION_UUID, "action");

    if (!action) {
        return ui.notifications.warn("Your token doesn't gave the \"Get 'Em!\" action.");
    }

    const target = R.first([...game.user.targets]);

    if (!target || target.distanceTo(originToken) > 60) {
        return ui.notifications.warn("You must target one creature within 60ft.");
    }

    const effectSource = (await getItemSourceFromUuid(GETEM_EFFECT_UUID)) as EffectSource | null;
    if (!effectSource) return;

    effectSource.system.context = {
        origin: {
            actor: originActor.uuid,
            item: action.uuid,
            rollOptions: action.getOriginData().rollOptions ?? [],
            spellcasting: null,
            token: originToken.document.uuid,
        },
        roll: null,
        target: null,
    };

    const targetUUID = target.document.uuid;
    const markRule = effectSource.system.rules.find(
        (rule) => rule.key === "TokenMark",
    ) as TokenMarkRuleElement["_source"];

    markRule.uuid = targetUUID;

    const targetIsAsset = originActor.itemTypes.effect.some((effect) => {
        return (
            effect.slug === "effect-size-up" &&
            effect.rules.find((rule): rule is TokenMarkRuleElement => rule.key === "TokenMark")?.uuid === targetUUID
        );
    });

    if (targetIsAsset) {
        const choiceSetRule = effectSource.system.rules.find(
            (rule) => rule.key === "ChoiceSet" && (rule as ChoiceSetSource).rollOption === "get-em",
        ) as ChoiceSetSource;

        choiceSetRule.flag = "effectGetEm";
        choiceSetRule.selection = "lead-by-example";
    }

    const [originEffect] = await originActor.createEmbeddedDocuments("Item", [effectSource]);
    const originSource = originEffect.toObject();

    await Promise.all(
        originToken.scene.tokens.map(async (token) => {
            const actor = token.actor;

            if (
                !token.object ||
                !actor?.isOfType("character", "npc") ||
                !actorsRespectAlliance(originActor, actor, "allies")
            )
                return;

            const cloned = foundry.utils.deepClone(originSource);
            return (actor as ActorPF2e).createEmbeddedDocuments("Item", [cloned]);
        }),
    );
}

export { getEmGood };
