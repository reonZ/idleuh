var $1623e5e7c705b7c7$export$2e2bcd8739ae039 = "idleuh";


function $f13521bdeed07ab3$export$90835e7e06f4e75b(id) {
    return game.modules.get(id);
}
function $f13521bdeed07ab3$export$afac0fc6c5fe0d6() {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039));
}
function $f13521bdeed07ab3$export$d60ce5b76fc8cf55(id) {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b(id)?.api;
}


function $9a0b513b0704079f$export$a0fd18cfa913f80d(event, actor) {
    const targets = game.user.targets;
    const [target] = targets;
    if (!actor || !actor.isOwner || !actor.isOfType("character") || targets.size !== 1 || !target.actor) {
        ui.notifications.warn("You must select a character token you own and target another one.");
        return;
    }
    const skillName = "Esoteric";
    const skillKey = "esoteric";
    const actionSlug = "action:recall-knowledge";
    const actionName = "Recall Knowledge";
    if (!(skillKey in actor.system.skills)) {
        ui.notifications.warn(`This character doesn't have the '${skillName}' skill`);
        return;
    }
    const DCbyLevel = [
        14,
        15,
        16,
        18,
        19,
        20,
        22,
        23,
        24,
        26,
        27,
        28,
        30,
        31,
        32,
        34,
        35,
        36,
        38,
        39,
        40,
        42,
        44,
        46,
        48,
        50
    ];
    const targetLevel = target.actor.system.details.level.value;
    const DC = targetLevel < 0 ? 13 : DCbyLevel[targetLevel];
    const options = actor.getRollOptions([
        "all",
        "skill-check",
        skillName.toLowerCase()
    ]);
    options.push(`action:${actionSlug}`);
    options.push(`secret`);
    const dv = /** @type {Array<{type: String, value: number}>} */ target.actor.system.traits.dv;
    const vulnerability = dv.reduce((prev, curr)=>{
        if (curr.value > prev) return curr.value;
        return prev;
    }, 0);
    const v = vulnerability ? ` ${vulnerability}` : "";
    const link = `@UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]{Effect: Exploit Vulnerability${v}}`;
    game.pf2e.Check.roll(new game.pf2e.CheckModifier(`<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName} Skill Check</p><p><strong>Success</strong> ${link}</p><p><strong>Failure</strong> @UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]{Effect: Exploit Vulnerability}</p><p><strong>Critical Failure</strong> @UUID[Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg]{Flat-Footed}</p>`, actor.system.skills[skillKey]), {
        actor: actor,
        title: game.i18n.format("PF2E.SkillCheckWithName", {
            skillName: skillName
        }),
        type: "skill-check",
        options: options,
        dc: {
            value: DC
        }
    }, event);
}



function $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc(...path) {
    return `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.settings.${path.join(".")}`;
}
function $ee65ef5b7d5dd2ef$export$79b67f6e2f31449(...path) {
    return `flags.${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${path.join("/")}`;
}
function $ee65ef5b7d5dd2ef$export$bdd507c72609c24e(...path) {
    return `modules/${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}/templates/${path.join("/")}`;
}


/** Check if a key is present in a given object in a type safe way */ function $42b0de5e6394e858$export$c9d769b6fdd2a91d(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}


/** Check if an element is present in the provided set. Especially useful for checking against literal sets */ function $39b388830effa69c$export$7fd671bc170c6856(set, value) {
    return set.has(value);
}


