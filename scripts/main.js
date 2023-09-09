(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/macros/shared/esoteric.js
  function getEsotericSkill(actor) {
    const skillKeys = ["esoteric", "esoteric-lore", "lore-esoteric"];
    const skill = Object.values(actor.skills).find((x) => skillKeys.includes(x.slug));
    if (!skill)
      ui.notifications.warn(`This character doesn't have the 'Esoteric' skill`);
    return skill;
  }
  __name(getEsotericSkill, "getEsotericSkill");

  // src/macros/esoteric.js
  function esotericCheck(event, actor) {
    if (!actor || !actor.isOwner || !actor.isOfType("character")) {
      ui.notifications.warn("You must select a character token you own.");
      return;
    }
    const skill = getEsotericSkill(actor);
    if (!skill)
      return;
    const extraRollOptions = /* @__PURE__ */ new Set();
    const extraRollNotes = [
      {
        text: `Can be used to Recall Knowledge regarding haunts, curses 
    and creatures of any type, but can't be used to Recall Knowledge of other topics.`
      }
    ];
    skill.roll({
      rollMode: "blindroll",
      extraRollNotes,
      options: extraRollOptions
    });
  }
  __name(esotericCheck, "esotericCheck");

  // src/module.js
  var MODULE_ID = "idleuh";
  function getSetting(key) {
    return game.settings.get(MODULE_ID, key);
  }
  __name(getSetting, "getSetting");
  function socketOn(callback) {
    game.socket.on(`module.${MODULE_ID}`, callback);
  }
  __name(socketOn, "socketOn");
  function socketEmit(packet) {
    game.socket.emit(`module.${MODULE_ID}`, packet);
  }
  __name(socketEmit, "socketEmit");
  function templatePath(...path) {
    path = path.filter((x) => typeof x === "string");
    return `modules/${MODULE_ID}/templates/${path.join("/")}`;
  }
  __name(templatePath, "templatePath");
  function chatUUID(uuid, name) {
    if (name)
      return `@UUID[${uuid}]{${name}}`;
    return `@UUID[${uuid}]`;
  }
  __name(chatUUID, "chatUUID");
  function getItemSourceIdCondition(sourceId) {
    return Array.isArray(sourceId) ? (item) => includesSourceId(item, sourceId) : (item) => getSourceId(item) === sourceId;
  }
  __name(getItemSourceIdCondition, "getItemSourceIdCondition");
  function getItems(actor, itemTypes) {
    return itemTypes ? itemTypes.flatMap((type) => actor.itemTypes[type]) : actor.items;
  }
  __name(getItems, "getItems");
  function findItemWithSourceId(actor, sourceId, itemTypes) {
    return getItems(actor, itemTypes).find(getItemSourceIdCondition(sourceId));
  }
  __name(findItemWithSourceId, "findItemWithSourceId");
  function getSourceId(doc) {
    return doc.getFlag("core", "sourceId");
  }
  __name(getSourceId, "getSourceId");
  function includesSourceId(doc, list) {
    const sourceId = getSourceId(doc);
    return sourceId ? list.includes(sourceId) : false;
  }
  __name(includesSourceId, "includesSourceId");
  function hasItemWithSourceId(actor, sourceId, itemTypes) {
    return getItems(actor, itemTypes).some(getItemSourceIdCondition(sourceId));
  }
  __name(hasItemWithSourceId, "hasItemWithSourceId");

  // src/pf2e.js
  var MAGIC_TRADITIONS = /* @__PURE__ */ new Set(["arcane", "divine", "occult", "primal"]);
  function getItemIdentificationDCs(item, { proficiencyWithoutLevel = false, notMatchingTraditionModifier }) {
    const baseDC = calculateDC(item.level, { proficiencyWithoutLevel });
    const rarity = getDcRarity(item);
    const dc = adjustDCByRarity(baseDC, rarity);
    if (item.isMagical) {
      return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
    } else if (item.isAlchemical) {
      return { crafting: dc };
    } else {
      return { dc };
    }
  }
  __name(getItemIdentificationDCs, "getItemIdentificationDCs");
  function setHasElement(set, value) {
    return set.has(value);
  }
  __name(setHasElement, "setHasElement");
  function getMagicTraditions(item) {
    const traits = item.system.traits.value;
    return new Set(traits.filter((t) => setHasElement(MAGIC_TRADITIONS, t)));
  }
  __name(getMagicTraditions, "getMagicTraditions");
  function getIdentifyMagicDCs(item, baseDC, notMatchingTraditionModifier) {
    const result = {
      occult: baseDC,
      primal: baseDC,
      divine: baseDC,
      arcane: baseDC
    };
    const traditions = getMagicTraditions(item);
    for (const key of MAGIC_TRADITIONS) {
      if (traditions.size > 0 && !traditions.has(key)) {
        result[key] = baseDC + notMatchingTraditionModifier;
      }
    }
    return { arcana: result.arcane, nature: result.primal, religion: result.divine, occultism: result.occult };
  }
  __name(getIdentifyMagicDCs, "getIdentifyMagicDCs");
  function getDcRarity(item) {
    return item.traits.has("cursed") ? "unique" : item.rarity;
  }
  __name(getDcRarity, "getDcRarity");
  var dcByLevel = /* @__PURE__ */ new Map([
    [-1, 13],
    [0, 14],
    [1, 15],
    [2, 16],
    [3, 18],
    [4, 19],
    [5, 20],
    [6, 22],
    [7, 23],
    [8, 24],
    [9, 26],
    [10, 27],
    [11, 28],
    [12, 30],
    [13, 31],
    [14, 32],
    [15, 34],
    [16, 35],
    [17, 36],
    [18, 38],
    [19, 39],
    [20, 40],
    [21, 42],
    [22, 44],
    [23, 46],
    [24, 48],
    [25, 50]
  ]);
  var dcAdjustments = /* @__PURE__ */ new Map([
    ["incredibly-easy", -10],
    ["very-easy", -5],
    ["easy", -2],
    ["normal", 0],
    ["hard", 2],
    ["very-hard", 5],
    ["incredibly-hard", 10]
  ]);
  function rarityToDCAdjustment(rarity = "common") {
    switch (rarity) {
      case "uncommon":
        return "hard";
      case "rare":
        return "very-hard";
      case "unique":
        return "incredibly-hard";
      default:
        return "normal";
    }
  }
  __name(rarityToDCAdjustment, "rarityToDCAdjustment");
  function adjustDC(dc, adjustment = "normal") {
    return dc + (dcAdjustments.get(adjustment) ?? 0);
  }
  __name(adjustDC, "adjustDC");
  function adjustDCByRarity(dc, rarity = "common") {
    return adjustDC(dc, rarityToDCAdjustment(rarity));
  }
  __name(adjustDCByRarity, "adjustDCByRarity");
  function calculateDC(level, { proficiencyWithoutLevel, rarity = "common" } = {}) {
    const pwlSetting = game.settings.get("pf2e", "proficiencyVariant");
    proficiencyWithoutLevel ??= pwlSetting === "ProficiencyWithoutLevel";
    const dc = dcByLevel.get(level) ?? 14;
    if (proficiencyWithoutLevel) {
      return adjustDCByRarity(dc - Math.max(level, 0), rarity);
    } else {
      return adjustDCByRarity(dc, rarity);
    }
  }
  __name(calculateDC, "calculateDC");
  var scrollCompendiumIds = {
    1: "RjuupS9xyXDLgyIr",
    // Compendium.pf2e.equipment-srd.Item.RjuupS9xyXDLgyIr
    2: "Y7UD64foDbDMV9sx",
    3: "ZmefGBXGJF3CFDbn",
    4: "QSQZJ5BC3DeHv153",
    5: "tjLvRWklAylFhBHQ",
    6: "4sGIy77COooxhQuC",
    7: "fomEZZ4MxVVK3uVu",
    8: "iPki3yuoucnj7bIt",
    9: "cFHomF3tty8Wi1e5",
    10: "o1XIHJ4MJyroAHfF"
  };
  function getScrollCompendiumUUID(level) {
    return `Compendium.pf2e.equipment-srd.Item.${scrollCompendiumIds[level]}`;
  }
  __name(getScrollCompendiumUUID, "getScrollCompendiumUUID");
  var scrolls = [];
  async function createSpellScroll(uuid, level, temp = false) {
    const spell = (await fromUuid(uuid))?.toObject();
    if (!spell)
      return null;
    if (level === false)
      level = spell.system.level.value;
    const scrollUUID = getScrollCompendiumUUID(level);
    scrolls[level] ??= await fromUuid(scrollUUID);
    const scroll = scrolls[level]?.toObject();
    if (!scroll)
      return null;
    spell.system.location.heightenedLevel = level;
    scroll.name = `Scroll of ${spell.name} (Level ${level})`;
    scroll.system.temporary = temp;
    scroll.system.spell = spell;
    scroll.system.traits.value.push(...spell.system.traditions.value);
    const sourceId = spell.flags.core?.sourceId;
    if (sourceId)
      scroll.system.description.value = `${chatUUID(sourceId)}
<hr />${scroll.system.description.value}`;
    return scroll;
  }
  __name(createSpellScroll, "createSpellScroll");
  function getDcByLevel(actor) {
    const level = Math.clamped(actor.level, -1, 25);
    return dcByLevel.get(level);
  }
  __name(getDcByLevel, "getDcByLevel");

  // src/apps/identify.js
  var Identify = class extends Application {
    constructor(items, options) {
      super(options);
      this.items = items;
    }
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        id: "idleuh-identify",
        title: "Identify Items",
        template: templatePath("identify.html"),
        width: 500
      });
    }
    getData(options) {
      return mergeObject(super.getData(options), {
        items: this.items.map((item) => {
          const data = item.system.identification.identified;
          const identified = item.isIdentified;
          const checked = !identified && item.getFlag("world", "identify.checked");
          const classes = [];
          if (identified)
            classes.push("identified");
          if (checked)
            classes.push("checked");
          return {
            uuid: item.uuid,
            img: data.img,
            name: item.isOfType("treasure") ? `($) ${data.name}` : data.name,
            css: classes.join(" "),
            identified,
            checked
          };
        })
      });
    }
    activateListeners(html) {
      html.find('[data-action="chat"]').on("click", this.#onChat.bind(this));
      html.find('[data-action="checks"]').on("click", this.#onChecks.bind(this));
      html.find('[data-action="identify"]').on("click", this.#onIdentify.bind(this));
      html.find('[data-action="remove"]').on("click", this.#onRemove.bind(this));
      html.find('[data-action="reset"]').on("click", this.#onReset.bind(this));
    }
    async #onChat(event) {
      const item = await getItemFromEvent(event);
      item?.toMessage(void 0, { create: true });
    }
    async #onChecks(event) {
      const item = await getItemFromEvent(event);
      if (!item)
        return;
      const itemImg = item.system.identification.unidentified.img;
      const itemName = item.system.identification.unidentified.name;
      const identifiedName = item.system.identification.identified.name;
      const notMatchingTraditionModifier = game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier");
      const proficiencyWithoutLevel = game.settings.get("pf2e", "proficiencyVariant") === "ProficiencyWithoutLevel";
      const dcs = getItemIdentificationDCs(item, { proficiencyWithoutLevel, notMatchingTraditionModifier });
      const skills = Object.entries(dcs).map(([slug, dc]) => {
        slug = slug === "dc" ? "crafting" : slug;
        const name = game.i18n.localize(CONFIG.PF2E.skillList[slug]);
        return { slug, name, dc };
      });
      const actionOption = item.isMagical ? "action:identify-magic" : item.isAlchemical ? "action:identify-alchemy" : null;
      const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs", {
        itemImg,
        itemName,
        identifiedName,
        rollOptions: ["concentrate", "exploration", "secret", actionOption].filter(Boolean),
        skills
      });
      await CONFIG.ChatMessage.documentClass.create({ user: game.user.id, content });
    }
    async #onIdentify(event) {
      const item = await getItemFromEvent(event);
      if (!item)
        return;
      await item.setIdentificationStatus(item.isIdentified ? "unidentified" : "identified");
      this.render();
    }
    async #onRemove(event) {
      const item = await getItemFromEvent(event);
      if (!item)
        return;
      const checked = item.getFlag("world", "identify.checked");
      await item.setFlag("world", "identify.checked", !checked);
      this.render();
    }
    async #onReset(event) {
      event.preventDefault();
      for (const item of this.items) {
        if (item.isIdentified || !item.getFlag("world", "identify.checked"))
          continue;
        await item.setFlag("world", "identify.checked", false);
      }
      this.render();
    }
  };
  __name(Identify, "Identify");
  async function getItemFromEvent(event) {
    const parent = $(event.currentTarget).closest("[data-item]");
    const uuid = parent.attr("data-item");
    const item = await fromUuid(uuid);
    if (!item)
      parent.remove();
    return item;
  }
  __name(getItemFromEvent, "getItemFromEvent");

  // src/macros/identify.js
  function identify() {
    if (!game.user.isGM) {
      ui.notifications.warn("You not the GM yo!");
      return;
    }
    const actors = game.actors;
    const items = actors.reduce((acc, actor) => {
      if (!actor.hasPlayerOwner)
        return acc;
      const filtered = actor.items.filter((item) => item.isOfType("physical") && !item.isIdentified);
      acc.push(...filtered);
      return acc;
    }, []);
    new Identify(items).render(true);
  }
  __name(identify, "identify");

  // src/macros/imaginarium.js
  var packId = "pf2e.spells-srd";
  var bookId = "Item.dcALVAyJbYSovzqt";
  async function ripImaginarium(actor) {
    if (!actor)
      return ui.notifications.warn("You must select an actor with the Imaginarium");
    const book = actor.itemTypes.equipment.find((x) => x.getFlag("core", "sourceId") === bookId);
    if (!book || book.system.equipped.carryType === "dropped")
      return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession");
    const level = Math.floor(actor.level / 2) || 1;
    const pack = game.packs.get(packId);
    const index = await pack.getIndex({ fields: ["system.level.value", "system.traits", "system.category.value"] });
    const spells = index.filter(
      (x) => x.system.level.value <= level && !x.system.traits.value.includes("cantrip") && x.system.category.value !== "ritual" && x.system.category.value !== "focus" && x.system.traits.rarity === "common"
    );
    const roll = Math.floor(Math.random() * spells.length);
    const spell = spells[roll];
    const uuid = `Compendium.${packId}.${spell._id}`;
    let messageUUID = uuid;
    let extraMessage = "";
    const scroll = await createSpellScroll(uuid, level);
    if (scroll) {
      scroll.name = scroll.name + " *";
      const [item] = await actor.createEmbeddedDocuments("Item", [scroll]);
      extraMessage = " and received the following:";
      messageUUID = item.uuid;
    }
    ChatMessage.create({
      content: `<p>Ripped the last page of the Imaginarium${extraMessage}</p><p>@UUID[${messageUUID}]</p>`,
      speaker: ChatMessage.getSpeaker({ actor })
    });
  }
  __name(ripImaginarium, "ripImaginarium");

  // src/macros/marshal.js
  var effectUUID = "Compendium.idleuh.effects.Item.jjFsfolNR04KzPVh";
  var featUUID = "Compendium.idleuh.feats.Item.X3SZ0gTpBkGw3UGX";
  var debuffUUID = "Compendium.idleuh.effects.Item.r0hicuQPY0OEAC6g";
  async function marshalInspiration(event, actor) {
    if (!actor || !actor.isOwner || !actor.isOfType("character")) {
      ui.notifications.warn("You must select a character token you own.");
      return;
    }
    if (!findItemWithSourceId(actor, featUUID, ["feat"])) {
      ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.");
      return;
    }
    if (findItemWithSourceId(actor, debuffUUID, ["effect"])) {
      ui.notifications.warn("This character cannot enter <strong>Inspiring Marshal Stance</strong>.");
      return;
    }
    const dc = getDcByLevel(actor);
    const roll = await actor.skills.diplomacy.roll({
      dc: { value: dc },
      rollMode: "roll",
      label: '<span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <span>(Diplomacy Check)</span>',
      extraRollNotes: [
        {
          outcome: ["criticalFailure"],
          text: `<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute.`
        },
        {
          outcome: ["failure"],
          text: `<strong>Failure</strong> You fail to enter the stance.`
        },
        {
          outcome: ["success"],
          text: `<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to attack rolls and saves against mental effects.`
        },
        {
          outcome: ["criticalSuccess"],
          text: `<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and grants you and allies a +1 status bonus to attack rolls and saves against mental effects.`
        }
      ]
    });
    const success = roll.degreeOfSuccess;
    if (success >= 2) {
      await setEffect(actor, success);
    } else {
      await (await getEffect(actor))?.delete();
      if (success === 0)
        await setDebuff(actor);
    }
  }
  __name(marshalInspiration, "marshalInspiration");
  async function setDebuff(actor) {
    const effect = await fromUuid(debuffUUID);
    if (!effect)
      return;
    await actor.createEmbeddedDocuments("Item", [effect.toObject()]);
  }
  __name(setDebuff, "setDebuff");
  async function setEffect(actor, success) {
    const radius = success === 3 ? 20 : 10;
    const existing = await getEffect(actor);
    if (existing) {
      const rules = deepClone(existing._source.system.rules);
      const rule2 = rules.find((rule3) => rule3.key === "ChoiceSet");
      if (rule2.selection === radius)
        return;
      rule2.selection = radius;
      existing.update({ "system.rules": rules });
      return;
    }
    const effect = await fromUuid(effectUUID);
    if (!effect)
      return;
    const source = effect.toObject();
    const rule = source.system.rules.find((rule2) => rule2.key === "ChoiceSet");
    rule.selection = radius;
    await actor.createEmbeddedDocuments("Item", [source]);
  }
  __name(setEffect, "setEffect");
  async function getEffect(actor) {
    return findItemWithSourceId(actor, effectUUID, ["effect"]);
  }
  __name(getEffect, "getEffect");

  // src/macros/perception.js
  var proficiency = ["trained", "expert", "master", "legendary", "untrained"];
  async function groupPerception() {
    if (!game.user.isGM) {
      ui.notifications.warn("You not the GM yo!");
      return;
    }
    let result = "<hr>";
    const tokens = canvas.tokens;
    for (const token of tokens.placeables) {
      const actor = token.actor;
      if (!actor || !actor.isOfType("character", "npc") || !actor.hasPlayerOwner || !actor.attributes.perception)
        continue;
      result += await rollPerception(actor);
    }
    ChatMessage.create({ content: result, flavor: "Group Perception Checks", whisper: [game.user.id] });
  }
  __name(groupPerception, "groupPerception");
  async function rollPerception(actor) {
    const perception = actor.attributes.perception;
    const check = new game.pf2e.CheckModifier("", perception);
    const roll = await game.pf2e.Check.roll(check, { actor, type: "skill-check", createMessage: false, skipDialog: true });
    if (!roll)
      return "";
    const rank = proficiency[(perception.rank ?? 1) - 1];
    const die = roll.dice[0].total;
    if (die === void 0)
      return "";
    let result = `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`;
    result += `<span>${actor.name} (${rank})</span><span`;
    if (die == 20)
      result += ' style="color: green;"';
    else if (die == 1)
      result += ' style="color: red;"';
    return `${result}>${roll.total}</span></div>`;
  }
  __name(rollPerception, "rollPerception");

  // src/macros/vulnerability.js
  var effectUUID2 = "Compendium.idleuh.effects.Item.MqgbuaqGMJ92VRze";
  var targetUUID = "Compendium.idleuh.effects.Item.Lz5hNf4dbXKjDWBa";
  var mortalUUID = "Compendium.idleuh.effects.Item.8BxBB5ztfRI9vFfZ";
  var ffUUID = "Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg";
  async function exploitVulnerability(event, actor, filterTypes) {
    if (event.ctrlKey) {
      if (game.user.isGM)
        cleanExploitVulnerabilityGM();
      else
        socketEmit({ type: "clean-exploit-vulnerability" });
      ui.notifications.notify("All effects are being removed.");
      return;
    }
    const targets = game.user.targets;
    const [target] = targets;
    const targetActor = target?.actor;
    if (!actor || !actor.isOwner || !actor.isOfType("character") || targets.size !== 1 || !targetActor || !targetActor.isOfType("creature")) {
      ui.notifications.warn("You must select a character token you own and target another one.");
      return;
    }
    const skill = getEsotericSkill(actor);
    if (!skill)
      return;
    const actionSlug = "action:recall-knowledge";
    const dc = getDcByLevel(targetActor);
    const extraRollOptions = actor.getRollOptions(["all", "skill-check", "Esoteric"]);
    extraRollOptions.push(actionSlug);
    extraRollOptions.push(`secret`);
    const dv = targetActor.system.attributes.weaknesses;
    const vulnerability = dv.reduce((prev, curr) => {
      if (curr.value > prev)
        return curr.value;
      return prev;
    }, 0);
    const weaknesses = dv.filter((x) => x.value === vulnerability).map((x) => x.type);
    const joinedWeaknessess = weaknesses.join(", ");
    const roll = await skill.roll({
      extraRollOptions,
      dc: { value: dc },
      rollMode: "roll",
      label: `<span class="pf2-icon">A</span> <b>Exploit Vulnerability</b> <span">(Esoteric Check)</span>`,
      extraRollNotes: [
        {
          outcome: ["criticalFailure"],
          text: `<strong>Critical Failure</strong> You couldn't remember the right object to use and become distracted while you rummage through your esoterica. You become flat-footed until the beginning of your next turn.`
        },
        {
          outcome: ["failure"],
          text: `<strong>Failure</strong> Failing to recall a salient weakness about the creature, you instead attempt to exploit a more personal vulnerability. You can exploit only the creature's personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`
        },
        {
          outcome: ["success"],
          text: `<strong>[ ${joinedWeaknessess} ]</strong> = ${vulnerability}<br><strong>Success</strong> You recall an important fact about the creature, learning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, resistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`
        },
        {
          outcome: ["criticalSuccess"],
          text: `<strong>[ ${joinedWeaknessess} ]</strong> = ${vulnerability}<br><strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, you have a flash of insight that grants even more knowledge about the creature. You learn all of the creature's resistances, weaknesses, and immunities, including the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, such as what spells will pass through a golem's antimagic. You can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`
        }
      ]
    });
    const success = roll.degreeOfSuccess;
    const effect = findItemWithSourceId(actor, effectUUID2, ["effect"]);
    if (success >= 1 && !effect) {
      const data = (await fromUuid(effectUUID2)).toObject();
      actor.createEmbeddedDocuments("Item", [data]);
    } else if (success < 1) {
      effect?.delete();
      const flatEffect = hasItemWithSourceId(actor, ffUUID, ["condition"]);
      if (!flatEffect) {
        const data = (await fromUuid(ffUUID)).toObject();
        actor.createEmbeddedDocuments("Item", [data]);
      }
    }
    const filteredWeaknesses = weaknesses.filter((x) => !filterTypes.includes(x));
    const packet = {
      type: "exploit-vulnerability",
      actorId: actor.id,
      targetId: target.id,
      vulnerability: filteredWeaknesses.length ? vulnerability : 0,
      success
    };
    if (game.user.isGM)
      exploitVulnerabilityGM(packet);
    else
      socketEmit(packet);
  }
  __name(exploitVulnerability, "exploitVulnerability");
  async function exploitVulnerabilityGM({ actorId, targetId, vulnerability, success }) {
    const actor = game.actors.get(actorId);
    const targetActor = canvas.tokens.get(targetId)?.actor;
    if (!actor || !targetActor)
      return;
    const personal = 2 + Math.floor(actor.level / 2);
    const isMortal = success > 1 && vulnerability >= personal;
    const mortalData = (await fromUuid(mortalUUID)).toObject();
    const rule = {
      key: "Weakness",
      type: "piercing",
      value: vulnerability,
      predicate: ["origin:effect:exploit-vulnerability"]
    };
    mortalData.system.rules.push(rule);
    for (const token of canvas.tokens.placeables) {
      const tokenActor = token.actor;
      if (!tokenActor || tokenActor === actor)
        continue;
      const targetEffect = findItemWithSourceId(tokenActor, targetUUID, ["effect"]);
      const mortalsEffect = findItemWithSourceId(tokenActor, mortalUUID, ["effect"]);
      await targetEffect?.delete();
      await mortalsEffect?.delete();
      if (success < 1)
        continue;
      if (tokenActor === targetActor) {
        const data = (await fromUuid(targetUUID)).toObject();
        const rule2 = {
          key: "Weakness",
          type: "piercing",
          value: isMortal ? vulnerability : personal,
          predicate: ["origin:effect:exploit-vulnerability"]
        };
        data.system.rules.push(rule2);
        tokenActor.createEmbeddedDocuments("Item", [data]);
      } else if (isMortal && tokenActor.id === targetActor.id) {
        tokenActor.createEmbeddedDocuments("Item", [mortalData]);
      }
    }
  }
  __name(exploitVulnerabilityGM, "exploitVulnerabilityGM");
  function cleanExploitVulnerabilityGM() {
    for (const token of canvas.tokens.placeables) {
      const tokenActor = token.actor;
      if (!tokenActor)
        continue;
      const effect = findItemWithSourceId(tokenActor, effectUUID2, ["effect"]);
      const targetEffect = findItemWithSourceId(tokenActor, targetUUID, ["effect"]);
      const mortalsEffect = findItemWithSourceId(tokenActor, mortalUUID, ["effect"]);
      effect?.delete();
      targetEffect?.delete();
      mortalsEffect?.delete();
    }
  }
  __name(cleanExploitVulnerabilityGM, "cleanExploitVulnerabilityGM");

  // src/main.js
  Hooks.once("init", () => {
    game.modules.get(MODULE_ID).api = {
      macros: {
        exploitVulnerability,
        esotericCheck,
        groupPerception,
        identify,
        ripImaginarium,
        marshalInspiration
      }
    };
    game.settings.register(MODULE_ID, "jquery", {
      name: "Disable JQuery Animations",
      hint: "Will cancel sliding animations on different parts of the UI.",
      type: Boolean,
      default: false,
      config: true,
      scope: "client",
      onChange: setJQueryFx
    });
  });
  Hooks.once("ready", () => {
    if (game.user.isGM) {
      socketOn(onPacketReceived);
    }
    if (getSetting("jquery"))
      setJQueryFx(true);
  });
  function setJQueryFx(disabled) {
    jQuery.fx.off = disabled;
  }
  __name(setJQueryFx, "setJQueryFx");
  function onPacketReceived(packet) {
    if (packet.type === "exploit-vulnerability")
      exploitVulnerabilityGM(packet);
    else if (packet.type === "clean-exploit-vulnerability")
      cleanExploitVulnerabilityGM();
  }
  __name(onPacketReceived, "onPacketReceived");
})();
//# sourceMappingURL=main.js.map
