import { createHTMLElement, htmlQuery } from "foundry-pf2e";

async function useHeroAction(actor: ActorPF2e, item: ItemPF2e, event: Event) {
    if (
        !(actor instanceof Actor) ||
        !actor.isOfType("character") ||
        !(item instanceof Item) ||
        !item.isOfType("action", "feat")
    ) {
        ui.notifications.warn("This is not how this macro is supposed to work.");
        return false;
    }

    const heroPoints = actor.heroPoints.value;
    if (!heroPoints) {
        ui.notifications.warn(`<strong>${actor.name}</strong> doesn't have any Hero Point left.`);
        return false;
    }

    await actor.update({ "system.resources.heroPoints.value": heroPoints - 1 });

    const message = await item.toMessage(event, { create: false });
    if (!message) return;

    const content = createHTMLElement("div", {
        innerHTML: message.content,
    });

    const cardContent = htmlQuery(content, ".card-content");
    if (!cardContent) return;

    const h4 = createHTMLElement("h4", {
        innerHTML: "Spent a Hero Point",
    });

    cardContent.prepend(h4);

    message.updateSource({ content: content.innerHTML });
    getDocumentClass("ChatMessage").create(message.toObject(), { renderSheet: false });

    return false;
}

export { useHeroAction };
