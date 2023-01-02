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




function $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc(...path) {
    return `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.settings.${path.join(".")}`;
}
function $ee65ef5b7d5dd2ef$export$79b67f6e2f31449(...path) {
    return `flags.${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${path.join("/")}`;
}
function $ee65ef5b7d5dd2ef$export$bdd507c72609c24e(...path) {
    path = path.filter((x)=>typeof x === "string");
    return `modules/${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}/templates/${path.join("/")}`;
}
function $ee65ef5b7d5dd2ef$export$6d1a79e7c04100c2(...path) {
    return `modules/${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}/images/${path.join("/")}`;
}


function $b29eb7e0eb12ddbc$export$8206e8d612b3e63(key) {
    return game.settings.get((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key);
}
function $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2(key, value) {
    return game.settings.set((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key, value);
}
function $b29eb7e0eb12ddbc$export$3bfe3819d89751f0(options) {
    const name = options.name;
    options.scope = options.scope ?? "world";
    options.config = options.config ?? false;
    if (options.config) {
        options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "name");
        options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "hint");
    }
    if (Array.isArray(options.choices)) options.choices = options.choices.reduce((choices, choice)=>{
        choices[choice] = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "choices", choice);
        return choices;
    }, {});
    game.settings.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}
function $b29eb7e0eb12ddbc$export$cd2f7161e4d70860(options) {
    const name = options.name;
    options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "name");
    options.label = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "label");
    options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "hint");
    options.restricted = options.restricted ?? true;
    options.icon = options.icon ?? "fas fa-cogs";
    game.settings.registerMenu((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}
function $b29eb7e0eb12ddbc$export$8cb4a6769fa1780e() {
    return game.settings.get("core", "combatTrackerConfig");
}



function $7d0b581a56a65cc7$export$38fd5ae0f7102bdb(callback) {
    game.socket.on(`module.${(0, $1623e5e7c705b7c7$export$2e2bcd8739ae039)}`, callback);
}
function $7d0b581a56a65cc7$export$a2c1d094f400f44a(packet) {
    game.socket.emit(`module.${(0, $1623e5e7c705b7c7$export$2e2bcd8739ae039)}`, packet);
}


function $9a0b513b0704079f$export$a0fd18cfa913f80d(event, actor) {
    const targets = game.user.targets;
    const [target] = targets;
    if (!actor || !actor.isOwner || !actor.isOfType("character") || targets.size !== 1 || !target.actor) {
        ui.notifications.warn("You must select a character token you own and target another one.");
        return;
    }
    const skillKeys = [
        "esoteric",
        "esoteric-lore",
        "lore-esoteric"
    ];
    const skill = Object.values(actor.system.skills).find((x)=>skillKeys.includes(x.slug));
    if (!skill) {
        ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`);
        return;
    }
    const skillName = skill.label;
    const actionSlug = "action:recall-knowledge";
    const actionName = game.i18n.localize("PF2E.RecallKnowledge.Label");
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
    options.push(actionSlug);
    options.push(`secret`);
    const dv = /** @type {Array<{type: String, value: number}>} */ target.actor.system.traits.dv;
    const vulnerability = dv.reduce((prev, curr)=>{
        if (curr.value > prev) return curr.value;
        return prev;
    }, 0);
    const v = vulnerability ? ` ${vulnerability}` : "";
    const uuid = "@UUID[Compendium.idleuh.effects.MqgbuaqGMJ92VRze]";
    const success = game.i18n.localize("PF2E.Check.Result.Degree.Check.success");
    const failure = game.i18n.localize("PF2E.Check.Result.Degree.Check.failure");
    const criticalFailure = game.i18n.localize("PF2E.Check.Result.Degree.Check.criticalFailure");
    let content = `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName}</p>`;
    content += `<p><strong>${success}</strong> ${uuid}{Effect: Exploit Vulnerability${v}}</p>`;
    content += `<p><strong>${failure}</strong> ${uuid}</p>`;
    content += `<p><strong>${criticalFailure}</strong> @UUID[Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg]</p>`;
    game.pf2e.Check.roll(new game.pf2e.CheckModifier(content, skill), {
        actor: actor,
        target: {
            actor: target.actor,
            token: target.document
        },
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



const $cd81492382603b02$var$effectID = "Item.bPm8eSVCrpYiWW2y";
const $cd81492382603b02$var$effectUUID = "Compendium.idleuh.effects.MqgbuaqGMJ92VRze";
const $cd81492382603b02$var$ffUUID = "Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg";
async function $cd81492382603b02$export$22e7686aa871dc22(event, actor) {
    const targets = game.user.targets;
    const [target] = targets;
    const targetActor = target?.actor;
    if (!actor || !actor.isOwner || !actor.isOfType("character") || targets.size !== 1 || !targetActor) {
        ui.notifications.warn("You must select a character token you own and target another one.");
        return;
    }
    const skillKeys = [
        "esoteric",
        "esoteric-lore",
        "lore-esoteric"
    ];
    const skill = Object.values(actor.system.skills).find((x)=>skillKeys.includes(x.slug));
    if (!skill) {
        ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`);
        return;
    }
    const actionSlug = "action:recall-knowledge";
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
    const targetLevel = targetActor.system.details.level.value;
    const dc = targetLevel < 0 ? 13 : DCbyLevel[targetLevel];
    const options = actor.getRollOptions([
        "all",
        "skill-check",
        "Esoteric"
    ]);
    options.push(actionSlug);
    options.push(`secret`);
    const dv = targetActor.system.attributes.weaknesses;
    const vulnerability = dv.reduce((prev, curr)=>{
        if (curr.value > prev) return curr.value;
        return prev;
    }, 0);
    const roll = await game.pf2e.Check.roll(new game.pf2e.CheckModifier("test", skill), {
        actor: actor,
        target: {
            actor: targetActor,
            token: target.document
        },
        title: game.i18n.format("PF2E.SkillCheckWithName", {
            skillName: "Esoteric"
        }),
        type: "skill-check",
        options: options,
        dc: {
            value: dc
        },
        createMessage: false
    }, event);
    const total = roll.total ?? 0;
    const success = $cd81492382603b02$var$getSuccess(roll, dc);
    const packet = {
        type: "exploit-vulnerability",
        actorId: actor.id,
        targetId: target.id,
        dc: dc,
        success: success,
        total: total,
        vulnerability: vulnerability
    };
    if (game.user.isGM) $cd81492382603b02$export$430ded1de715a605(packet);
    else (0, $7d0b581a56a65cc7$export$a2c1d094f400f44a)(packet);
}
async function $cd81492382603b02$export$430ded1de715a605({ actorId: actorId , targetId: targetId , success: success , vulnerability: vulnerability , dc: dc , total: total  }) {
    const actor = game.actors.get(actorId);
    const targetActor = canvas.tokens.get(targetId)?.actor;
    if (!actor || !targetActor) return;
    canvas.tokens.placeables.forEach((token)=>{
        const tokenActor = token.actor;
        if (!tokenActor || tokenActor === actor) return;
        const effect = $cd81492382603b02$var$getEffect(tokenActor);
        if (tokenActor === targetActor) {
            if (success <= 0 && effect) effect.delete();
            else if (success >= 1 && !effect) $cd81492382603b02$var$addEffect(tokenActor);
        } else if (effect) effect.delete();
    });
    const effect = $cd81492382603b02$var$getEffect(actor);
    if (success >= 1) {
        const badge = success >= 2 && vulnerability || 1;
        if (!effect) $cd81492382603b02$var$addEffect(actor, badge);
        else if (effect.badge?.value !== badge) effect.update({
            "system.badge.value": badge
        });
    } else {
        effect?.delete();
        $cd81492382603b02$var$addFlatFooted(actor);
    }
    $cd81492382603b02$var$createMsg(actor, targetActor, dc, total, success);
}
function $cd81492382603b02$var$getSuccess(roll, dc) {
    const total = roll.total;
    const die = roll.dice[0].total;
    let success = total >= dc + 10 ? 3 : total >= dc ? 2 : total > dc - 10 ? 1 : 0;
    if (die === 20) success++;
    else if (die === 1) success--;
    return success;
}
function $cd81492382603b02$var$createMsg(actor, target, dc, total, success) {
    const by = total - dc;
    const css = success >= 3 ? "criticalSuccess" : success === 2 ? "success" : success === 1 ? "failure" : "criticalFailure";
    const txt = success >= 3 ? "Critical Success" : success === 2 ? "Success" : success === 1 ? "Failure" : "Critical Failure";
    let flavor = `<h4 class="action"><span class="pf2-icon">A</span> <b>Exploit Vulnerability</b> <p class="compact-text">(Esoteric Check)</p></h4>
<div class="target-dc-result" data-visibility="gm">
    <div class="target-dc" data-visibility="gm"><span data-visibility="gm" data-whose="target">
        Target: ${target.name}</span> <span data-visibility="gm" data-whose="target">(Standard DC ${dc})</span></div>
    <div class="result degree-of-success" data-visibility="gm">Result: 
        <span data-whose="self" class="${css}">${txt}</span> <span data-whose="target">by ${by >= 0 ? "+" : ""}${by}</span>
    </div>
</div>`;
    if (success >= 3) flavor += `<section class="roll-note">
    <strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, 
    you have a flash of insight that grants even more knowledge about the creature. 
    You learn all of the creature's resistances, weaknesses, and immunities, 
    including the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, 
    such as what spells will pass through a golem's antimagic. 
    You can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). 
    Your unarmed and weapon Strikes against the creature also become magical if they weren't already.
</section>`;
    else if (success === 2) flavor += `<section class="roll-note">
    <strong>Success</strong> You recall an important fact about the creature, 
    learning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, 
    resistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. 
    Your unarmed and weapon Strikes against the creature also become magical if they weren't already.
</section>`;
    else if (success === 1) flavor += `<section class="roll-note">
    <strong>Failure</strong> Failing to recall a salient weakness about the creature, 
    you instead attempt to exploit a more personal vulnerability. 
    You can exploit only the creature's personal antithesis. 
    Your unarmed and weapon Strikes against the creature also become magical if they weren't already.
</section>`;
    else flavor += `<section class="roll-note">
<strong>Critical Failure</strong> You couldn't remember the right object to use and become distracted while you rummage through your esoterica. 
You become flat-footed until the beginning of your next turn.
</section>`;
    ChatMessage.create({
        flavor: flavor,
        actor: actor
    });
}
function $cd81492382603b02$var$getEffect(actor) {
    return actor.itemTypes.effect.find((effect)=>effect.getFlag("core", "sourceId") === $cd81492382603b02$var$effectID);
}
async function $cd81492382603b02$var$addEffect(actor, badge) {
    const data = (await fromUuid($cd81492382603b02$var$effectUUID)).toObject();
    if (badge) setProperty(data, "system.badge.value", badge);
    actor.createEmbeddedDocuments("Item", [
        data
    ]);
}
async function $cd81492382603b02$var$addFlatFooted(actor) {
    const hasEffect = actor.itemTypes.condition.some((x)=>x.getFlag("core", "sourceId") === $cd81492382603b02$var$ffUUID);
    if (hasEffect) return;
    const data = (await fromUuid($cd81492382603b02$var$ffUUID)).toObject();
    actor.createEmbeddedDocuments("Item", [
        data
    ]);
}