const $1411bf92270cf048$export$12237db074fd27c0 = new Map([
    [
        -1,
        13
    ],
    [
        0,
        14
    ],
    [
        1,
        15
    ],
    [
        2,
        16
    ],
    [
        3,
        18
    ],
    [
        4,
        19
    ],
    [
        5,
        20
    ],
    [
        6,
        22
    ],
    [
        7,
        23
    ],
    [
        8,
        24
    ],
    [
        9,
        26
    ],
    [
        10,
        27
    ],
    [
        11,
        28
    ],
    [
        12,
        30
    ],
    [
        13,
        31
    ],
    [
        14,
        32
    ],
    [
        15,
        34
    ],
    [
        16,
        35
    ],
    [
        17,
        36
    ],
    [
        18,
        38
    ],
    [
        19,
        39
    ],
    [
        20,
        40
    ],
    [
        21,
        42
    ],
    [
        22,
        44
    ],
    [
        23,
        46
    ],
    [
        24,
        48
    ],
    [
        25,
        50
    ]
]);
const $1411bf92270cf048$export$3db6e09beb50ed02 = new Map([
    [
        "incredibly easy",
        -10
    ],
    [
        "very easy",
        -5
    ],
    [
        "easy",
        -2
    ],
    [
        "normal",
        0
    ],
    [
        "hard",
        2
    ],
    [
        "very hard",
        5
    ],
    [
        "incredibly hard",
        10
    ]
]);
const $1411bf92270cf048$export$e1912d3e02f0714c = new Set([
    "arcane",
    "divine",
    "occult",
    "primal"
]);
function $1411bf92270cf048$export$3b19b78776a9c55c(dc, adjustment = "normal") {
    return dc + ($1411bf92270cf048$export$3db6e09beb50ed02.get(adjustment) ?? 0);
}
function $1411bf92270cf048$export$49278407fc99568c(rarity = "common") {
    if (rarity === "uncommon") return "hard";
    else if (rarity === "rare") return "very hard";
    else if (rarity === "unique") return "incredibly hard";
    else return "normal";
}
function $1411bf92270cf048$export$285e1d124f214ce6(dc, rarity = "common") {
    return $1411bf92270cf048$export$3b19b78776a9c55c(dc, $1411bf92270cf048$export$49278407fc99568c(rarity));
}
function $1411bf92270cf048$export$bcb07a78a2f89083(level, { proficiencyWithoutLevel: proficiencyWithoutLevel = false , rarity: rarity = "common"  } = {}) {
    // assume level 0 if garbage comes in. We cast level to number because the backing data may actually have it
    // stored as a string, which we can't catch at compile time
    const dc = $1411bf92270cf048$export$12237db074fd27c0.get(level) ?? 14;
    if (proficiencyWithoutLevel) // -1 shouldn't be subtracted since it's just
    // a creature level and not related to PC levels
    return $1411bf92270cf048$export$285e1d124f214ce6(dc - Math.max(level, 0), rarity);
    else return $1411bf92270cf048$export$285e1d124f214ce6(dc, rarity);
}
/** Extract all traits from an item, that match a magic tradition */ function $1411bf92270cf048$var$getMagicTraditions(item) {
    const traits = item.system.traits.value;
    return new Set(traits.filter((t)=>(0, $39b388830effa69c$export$7fd671bc170c6856)($1411bf92270cf048$export$e1912d3e02f0714c, t)));
}
function $1411bf92270cf048$export$88dab0cc25983d19(item, baseDc, notMatchingTraditionModifier) {
    const result = {
        occult: baseDc,
        primal: baseDc,
        divine: baseDc,
        arcane: baseDc
    };
    const traditions = $1411bf92270cf048$var$getMagicTraditions(item);
    for (const key of $1411bf92270cf048$export$e1912d3e02f0714c)// once an item has a magic tradition, all skills
    // that don't match the tradition are hard
    if (traditions.size > 0 && !traditions.has(key)) result[key] = baseDc + notMatchingTraditionModifier;
    return {
        arc: result.arcane,
        nat: result.primal,
        rel: result.divine,
        occ: result.occult
    };
}
function $1411bf92270cf048$export$eac0396674c51d5e(item) {
    return item.traits.has("cursed") ? "unique" : item.rarity;
}
function $1411bf92270cf048$export$550a429caca7a4dc(item, { proficiencyWithoutLevel: proficiencyWithoutLevel = false , notMatchingTraditionModifier: notMatchingTraditionModifier  }, noDC = false) {
    const baseDC = $1411bf92270cf048$export$bcb07a78a2f89083(item.level, {
        proficiencyWithoutLevel: proficiencyWithoutLevel
    });
    const rarity = $1411bf92270cf048$export$eac0396674c51d5e(item);
    const dc = $1411bf92270cf048$export$285e1d124f214ce6(baseDC, rarity);
    if (item.isMagical) return $1411bf92270cf048$export$88dab0cc25983d19(item, dc, notMatchingTraditionModifier);
    if (!noDC) return {
        cra: dc
    };
    if (item.isAlchemical) return {
        cra: dc
    };
    return {
        dc: dc
    };
}


