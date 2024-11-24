import { ActorPF2e, getFirstActiveToken, R } from "module-helpers";

async function selectVictim(event: Event) {
    const party = game.actors.party?.members ?? [];

    const validActor = (actor: Maybe<ActorPF2e>) => {
        return (
            !!actor && actor.isOfType("creature") && (actor.hasPlayerOwner || party.includes(actor))
        );
    };

    const user = game.user;
    const targets = user.targets.filter((token) => validActor(token.actor));
    const controlled = canvas.tokens.controlled.filter((token) => validActor(token.actor));

    const victims =
        targets.size > 1
            ? [...targets]
            : controlled.length > 1
            ? controlled
            : R.pipe(
                  party,
                  R.filter((actor) => actor.isOfType("creature")),
                  R.map((actor) => getFirstActiveToken(actor)),
                  R.filter(R.isTruthy)
              );

    if (victims.length < 2) {
        ui.notifications.warn("Not enough potential victims to pick from.");
        return;
    }

    const roll = await new Roll(`1d${victims.length}`).evaluate();
    const victimIndex = roll.total - 1;
    const victim = victims[victimIndex];

    const content = victims
        .map((token, i) => {
            const selected = victimIndex === i;
            const style = selected ? " style='color: red;'" : "";
            const target = selected ? "<i class='fa-regular fa-crosshairs-simple'></i> " : "";
            return `<div${style}>${target}${token.name}</div>`;
        })
        .join("");

    user.updateTokenTargets([victim.id]);
    user.broadcastActivity({ targets: [victim.id] });

    getDocumentClass("ChatMessage").create({
        flavor: "Eeny, meeny, miny, moe",
        content,
    });
}

export { selectVictim };
