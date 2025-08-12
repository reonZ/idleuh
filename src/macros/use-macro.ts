import {
    ActorPF2e,
    addStance,
    CharacterPF2e,
    ChatMessagePF2e,
    createHTMLElement,
    findItemWithSourceId,
    getStances,
    htmlQuery,
    ItemPF2e,
    R,
} from "module-helpers";

const MAN_BAT_UUID = "Compendium.idleuh.effects.Item.B0Cdt3bvfz8LW6QK";

async function useResourceAction(
    resource: UsableResource,
    actor: ActorPF2e,
    item: ItemPF2e,
    event: Event
) {
    if (
        !(actor instanceof Actor) ||
        !actor.isOfType("character") ||
        !(item instanceof Item) ||
        !item.isOfType("action", "feat")
    ) {
        ui.notifications.warn("This is not how this macro is supposed to work.");
        return;
    }

    const resourceName = game.i18n.localize(`PF2E.Actor.Resource.${resource.capitalize()}`);

    const resourcePoints = actor.system.resources[resource]?.value;
    if (!resourcePoints) {
        ui.notifications.warn(
            `<strong>${actor.name}</strong> doesn't have any ${resourceName} left.`
        );
        return;
    }

    const message = await item.toMessage(event, { create: false });
    if (!message) return;

    const content = createHTMLElement("div", {
        content: message.content,
    });

    const cardContent = (() => {
        let el = htmlQuery(content, ".card-content");

        if (!el) {
            el = createHTMLElement("div", {
                classes: ["card-content"],
            });

            const chatCard = htmlQuery(content, ".chat-card");
            const footer = htmlQuery(chatCard, "footer");

            if (footer) {
                footer.before(el);
            } else if (chatCard) {
                chatCard.append(el);
            } else {
                content.append(el);
            }
        }

        return el;
    })();

    const h4 = createHTMLElement("h4", {
        content: `Spent one of their ${resourceName}`,
    });

    cardContent.prepend(h4);

    await actor.update({ [`system.resources.${resource}.value`]: resourcePoints - 1 });

    message.updateSource({ content: content.innerHTML });

    const ChatMessagePF2e = getDocumentClass("ChatMessage");

    return ChatMessagePF2e.create(message.toObject() as ChatMessageCreateData<ChatMessagePF2e>, {
        renderSheet: false,
    });
}

function useHeroAction(actor: CharacterPF2e, item: ItemPF2e, event: Event) {
    return useResourceAction("heroPoints", actor, item, event);
}

function useFocusAction(actor: ActorPF2e, item: ItemPF2e, event: Event) {
    return useResourceAction("focus", actor, item, event);
}

async function useManBatStance(actor: CharacterPF2e, item: ItemPF2e, event: Event) {
    const exist = findItemWithSourceId(actor, MAN_BAT_UUID, "effect");
    const toDelete = R.pipe(
        getStances(actor) ?? [],
        R.map(({ effectUUID }) => findItemWithSourceId(actor, effectUUID, "effect")?.id),
        R.filter(R.isTruthy)
    );

    if (exist) {
        toDelete.push(exist.id);
    } else {
        const message = await useFocusAction(actor, item, event);
        if (message) {
            await addStance(actor, MAN_BAT_UUID, false);
        }
    }

    if (toDelete.length) {
        actor.deleteEmbeddedDocuments("Item", toDelete);
    }
}

type UsableResource = "focus" | "heroPoints";

export { useFocusAction, useHeroAction, useManBatStance };
