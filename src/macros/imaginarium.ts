import { createChatLink, createConsumableFromSpell, findItemWithSourceId } from "foundry-helpers";
import { ActorPF2e, OneToTen, SpellPF2e } from "foundry-pf2e";
import CompendiumCollection from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";

const packId = "pf2e.spells-srd";
const IMAGINARIUM = "Item.dcALVAyJbYSovzqt";

export async function ripImaginarium(actor?: ActorPF2e) {
    const pack = game.packs.get<CompendiumCollection<SpellPF2e<null>>>(packId);
    if (!pack) return;

    if (!actor?.isOfType("character")) {
        return ui.notifications.warn("You must select a character with the Imaginarium.");
    }

    const book = findItemWithSourceId(actor, IMAGINARIUM, "equipment");
    if (!book || book.system.equipped.carryType === "dropped") {
        return ui.notifications.warn("This character doesn't have the Imaginarium in their possession");
    }

    const rank = Math.max(1, Math.floor(actor.level / 2)) as OneToTen;
    const index = await pack.getIndex({
        fields: ["system.level.value", "system.traits", "system.ritual"],
    });

    const entries = index.filter(
        (x) =>
            x.system.level.value <= rank &&
            !x.system.traits.value.includes("cantrip") &&
            !x.system.traits.value.includes("focus") &&
            !x.system.ritual &&
            x.system.traits.rarity === "common",
    );

    const roll = Math.floor(Math.random() * entries.length);
    const spell = await pack.getDocument(entries[roll]._id);
    const scroll =
        spell &&
        (await createConsumableFromSpell(spell, {
            type: "scroll",
            heightenedLevel: rank,
        }));

    if (!scroll) {
        ui.notifications.error("An error occured while creating an imaginarium scroll");
        return;
    }

    scroll.name = `${scroll.name} *`;
    foundry.utils.setProperty(scroll, "system.price.value", {});

    const [item] = await actor.createEmbeddedDocuments("Item", [scroll]);
    const link = createChatLink(spell, { label: item.name });

    const ChatMessagePF2e = getDocumentClass("ChatMessage");
    ChatMessagePF2e.create({
        content: `<p>Ripped the last page of the Imaginarium:</p><p>${link}</p>`,
        speaker: ChatMessagePF2e.getSpeaker({ actor }),
    });
}