class $0f4af9d9fc41700b$export$f6e5b10ec9edfc3b extends Application {
    constructor(items, options){
        super(options);
        this.items = items;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "idleuh-identify",
            title: "Identify Items",
            template: (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("identify.html"),
            width: 500
        });
    }
    getData(options) {
        return mergeObject(super.getData(options), {
            items: this.items.map((item)=>{
                const data = item.system.identification.identified;
                const identified = item.isIdentified;
                const checked = !identified && item.getFlag("world", "identify.checked");
                const classes = [];
                if (identified) classes.push("identified");
                if (checked) classes.push("checked");
                return {
                    uuid: item.uuid,
                    img: data.img,
                    name: item.isOfType("treasure") ? `($) ${data.name}` : data.name,
                    css: classes.join(" "),
                    identified: identified,
                    checked: checked
                };
            })
        });
    }
    activateListeners(html) {
        // super.activateListeners(html)
        html.find('[data-action="chat"]').on("click", this.#onChat.bind(this));
        html.find('[data-action="checks"]').on("click", this.#onChecks.bind(this));
        html.find('[data-action="identify"]').on("click", this.#onIdentify.bind(this));
        html.find('[data-action="remove"]').on("click", this.#onRemove.bind(this));
        html.find('[data-action="reset"]').on("click", this.#onReset.bind(this));
    }
    async #onChat(event) {
        const item = await $0f4af9d9fc41700b$var$getItemFromEvent(event);
        item?.toMessage(undefined, {
            create: true
        });
    }
    async #onChecks(event1) {
        const item1 = await $0f4af9d9fc41700b$var$getItemFromEvent(event1);
        if (!item1) return;
        const itemImg = item1.system.identification.unidentified.img;
        const itemName = item1.system.identification.unidentified.name;
        const identifiedName = item1.system.identification.identified.name;
        const notMatchingTraditionModifier = game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier");
        const proficiencyWithoutLevel = game.settings.get("pf2e", "proficiencyVariant") === "ProficiencyWithoutLevel";
        const dcs = (0, $1411bf92270cf048$export$550a429caca7a4dc)(item1, {
            proficiencyWithoutLevel: proficiencyWithoutLevel,
            notMatchingTraditionModifier: notMatchingTraditionModifier
        });
        const skills = Object.entries(dcs).filter(([shortForm, dc])=>Number.isInteger(dc) && (0, $42b0de5e6394e858$export$c9d769b6fdd2a91d)(CONFIG.PF2E.skills, shortForm)).map(([shortForm, dc])=>({
                shortForm: shortForm,
                dc: dc,
                name: game.i18n.localize(CONFIG.PF2E.skills[shortForm])
            }));
        const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.html", {
            itemImg: itemImg,
            itemName: itemName,
            identifiedName: identifiedName,
            skills: skills
        });
        await ChatMessage.create({
            user: game.user.id,
            content: content
        });
    }
    async #onIdentify(event2) {
        const item2 = await $0f4af9d9fc41700b$var$getItemFromEvent(event2);
        if (!item2) return;
        await item2.update({
            "system.identification.status": item2.isIdentified ? "unidentified" : "identified",
            "system.identification.unidentified": item2.getMystifiedData("unidentified"),
            "flags.world.identify.checked": false
        });
        this.render();
    }
    async #onRemove(event3) {
        const item3 = await $0f4af9d9fc41700b$var$getItemFromEvent(event3);
        if (!item3) return;
        const checked = item3.getFlag("world", "identify.checked");
        await item3.setFlag("world", "identify.checked", !checked);
        this.render();
    }
    async #onReset(event4) {
        event4.preventDefault();
        for (const item4 of this.items){
            if (item4.isIdentified || !item4.getFlag("world", "identify.checked")) continue;
            await item4.setFlag("world", "identify.checked", false);
        }
        this.render();
    }
}
async function $0f4af9d9fc41700b$var$getItemFromEvent(event) {
    const parent = $(event.currentTarget).closest("[data-item]");
    const uuid = parent.attr("data-item");
    const item = await fromUuid(uuid);
    if (!item) parent.remove();
    return item;
}


