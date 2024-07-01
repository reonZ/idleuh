import {
    R,
    addListenerAll,
    getFlag,
    getItemIdentificationDCs,
    htmlClosest,
    isInstanceOf,
    isOwnedItem,
    render,
    setFlag,
} from "foundry-pf2e";

class IdentifyPopup extends foundry.applications.api.ApplicationV2 {
    #items: PhysicalItemPF2e[];

    constructor(items: PhysicalItemPF2e[], options?: PartialApplicationConfiguration) {
        super(options);
        this.#items = items;
    }

    static DEFAULT_OPTIONS: PartialApplicationConfiguration = {
        window: {
            resizable: false,
            minimizable: true,
            frame: true,
            positioned: true,
            title: "Identifying some good shit",
        },
        position: {
            height: "auto",
            width: 500,
        },
        id: "idleuh-identify",
    };

    async _prepareContext(options: ApplicationRenderOptions): Promise<ApplicationRenderContext> {
        return {
            items: this.#items.map((item) => {
                const data = item.system.identification.identified;
                const identified = item.isIdentified;
                const checked = !identified && getFlag(item, "identify.checked");

                const classes: string[] = [];
                if (identified) classes.push("identified");
                if (checked) classes.push("checked");

                return {
                    uuid: item.uuid,
                    img: data.img,
                    name: item.isOfType("treasure") ? `($) ${data.name}` : data.name,
                    css: classes.join(" "),
                    identified,
                    checked,
                };
            }),
        };
    }

    async _renderHTML(context: IdentifyContext, options: ApplicationRenderOptions) {
        return render("identify", context);
    }

    _replaceHTML(result: string, content: HTMLElement, options: ApplicationRenderOptions) {
        content.innerHTML = result;
    }

    async _onClickAction(event: PointerEvent, target: HTMLElement) {
        const action = target.dataset.action as ActionType;

        if (action === "reset") {
            await Promise.all(
                this.#items.map((item) => {
                    if (item.isIdentified || !getFlag(item, "identify.checked")) return;
                    return setFlag(item, "identify.checked", false);
                })
            );
            this.render();
            return;
        }

        const uuid = htmlClosest(target, "[data-uuid]")?.dataset.uuid ?? "";
        const item = await fromUuid(uuid);
        if (!isInstanceOf(item, "ItemPF2e") || !item.isOfType("physical")) return;

        switch (action) {
            case "chat": {
                item.toMessage(event);
                break;
            }

            case "checks": {
                const identifiedName = item.system.identification.identified.name;
                const dcs: Record<string, number> = getItemIdentificationDCs(item, {
                    pwol: game.pf2e.settings.variants.pwol.enabled,
                    notMatchingTraditionModifier: game.settings.get(
                        "pf2e",
                        "identifyMagicNotMatchingTraditionModifier"
                    ),
                });
                const action = item.isMagical
                    ? "identify-magic"
                    : item.isAlchemical
                    ? "identify-alchemy"
                    : "recall-knowledge";

                const content = await renderTemplate(
                    "systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",
                    {
                        identifiedName,
                        action,
                        skills: R.omit(dcs, ["dc"]),
                        unidentified: item.system.identification.unidentified,
                        uuid: item.uuid,
                    }
                );

                await getDocumentClass("ChatMessage").create({ author: game.user.id, content });
                break;
            }

            case "identify": {
                await item.setIdentificationStatus(
                    item.isIdentified ? "unidentified" : "identified"
                );
                this.render();
                break;
            }

            case "remove": {
                const checked = getFlag(item, "identify.checked");
                await setFlag(item, "identify.checked", !checked);
                this.render();
                break;
            }
        }
    }
}

function identify() {
    if (!game.user.isGM) {
        ui.notifications.warn("You not the GM yo!");
        return;
    }

    const items = R.pipe(
        game.actors.party?.members ?? [],
        R.flatMap((actor) => actor.inventory.filter((item) => !item.isIdentified))
    );

    console.log(items);

    new IdentifyPopup(items).render(true);
}

type ActionType = "chat" | "identify" | "checks" | "remove" | "reset";

type IdentifyItem = {
    uuid: string;
    img: string;
    name: string;
    css: string;
    identified: boolean;
    checked: boolean;
};

type IdentifyContext = {
    items: IdentifyItem[];
};

export { identify };
