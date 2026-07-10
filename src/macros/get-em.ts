import {
    ActorPF2e,
    actorsRespectAlliance,
    ChoiceSetSource,
    convertToEmitOptions,
    displayEmiting,
    EffectSource,
    EmitablePacket,
    findItemWithSourceId,
    getItemSourceFromUuid,
    ItemSourcePF2e,
    MODULE,
    R,
    ScenePF2e,
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

    const target = R.only([...game.user.targets]);

    if (!target || target.scene !== originToken.scene || target.distanceTo(originToken) > 60) {
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

    const markRule = effectSource.system.rules.find(
        (rule) => rule.key === "TokenMark",
    ) as TokenMarkRuleElement["_source"];

    const targetUUID = target.document.uuid;
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

    const getEmGoodOptions: GetEmGoodQueryArgs = {
        _type: "get-em-good",
        originActor,
        scene: originToken.scene,
        source: originEffect.toObject(),
    };

    if (game.user.isActiveGM) {
        enactGetEmGood(getEmGoodOptions);
    } else {
        displayEmiting();
        const queryArgs: EmitablePacket<GetEmGoodQueryArgs> = convertToEmitOptions(getEmGoodOptions);
        game.users.activeGM?.query(MODULE.path("user-query"), queryArgs);
    }
}

async function enactGetEmGood({ originActor, scene, source }: Omit<GetEmGoodQueryArgs, "_type">) {
    if (!scene || !originActor || !source) return;

    await Promise.all(
        scene.tokens.map(async (token) => {
            const actor = token.actor;

            if (
                !token.object ||
                !actor?.isOfType("character", "npc") ||
                !actorsRespectAlliance(originActor, actor, "allies")
            )
                return;

            const cloned = foundry.utils.deepClone(source);
            return (actor as ActorPF2e).createEmbeddedDocuments("Item", [cloned]);
        }),
    );
}

type GetEmGoodQueryArgs = {
    _type: "get-em-good";
    originActor: ActorPF2e;
    scene: ScenePF2e;
    source: ItemSourcePF2e;
};

export { enactGetEmGood, getEmGood };
export type { GetEmGoodQueryArgs };
