import { chatUUID, createConsumableFromSpell, error } from "module-api";

const packId = "pf2e.spells-srd";
const bookId = "Item.dcALVAyJbYSovzqt";

export async function ripImaginarium(actor) {
	if (!actor)
		return ui.notifications.warn(
			"You must select an actor with the Imaginarium",
		);

	const book = actor.itemTypes.equipment.find(
		(x) => x.getFlag("core", "sourceId") === bookId,
	);
	if (!book || book.system.equipped.carryType === "dropped")
		return ui.notifications.warn(
			"This actor doesn't have the Imaginarium in their possession",
		);

	const level = Math.floor(actor.level / 2) || 1;
	const pack = game.packs.get(packId);
	const index = await pack.getIndex({
		fields: ["system.level.value", "system.traits", "system.ritual"],
	});

	const entries = index.filter(
		(x) =>
			x.system.level.value <= level &&
			!x.system.traits.value.includes("cantrip") &&
			!x.system.traits.value.includes("focus") &&
			!x.system.ritual &&
			x.system.traits.rarity === "common",
	);

	const roll = Math.floor(Math.random() * entries.length);
	const spell = await pack.getDocument(entries[roll]._id);

	const scroll = await createConsumableFromSpell(spell, {
		type: "scroll",
		heightenedLevel: level,
	});

	if (!scroll) {
		error("An error occured while creating an imaginarium scroll");
		return;
	}

	scroll.name = `${scroll.name} *`;
	const [item] = await actor.createEmbeddedDocuments("Item", [scroll]);
	const link = chatUUID(spell.uuid, item.name);

	ChatMessage.create({
		content: `<p>Ripped the last page of the Imaginarium:</p><p>${link}</p>`,
		speaker: ChatMessage.getSpeaker({ actor: actor }),
	});
}