function $2e8e7adddb97c14f$export$65e5b62a4c490288() {
    if (!game.user.isGM) {
        ui.notifications.warn("You not the GM yo!");
        return;
    }
    const actors = game.actors;
    const items = actors.reduce((acc, actor)=>{
        if (!actor.hasPlayerOwner) return acc;
        const filtered = actor.items.filter((item)=>item.isOfType("physical") && !item.isIdentified);
        acc.push(...filtered);
        return acc;
    }, []);
    new (0, $0f4af9d9fc41700b$export$f6e5b10ec9edfc3b)(items).render(true);
}



class $1c772bac1c8002c4$export$c18436ab3784cae9 extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "idleuh-manual-token",
            template: (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("manual-token.html"),
            title: "Manual Token Update",
            width: 500
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("button[type=button]").on("click", ()=>this.close());
        const scale = html.find("input[name=scale]");
        const scaleValue = scale.next("span");
        scale.on("input", ()=>{
            const val = scale[0].valueAsNumber;
            scaleValue.text(val.toFixed(2));
        });
        const grid = html.find("input[name=grid]");
        const gridValue = grid.next("span");
        grid.on("input", ()=>{
            const val = grid[0].valueAsNumber;
            gridValue.text(val.toFixed(1));
        });
    }
    async _updateObject(event, formData) {
        const data = this.object;
        const newData = {
            ["displayName"]: Number(formData.name),
            ["displayBars"]: Number(formData.hp),
            ["texture.src"]: formData.img,
            ["flags.pf2e.linkToActorSize"]: !!formData.link,
            ["width"]: Number(formData.grid),
            ["height"]: Number(formData.grid),
            ["texture.scaleX"]: Number(formData.scale),
            ["texture.scaleY"]: Number(formData.scale)
        };
        const update = {};
        for (const [k, v] of Object.entries(newData)){
            if (getProperty(data, k) === v) continue;
            setProperty(update, k, v);
        }
        if (Object.keys(update).length) this.object.update(update);
    }
}


async function $dcd79b6d4f0a91cd$export$918e4924dfc1c5e7(token) {
    if (!token || !token.isOwner) {
        ui.notifications.warn("You need to select an owned token.");
        return;
    }
    new (0, $1c772bac1c8002c4$export$c18436ab3784cae9)(token.document).render(true);
}


const $3f81a3961091a2a4$var$proficiency = [
    "trained",
    "expert",
    "master",
    "legendary",
    "untrained"
];
async function $3f81a3961091a2a4$export$2d5babad0c808e82() {
    if (!game.user.isGM) {
        ui.notifications.warn("You not the GM yo!");
        return;
    }
    let result = "<hr>";
    const tokens = canvas.tokens;
    for (const token of tokens.placeables){
        const actor = token.actor;
        if (!actor || !actor.isOfType("character", "npc") || !actor.hasPlayerOwner || !actor.attributes.perception) continue;
        result += await $3f81a3961091a2a4$var$rollPerception(actor);
    }
    ChatMessage.create({
        content: result,
        flavor: "Group Perception Checks",
        whisper: [
            game.user.id
        ]
    });
}
async function $3f81a3961091a2a4$var$rollPerception(actor) {
    const perception = actor.attributes.perception;
    const check = new game.pf2e.CheckModifier("", perception);
    const roll = await game.pf2e.Check.roll(check, {
        actor: actor,
        type: "skill-check",
        createMessage: false,
        skipDialog: true
    });
    if (!roll) return "";
    const rank = $3f81a3961091a2a4$var$proficiency[(perception.rank ?? 1) - 1];
    const die = roll.dice[0].total;
    if (die === undefined) return "";
    let result = `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`;
    result += `<span>${actor.name} (${rank})</span><span`;
    if (die == 20) result += ' style="color: green;"';
    else if (die == 1) result += ' style="color: red;"';
    return `${result}>${roll.total}</span></div>`;
}


Hooks.once("init", ()=>{
    (0, $f13521bdeed07ab3$export$afac0fc6c5fe0d6)().api = {
        macros: {
            esotericCheck: $9a0b513b0704079f$export$a0fd18cfa913f80d,
            manualToken: $dcd79b6d4f0a91cd$export$918e4924dfc1c5e7,
            groupPerception: $3f81a3961091a2a4$export$2d5babad0c808e82,
            identify: $2e8e7adddb97c14f$export$65e5b62a4c490288
        }
    };
});


//# sourceMappingURL=main.js.map
