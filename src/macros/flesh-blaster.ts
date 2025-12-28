import {
    AbilityItemPF2e,
    ActorPF2e,
    getFirstActiveToken,
    R,
    rollDamageFromFormula,
} from "module-helpers";

async function envisonDoom(actor: ActorPF2e, item: AbilityItemPF2e, event: Event) {
    const { plugValue = 0 } =
        (actor.getFlag("pf2e", "fleshBlaster") as FleshBlasterFlag | undefined) ?? {};

    if (plugValue < 2) {
        return ui.notifications.warn("You haven't pushed the beads far enough.");
    }

    const targets = game.user.targets;

    if (targets.size > 1) {
        return ui.notifications.warn("You can only have one target.");
    }

    const target = targets.first();
    const targetActor = target?.actor;

    const percentage = plugValue === 2 ? 10 : (plugValue - 2) * 25;
    const value = Math.floor((actor.hitPoints?.max ?? 0) * (percentage / 100));
    const formula = `${value}[mental]`;

    const msg = (await item.toMessage(event, { create: false }))?.toObject() as any;

    if (msg) {
        foundry.utils.setProperty(msg, "flags.pf2e-toolbelt.targetHelper", {
            saveVariants: { null: undefined },
            targets: [null],
        });

        await getDocumentClass("ChatMessage").create(msg);
    }

    const toolbeltTargets: TokenDocumentUUID[] = R.filter(
        [target?.document.uuid, getFirstActiveToken(actor)?.uuid],
        R.isTruthy
    );

    rollDamageFromFormula(formula, {
        item,
        origin: { actor },
        target: targetActor ? { actor: targetActor, token: target.document } : undefined,
        toolbelt: {
            item: item.uuid,
            targets: toolbeltTargets,
            saveVariants: {
                null: {
                    basic: true,
                    dc: 30,
                    statistic: "will",
                },
            },
        },
    });
}

type FleshBlasterFlag = {
    plugValue: number;
};

export { envisonDoom };
