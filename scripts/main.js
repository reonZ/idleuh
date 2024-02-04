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

  // src/macros/extract.js
  var FEAT_UUID = "Compendium.pf2e.classfeatures.Item.jyCEC3eC4B6YaGoy";
  var EFFECT_UUID = "Compendium.idleuh.effects.Item.9IapmSGjH0hDaVMv";
  var PHYSICAL_TYPES = ["bludgeoning", "slashing", "piercing"];
  var TYPES = ["fire", "earth", ...PHYSICAL_TYPES];
  async function extractElement(event, actor) {
    if (!actor?.isOfType("character")) {
      ui.notifications.warn("You need to select a character");
      return;
    }
    const feat = findItemWithSourceId(actor, FEAT_UUID, ["feat"]);
    if (!feat) {
      ui.notifications.warn("Your selected character needs to have the feat <strong>Extract Element</strong>");
      return;
    }
    const targetToken = game.user.targets.first();
    const targetActor = targetToken?.actor;
    if (!targetActor || targetActor === actor) {
      ui.notifications.warn("You need to target another actor");
      return;
    }
    const existing = findItemWithSourceId(targetActor, EFFECT_UUID, ["effect"]);
    if (existing) {
      ui.notifications.warn("Your target's elements have already been extracted");
      return;
    }
    const saveRoll = await targetActor.saves.fortitude.roll({
      event,
      label: "Fortitude Save - Extract Element",
      dc: {
        slug: "class",
        label: "Kineticist DC",
        value: actor.classDC.dc.value
      }
    });
    if (saveRoll.degreeOfSuccess > 2)
      return;
    const source = (await fromUuid(EFFECT_UUID))?.toObject();
    const rules = source.system.rules;
    source.flags.core.sourceId = EFFECT_UUID;
    const warnings = {};
    rules.push({
      key: "Immunity",
      mode: "remove",
      type: TYPES.slice(),
      predicate: ["origin:effect:kinetic-aura"]
    });
    let hasEarth = false;
    const resistances = targetActor.attributes.resistances.filter(({ type }) => TYPES.includes(type));
    for (const { type, value, exceptions, doubleVs } of resistances) {
      if (type === "earth") {
        hasEarth = {
          value,
          exceptions
        };
      } else {
        rules.push({
          key: "Weakness",
          type,
          value,
          exceptions,
          predicate: ["origin:effect:kinetic-aura"]
        });
      }
      if (doubleVs.length)
        warnings.doubleVs = true;
    }
    if (hasEarth) {
      for (const type of PHYSICAL_TYPES) {
        rules.push({
          key: "Weakness",
          type,
          value: hasEarth.value,
          exceptions: hasEarth.exceptions,
          predicate: ["origin:effect:kinetic-aura"]
        });
      }
    }
    targetActor.createEmbeddedDocuments("Item", [source]);
    const notes = [];
    if (warnings.doubleVs) {
      notes.push(
        `The creature has some resistances that are doubled versus criticals, this can't be automated and will have to be manually handled by the GM.`
      );
    }
    const formula = `${Math.floor((actor.level - feat.level) / 2)}d4`;
    const DamageRoll = CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll");
    const damageRoll = await new DamageRoll(formula).evaluate({ async: true });
    let flavor = `
<h4 class="action">
    <strong>Extract Element</strong>
    <span class="action-glyph">1</span>
</h4>
<div class="target-dc-result" data-tooltip-class="pf2e" data-tooltip-direction="UP">
    <div class="target-dc"><span data-visibility="all" data-whose="target">Target: ${targetActor.name}</span></div>
</div>
`;
    notes.forEach((note) => flavor += `<p>${note}</p>`);
    damageRoll.toMessage({
      flavor,
      speaker: ChatMessage.getSpeaker({ actor }),
      flags: {
        pf2e: {
          context: {
            target: {
              token: targetToken.document.uuid,
              actor: targetActor.uuid
            }
          }
        }
      }
    });
    console.log({ saveRoll, damageRoll, source });
  }
  __name(extractElement, "extractElement");

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
  function getDcByLevel(actor) {
    const level = Math.clamped(actor.level, -1, 25);
    return dcByLevel.get(level);
  }
  __name(getDcByLevel, "getDcByLevel");
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
  var scrolls = [];
  async function createSpellScroll(uuid, level, temp = false) {
    const spell = await fromUuid(uuid);
    if (!spell)
      return null;
    if (level === false)
      level = spell.system.level.value;
    const scrollUUID = `Compendium.pf2e.equipment-srd.Item.${scrollCompendiumIds[level]}`;
    scrolls[level] ??= await fromUuid(scrollUUID);
    const scrollSource = scrolls[level]?.toObject();
    if (!scrollSource)
      return null;
    const traits = scrollSource.system.traits;
    traits.value = Array.from(/* @__PURE__ */ new Set([...traits.value, ...spell.traits]));
    traits.rarity = spell.rarity;
    if (traits.value.includes("magical") && traits.value.some((trait) => MAGIC_TRADITIONS.has(trait))) {
      traits.value.splice(traits.value.indexOf("magical"), 1);
    }
    traits.value.sort();
    scrollSource._id = null;
    scrollSource.name = game.i18n.format("PF2E.Item.Physical.FromSpell.Scroll", { name: spell.name, level });
    const description = scrollSource.system.description.value;
    scrollSource.system.description.value = (() => {
      const paragraphElement = document.createElement("p");
      paragraphElement.append(spell.sourceId ? `@UUID[${spell.sourceId}]{${spell.name}}` : spell.description);
      const containerElement = document.createElement("div");
      const hrElement = document.createElement("hr");
      containerElement.append(paragraphElement, hrElement);
      hrElement.insertAdjacentHTML("afterend", description);
      return containerElement.innerHTML;
    })();
    scrollSource.system.temporary = temp;
    scrollSource.system.spell = spell.clone({ "system.location.heightenedLevel": level }).toObject();
    return scrollSource;
  }
  __name(createSpellScroll, "createSpellScroll");

  // node_modules/remeda/dist/es/purry.js
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function purry(fn, args, lazy) {
    var diff = fn.length - args.length;
    var arrayArgs = Array.from(args);
    if (diff === 0) {
      return fn.apply(void 0, arrayArgs);
    }
    if (diff === 1) {
      var ret = /* @__PURE__ */ __name(function(data) {
        return fn.apply(void 0, __spreadArray([data], arrayArgs, false));
      }, "ret");
      if (lazy || fn.lazy) {
        ret.lazy = lazy || fn.lazy;
        ret.lazyArgs = args;
      }
      return ret;
    }
    throw new Error("Wrong number of arguments");
  }
  __name(purry, "purry");

  // node_modules/remeda/dist/es/fromPairs.js
  function fromPairs(entries) {
    var out = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var _a = entries_1[_i], key = _a[0], value = _a[1];
      out[key] = value;
    }
    return out;
  }
  __name(fromPairs, "fromPairs");
  (function(fromPairs2) {
    fromPairs2.strict = fromPairs2;
  })(fromPairs || (fromPairs = {}));

  // node_modules/remeda/dist/es/omit.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  function omit() {
    return purry(_omit, arguments);
  }
  __name(omit, "omit");
  function _omit(data, propNames) {
    if (propNames.length === 0) {
      return __assign({}, data);
    }
    if (propNames.length === 1) {
      var propName = propNames[0];
      var _a = data, _b = propName, omitted = _a[_b], remaining = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
      return remaining;
    }
    if (!propNames.some(function(propName2) {
      return propName2 in data;
    })) {
      return __assign({}, data);
    }
    var asSet = new Set(propNames);
    return fromPairs(Object.entries(data).filter(function(_a2) {
      var key = _a2[0];
      return !asSet.has(key);
    }));
  }
  __name(_omit, "_omit");

  // src/apps/identify.js
  var Identify = class extends Application {
    constructor(items, options) {
      super(options);
      this.items = items;
    }
    static get defaultOptions() {
      return mergeObject(Application.defaultOptions, {
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
      const identifiedName = item.system.identification.identified.name;
      const dcs = getItemIdentificationDCs(item, {
        pwol: game.pf2e.settings.variants.pwol.enabled,
        notMatchingTraditionModifier: game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier")
      });
      const action = item.isMagical ? "identify-magic" : item.isAlchemical ? "identify-alchemy" : null;
      const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs", {
        identifiedName,
        action,
        skills: omit(dcs, ["dc"]),
        unidentified: item.system.identification.unidentified,
        uuid: item.uuid
      });
      await ChatMessage.implementation.create({ user: game.user.id, content });
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
    const index = await pack.getIndex({ fields: ["system.level.value", "system.traits", "system.ritual"] });
    const spells = index.filter(
      (x) => x.system.level.value <= level && !x.system.traits.value.includes("cantrip") && !x.system.traits.value.includes("focus") && !x.system.ritual && x.system.traits.rarity === "common"
    );
    const roll = Math.floor(Math.random() * spells.length);
    const spell = spells[roll];
    const uuid = `Compendium.${packId}.${spell._id}`;
    let messageUUID = uuid;
    let extraMessage = "";
    const scroll = await createSpellScroll(uuid, level);
    if (scroll) {
      scroll.name = `${scroll.name} *`;
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

  // src/macros/shared/damage.js
  async function rollDamage({ actor, token, item, formula }) {
    const DamageRoll = CONFIG.Dice.rolls.find((x) => x.name === "DamageRoll");
    const roll = await new DamageRoll(formula).evaluate({ async: true });
    const traits = Array.from(item.traits);
    const context = {
      type: "damage-roll",
      sourceType: "attack",
      actor: actor.id,
      token: token?.id,
      target: null,
      domains: [],
      options: [traits, actor.getRollOptions(), item.getRollOptions("item")].flat(),
      mapIncreases: void 0,
      notes: [],
      secret: false,
      rollMode: "roll",
      traits,
      skipDialog: false,
      outcome: null,
      unadjustedOutcome: null
    };
    let flavor = `<h4 class="action"><strong>${item.name}</strong></h4>`;
    flavor += '<div class="tags" data-tooltip-class="pf2e">';
    flavor += traits.map((tag) => {
      const label = game.i18n.localize(CONFIG.PF2E.actionTraits[tag]);
      const tooltip = CONFIG.PF2E.traitsDescriptions[tag];
      return `<span class="tag" data-trait="${tag}" data-tooltip="${tooltip}">${label}</span>`;
    }).join("");
    flavor += "</div><hr>";
    return roll.toMessage({
      flavor,
      speaker: ChatMessage.implementation.getSpeaker({ actor, token }),
      flags: {
        pf2e: {
          context,
          origin: item.getOriginData()
        }
      }
    });
  }
  __name(rollDamage, "rollDamage");

  // src/macros/nimbus.js
  var FEAT_UUID2 = "Compendium.pf2e.feats-srd.Item.XJCsa3UbQtsKcqve";
  async function thermalNimbus(actor, token) {
    const item = actor?.itemTypes.feat.find((x) => x.sourceId === FEAT_UUID2);
    if (!item) {
      ui.notifications.warn("You need to select a kineticist with the <strong>Thermal Nimbus</strong> feat.");
      return;
    }
    const formula = `${Math.floor(actor.level / 2)}[fire]`;
    await rollDamage({ actor, token, item, formula });
  }
  __name(thermalNimbus, "thermalNimbus");

  // src/macros/perception.js
  var proficiency = ["untrained", "trained", "expert", "master", "legendary"];
  async function groupPerception() {
    if (!game.user.isGM) {
      ui.notifications.warn("You not the GM yo!");
      return;
    }
    let content = "";
    const party = game.actors.party;
    const actors = party?.members ?? [];
    await Promise.all(
      actors.map(async (actor) => {
        const roll = await actor.perception.roll({ createMessage: false });
        const die = roll.dice[0].total;
        content += `<div style="display:flex;justify-content:space-between;" title="${roll.result}">`;
        content += `<span>${actor.name} (${proficiency[actor.perception.rank]})</span><span`;
        if (die == 20)
          content += ' style="color: green;"';
        else if (die == 1)
          content += ' style="color: red;"';
        content += `>${roll.total}</span></div>`;
      })
    );
    if (content)
      ChatMessage.create({ content, flavor: "Group Perception Checks<hr>", whisper: [game.user.id] });
  }
  __name(groupPerception, "groupPerception");

  // src/macros/snatcher.js
  var FEAT_UUID3 = "Compendium.pf2e.feats-srd.Item.40mZVDnIP5qBNhTH";
  function sandSnatcher(event, actor) {
    if (!actor?.isOfType("character")) {
      ui.notifications.warn("You need to select a character");
      return;
    }
    const feat = findItemWithSourceId(actor, FEAT_UUID3, ["feat"]);
    if (!feat) {
      ui.notifications.warn("Your selected character needs to have the feat <strong>Sand Snatcher</strong>");
      return;
    }
    const target = game.user.targets.first()?.actor;
    actor.getStatistic("impulse").roll({
      event,
      label: "Sand Snatcher - Grapple",
      target,
      dc: {
        slug: "fortitude",
        label: "Fortitude DC",
        value: target?.saves.fortitude.dc.value
      },
      traits: ["attack", "impulse", "kineticist"],
      extraRollNotes: [
        {
          text: game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalSuccess"),
          outcome: ["criticalSuccess"]
        },
        {
          text: game.i18n.localize("PF2E.Actions.Grapple.Notes.success"),
          outcome: ["success"]
        },
        {
          text: game.i18n.localize("PF2E.Actions.Grapple.Notes.failure"),
          outcome: ["failure"]
        },
        {
          text: game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalFailure"),
          outcome: ["criticalFailure"]
        }
      ]
    });
  }
  __name(sandSnatcher, "sandSnatcher");

  // src/macros/spike.js
  var effectName = "<strong>Spike Skin</strong> effect";
  var EFFECT_UUID2 = "Compendium.idleuh.effects.Item.aJWj25WLTiG67a1y";
  var FEAT_UUID4 = "Compendium.pf2e.feats-srd.Item.9p28s0zg4Vv4r5i2";
  function getEffect2(actor) {
    return actor?.itemTypes.effect.find((x) => x.sourceId === EFFECT_UUID2);
  }
  __name(getEffect2, "getEffect");
  function effectMissing() {
    ui.notifications.warn(`You need to select an actor with the ${effectName}.`);
  }
  __name(effectMissing, "effectMissing");
  async function spikeSkinDuration(actor) {
    const effect = getEffect2(actor);
    if (!effect)
      return effectMissing();
    const remaining = effect.system.duration.value;
    if (remaining <= 0) {
      ui.notifications.warn(`The ${effectName} is already expired on the selected actor.`);
      return;
    }
    await effect.update({ "system.duration.value": Math.max(0, remaining - 1) });
    ui.notifications.info(`The ${effectName} duration has been reduced by 1 minute.`);
  }
  __name(spikeSkinDuration, "spikeSkinDuration");
  async function spikeSkinDamage(actor, token) {
    const effect = getEffect2(actor);
    if (!effect)
      return effectMissing();
    const item = await fromUuid(FEAT_UUID4);
    const formula = `${Math.floor((actor.level - 8) / 2) * 2 + 2}[piercing]`;
    await rollDamage({ actor, token, item, formula });
  }
  __name(spikeSkinDamage, "spikeSkinDamage");

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
    const weaknessStr = joinedWeaknessess ? `<strong>[ ${joinedWeaknessess} ]</strong> = ${vulnerability}<br>` : "";
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
          text: `${weaknessStr}<strong>Success</strong> You recall an important fact about the creature, learning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, resistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`
        },
        {
          outcome: ["criticalSuccess"],
          text: `${weaknessStr}<strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, you have a flash of insight that grants even more knowledge about the creature. You learn all of the creature's resistances, weaknesses, and immunities, including the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, such as what spells will pass through a golem's antimagic. You can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`
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
        marshalInspiration,
        sandSnatcher,
        extractElement,
        thermalNimbus,
        spikeSkinDuration,
        spikeSkinDamage
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
