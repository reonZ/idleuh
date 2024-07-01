const proficiencies = ["untrained", "trained", "expert", "master", "legendary"] as const;

async function groupPerception() {
    if (!game.user.isGM) {
        ui.notifications.warn("You not the GM yo!");
        return;
    }

    let content = "";

    const actors = game.actors.party?.members.filter((actor) => actor.isOfType("creature")) ?? [];

    await Promise.all(
        actors.map(async (actor) => {
            if (!actor.isOfType("character")) return;

            const roll = (await actor.perception.roll({ createMessage: false }))!;
            const die = roll.dice[0].total;
            const proficiency = proficiencies[actor.perception.rank ?? 0];

            content += `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`;
            content += `<span>${actor.name} (${proficiency})</span><span`;
            if (die === 20) content += ' style="color: green;"';
            else if (die === 1) content += ' style="color: red;"';
            content += `>${roll.total}</span></div>`;
        })
    );

    if (content)
        getDocumentClass("ChatMessage").create({
            content,
            flavor: "Group Perception Checks<hr>",
            whisper: [game.user.id],
        });
}

export { groupPerception };