/** Check if a key is present in a given object in a type safe way */ function $42b0de5e6394e858$export$c9d769b6fdd2a91d(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}


/** Check if an element is present in the provided set. Especially useful for checking against literal sets */ function $39b388830effa69c$export$7fd671bc170c6856(set, value) {
    return set.has(value);
}


const $1411bf92270cf048$export$c6f5f26a78b4295b = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "treasure",
    "weapon"
]);
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
function $1411bf92270cf048$export$d2ea10be675672b(source) {
    return $1411bf92270cf048$export$9e72cd1a981905c2(source) && "invested" in source.system.equipped;
}
function $1411bf92270cf048$export$9e72cd1a981905c2(source) {
    return (0, $39b388830effa69c$export$7fd671bc170c6856)($1411bf92270cf048$export$c6f5f26a78b4295b, source.type);
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
        const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs", {
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


const $4d5f7ddf43e0f7d9$var$packId = "pf2e.spells-srd";
const $4d5f7ddf43e0f7d9$var$bookId = "Item.dcALVAyJbYSovzqt";
async function $4d5f7ddf43e0f7d9$export$8336e602fcba102(actor) {
    if (!actor) return ui.notifications.warn("You must select an actor with the Imaginarium");
    const book = actor.itemTypes.equipment.find((x)=>x.getFlag("core", "sourceId") === $4d5f7ddf43e0f7d9$var$bookId);
    if (!book || book.system.equipped.carryType === "dropped") return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession");
    const level = Math.floor(actor.level / 2);
    const pack = game.packs.get($4d5f7ddf43e0f7d9$var$packId);
    const index = await pack.getIndex({
        fields: [
            "system.level.value",
            "system.traits",
            "system.category.value"
        ]
    });
    const spells = index.filter((x)=>x.system.level.value === level && !x.system.traits.value.includes("cantrip") && x.system.category.value !== "ritual" && x.system.category.value !== "focus" && x.system.traits.rarity === "common");
    const roll = Math.floor(Math.random() * spells.length);
    const spell = spells[roll];
    const uuid = `Compendium.${$4d5f7ddf43e0f7d9$var$packId}.${spell._id}`;
    ChatMessage.create({
        content: `<p>Ripped the last page of the Imaginarium</p><p>@UUID[${uuid}]</p>`,
        speaker: ChatMessage.getSpeaker(actor)
    });
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




const $23d7d704d6e2c579$var$effectId = "Item.pFguo7KVVjFMqHhe";
function $23d7d704d6e2c579$export$7951567bc4ba61eb(enable) {
    if (!game.user.isGM) return;
    const method = enable ? "on" : "off";
    Hooks[method]("updateToken", $23d7d704d6e2c579$var$updateToken);
}
function $23d7d704d6e2c579$var$getDebuff(actor) {
    return actor.itemTypes.effect.find((x)=>x.getFlag("core", "sourceId") === $23d7d704d6e2c579$var$effectId);
}
function $23d7d704d6e2c579$var$updateToken(token, data) {
    const actor = token.actor;
    if (!("x" in data || "y" in data) || !actor) return;
    const debuff = $23d7d704d6e2c579$var$getDebuff(actor);
    if (debuff) $23d7d704d6e2c579$var$setDebuff(token, debuff);
}
function $23d7d704d6e2c579$var$setDebuff(firstToken, firstDebuff) {
    let otherToken;
    let otherDebuff;
    const tokens = canvas.tokens.placeables;
    for (const token of tokens){
        const otherActor = token.actor;
        if (!otherActor || otherActor === firstToken.actor) continue;
        const debuff = $23d7d704d6e2c579$var$getDebuff(otherActor);
        if (!debuff) continue;
        otherToken = token;
        otherDebuff = debuff;
        break;
    }
    if (!otherToken || !otherDebuff) {
        firstDebuff.update({
            "system.badge.value": 0
        });
        return;
    }
    const distance = canvas.grid.measureDistance(firstToken, otherToken, {
        gridSpaces: true
    });
    const squares = distance / 5;
    const debuff1 = squares <= (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("bffDistance") ? 1 : 0;
    firstDebuff.update({
        "system.badge.value": debuff1
    });
    otherDebuff.update({
        "system.badge.value": debuff1
    });
}


Hooks.once("init", ()=>{
    (0, $f13521bdeed07ab3$export$afac0fc6c5fe0d6)().api = {
        macros: {
            esotericCheck: $9a0b513b0704079f$export$a0fd18cfa913f80d,
            exploitVulnerability: $cd81492382603b02$export$22e7686aa871dc22,
            manualToken: $dcd79b6d4f0a91cd$export$918e4924dfc1c5e7,
            groupPerception: $3f81a3961091a2a4$export$2d5babad0c808e82,
            identify: $2e8e7adddb97c14f$export$65e5b62a4c490288,
            ripImaginarium: $4d5f7ddf43e0f7d9$export$8336e602fcba102
        }
    };
    game.settings.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), "bff", {
        name: "Enable BFF's Ire",
        hint: "Should the BFF's Ire be handled.",
        type: Boolean,
        default: true,
        config: true,
        scope: "world",
        onChange: (0, $23d7d704d6e2c579$export$7951567bc4ba61eb)
    });
    game.settings.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), "bffDistance", {
        name: "BFF's Ire Distance",
        hint: "Distance in square(s) for the curse to apply.",
        type: Number,
        default: 1,
        config: true,
        scope: "world"
    });
});
Hooks.once("ready", ()=>{
    if ((0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("bff")) (0, $23d7d704d6e2c579$export$7951567bc4ba61eb)(true);
    if (game.user.isGM) (0, $7d0b581a56a65cc7$export$38fd5ae0f7102bdb)($b013a5dd6d18443e$var$onSocket);
});
function $b013a5dd6d18443e$var$onSocket(packet) {
    if (packet.type === "exploit-vulnerability") (0, $cd81492382603b02$export$430ded1de715a605)(packet);
}


//# sourceMappingURL=main.js.map
