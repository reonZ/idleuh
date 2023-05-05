(()=>{"use strict";let e="",t="module";function a(t){game.socket.emit(`module.${e}`,t)}const i="Compendium.pf2e.feats-srd.KlqKpeq5OmTRxVHb";function n(e){const t=["esoteric","esoteric-lore","lore-esoteric"],a=Object.values(e.skills).find((e=>t.includes(e.slug)));return a||ui.notifications.warn("This character doesn't have the 'Esoteric' skill"),a}function s(){return game.i18n.format("PF2E.SkillCheckWithName",{skillName:"Esoteric"})}function o(e){return e.itemTypes.feat.some((e=>e.getFlag("core","sourceId")===i))}function r(e,t){if(!t||!t.isOwner||!t.isOfType("character"))return void ui.notifications.warn("You must select a character token you own.");const a=n(t);if(!a)return;const i=new Set,r=s();let c=`<h4 class="action">${r}</h4><section class="roll-note">Can be used to Recall Knowledge regarding haunts, curses \nand creatures of any type, but can't be used to Recall Knowledge of other topics.</section>`;e.ctrlKey&&o(t)&&(i.add("diverse-lore"),c+='<section class="roll-note"><strong>Diverse Lore</strong> You can take a -2 penalty to your check to Recall \nKnowledge about any topic, not just the usual topics available for Esoteric Lore.</section>'),game.pf2e.Check.roll(new game.pf2e.CheckModifier(c,a),{actor:t,title:r,type:"skill-check",rollMode:"blindroll",options:i})}function c(e){return e.getFlag("core","sourceId")}function l(e){return Array.isArray(e)?t=>function(e,t){const a=c(e);return!!a&&t.includes(a)}(t,e):t=>c(t)===e}function u(e,t){return t?t.flatMap((t=>e.itemTypes[t])):e.items}function d(e,t,a){return u(e,a).find(l(t))}const f=new Map;f.set(-1,13),f.set(0,14),f.set(1,15),f.set(2,16),f.set(3,18),f.set(4,19),f.set(5,20),f.set(6,22),f.set(7,23),f.set(8,24),f.set(9,26),f.set(10,27),f.set(11,28),f.set(12,30),f.set(13,31),f.set(14,32),f.set(15,34),f.set(16,35),f.set(17,36),f.set(18,38),f.set(19,39),f.set(20,40),f.set(21,42),f.set(22,44),f.set(23,46),f.set(24,48),f.set(25,50);const m=new Map;function p(e,t="common"){return function(e,t="normal"){return e+(m.get(t)??0)}(e,function(e="common"){return"uncommon"===e?"hard":"rare"===e?"very hard":"unique"===e?"incredibly hard":"normal"}(t))}function h(e){const t=Math.clamped(e.level,-1,25);return f.get(t)}m.set("incredibly easy",-10),m.set("very easy",-5),m.set("easy",-2),m.set("normal",0),m.set("hard",2),m.set("very hard",5),m.set("incredibly hard",10);const g="Compendium.idleuh.effects.MqgbuaqGMJ92VRze",y="Compendium.idleuh.effects.Lz5hNf4dbXKjDWBa",w="Compendium.idleuh.effects.8BxBB5ztfRI9vFfZ",v="Compendium.pf2e.conditionitems.AJh5ex99aV6VTggg";async function b(e,t,i){if(e.ctrlKey)return game.user.isGM?C():a({type:"clean-exploit-vulnerability"}),void ui.notifications.notify("All effects are being removed.");const r=game.user.targets,[c]=r,f=c?.actor;if(!(t&&t.isOwner&&t.isOfType("character")&&1===r.size&&f&&f.isOfType("creature")))return void ui.notifications.warn("You must select a character token you own and target another one.");const m=n(t);if(!m)return;const p=h(f),y=t.getRollOptions(["all","skill-check","Esoteric"]);y.push("action:recall-knowledge"),y.push("secret");const w=f.system.attributes.weaknesses,b=w.reduce(((e,t)=>t.value>e?t.value:e),0),$=w.filter((e=>e.value===b)).map((e=>e.type)),x=await game.pf2e.Check.roll(new game.pf2e.CheckModifier("test",m),{actor:t,target:{actor:f,token:c.document},title:s(),type:"skill-check",options:y,dc:{value:p},createMessage:!1},e),I=x.total??0,S=x.dice[0]?.total??0,O=M(I,S,p),j=d(t,g,["effect"]);if(O>=1&&!j){const e=(await fromUuid(g)).toObject();t.createEmbeddedDocuments("Item",[e])}else if(O<1){j?.delete();const e=function(e,t,a){return u(e,["condition"]).some(l(t))}(t,v);if(!e){const e=(await fromUuid(v)).toObject();t.createEmbeddedDocuments("Item",[e])}}!function(e,t,a,i,n,s,r,c){const l=i-a,u=i-n,d=s>=3?"criticalSuccess":2===s?"success":1===s?"failure":"criticalFailure",f=s>=3?"Critical Success":2===s?"Success":1===s?"Failure":"Critical Failure";let m=`<h4 class="action"><span class="pf2-icon">A</span> <b>Exploit Vulnerability</b> <p class="compact-text">(Esoteric Check)</p></h4>\n<div class="target-dc-result" data-visibility="gm">\n    <div class="target-dc" data-visibility="gm"><span data-visibility="gm" data-whose="target">\n        Target: ${t.name}</span> <span data-visibility="gm" data-whose="target">(Standard DC ${a})</span></div>\n    <div class="result degree-of-success" data-visibility="gm">\n        Result: <span title="Roll: ${n} ${u>=0?"+":"-"} ${Math.abs(u)}">${i}</span> \n        <span data-whose="self" class="${d}">${f}</span> <span data-whose="target">by ${l>=0?"+":""}${l}</span>\n    </div>\n</div>`;s>=2&&c.length&&(m+=`<div><strong>[ ${c.join(", ")} ]</strong> = ${r}</div>`),m+='<section class="roll-note">',m+=s>=3?"<strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, \nyou have a flash of insight that grants even more knowledge about the creature. \nYou learn all of the creature's resistances, weaknesses, and immunities, \nincluding the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, \nsuch as what spells will pass through a golem's antimagic. \nYou can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). \nYour unarmed and weapon Strikes against the creature also become magical if they weren't already.":2===s?"<strong>Success</strong> You recall an important fact about the creature, \nlearning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, \nresistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. \nYour unarmed and weapon Strikes against the creature also become magical if they weren't already.":1===s?"<strong>Failure</strong> Failing to recall a salient weakness about the creature, \nyou instead attempt to exploit a more personal vulnerability. \nYou can exploit only the creature's personal antithesis. \nYour unarmed and weapon Strikes against the creature also become magical if they weren't already.":"<strong>Critical Failure</strong> You couldn't remember the right object to use and become distracted while you rummage \nthrough your esoterica. You become flat-footed until the beginning of your next turn.",m+="</section>",o(e)&&s>=2&&(m+=function(e,t,a){const i=e.identificationDCs?.standard.progression,n=i.map((e=>{const i=M(t,a,e);return`<span style="color: ${i>=3?"green":2===i?"blue":"#ff4500"};" title="${i>=3?"Critical Success":2===i?"Success":"Failure"}">${e}</span>`}));return`<section class="roll-note">\n    <strong>Diverse Lore</strong> Compare the result of your Esoteric Lore check to the DC${n.length?` <span data-visibility="gm">${n.join(", ")}</span>`:""} to Recall Knowledge for that creature; \n    if that number would be a success or a critical success, you gain information as if you had succeeded at the Recall Knowledge check.\n</section>`}(t,i,n)),ChatMessage.create({flavor:m,speaker:ChatMessage.getSpeaker({actor:e})})}(t,f,p,I,S,O,b,$);const F=$.filter((e=>!i.includes(e))),D={type:"exploit-vulnerability",actorId:t.id,targetId:c.id,vulnerability:F.length?b:0,success:O};game.user.isGM?k(D):a(D)}async function k({actorId:e,targetId:t,vulnerability:a,success:i}){const n=game.actors.get(e),s=canvas.tokens.get(t)?.actor;if(!n||!s)return;const o=2+Math.floor(n.level/2),r=i>1&&a>=o,c=(await fromUuid(w)).toObject(),l={key:"Weakness",type:"piercing",value:a,predicate:["origin:effect:exploit-vulnerability"]};c.system.rules.push(l);for(const e of canvas.tokens.placeables){const t=e.actor;if(!t||t===n)continue;const l=d(t,y,["effect"]),u=d(t,w,["effect"]);if(await(l?.delete()),await(u?.delete()),!(i<1))if(t===s){const e=(await fromUuid(y)).toObject(),i={key:"Weakness",type:"piercing",value:r?a:o,predicate:["origin:effect:exploit-vulnerability"]};e.system.rules.push(i),t.createEmbeddedDocuments("Item",[e])}else r&&t.id===s.id&&t.createEmbeddedDocuments("Item",[c])}}function C(){for(const e of canvas.tokens.placeables){const t=e.actor;if(!t)continue;const a=d(t,g,["effect"]),i=d(t,y,["effect"]),n=d(t,w,["effect"]);a?.delete(),i?.delete(),n?.delete()}}function M(e,t,a){let i=e>=a+10?3:e>=a?2:e>a-10?1:0;return 20===t?i++:1===t&&i--,i}function x(...a){return a=a.filter((e=>"string"==typeof e)),`${t}s/${e}/templates/${a.join("/")}`}const I=new Set(["arcane","divine","occult","primal"]),S=[];const O={1:"RjuupS9xyXDLgyIr",2:"Y7UD64foDbDMV9sx",3:"ZmefGBXGJF3CFDbn",4:"QSQZJ5BC3DeHv153",5:"tjLvRWklAylFhBHQ",6:"4sGIy77COooxhQuC",7:"fomEZZ4MxVVK3uVu",8:"iPki3yuoucnj7bIt",9:"cFHomF3tty8Wi1e5",10:"o1XIHJ4MJyroAHfF"},j=String.raw`[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`,F=String.raw`[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`,D=(new RegExp(F,"gu"),String.raw`(?:${j})(?=${F})|(?:${F})(?=${j})`),T=String.raw`(?:${j})(?=${j})`,Y=String.raw`\p{Lowercase_Letter}`,R=String.raw`\p{Uppercase_Letter}`;new RegExp(`(${Y})(${R}${T})`,"gu"),new RegExp(`${R}|(?:${D})${Y}`,"gu"),new Set(["armor","backpack","book","consumable","equipment","treasure","weapon"]);const E={acr:"acrobatics",arc:"arcana",ath:"athletics",cra:"crafting",dec:"deception",dip:"diplomacy",itm:"intimidation",med:"medicine",nat:"nature",occ:"occultism",prf:"performance",rel:"religion",soc:"society",ste:"stealth",sur:"survival",thi:"thievery"};Object.keys(E),Object.values(E);class L extends Application{items;constructor(e,t){super(t),this.items=e}static get defaultOptions(){return mergeObject(super.defaultOptions,{id:"idleuh-identify",title:"Identify Items",template:x("identify.html"),width:500})}getData(e){return mergeObject(super.getData(e),{items:this.items.map((e=>{const t=e.system.identification.identified,a=e.isIdentified,i=!a&&e.getFlag("world","identify.checked"),n=[];return a&&n.push("identified"),i&&n.push("checked"),{uuid:e.uuid,img:t.img,name:e.isOfType("treasure")?`($) ${t.name}`:t.name,css:n.join(" "),identified:a,checked:i}}))})}activateListeners(e){e.find('[data-action="chat"]').on("click",this.#e.bind(this)),e.find('[data-action="checks"]').on("click",this.#t.bind(this)),e.find('[data-action="identify"]').on("click",this.#a.bind(this)),e.find('[data-action="remove"]').on("click",this.#i.bind(this)),e.find('[data-action="reset"]').on("click",this.#n.bind(this))}async#e(e){(await A(e))?.toMessage(void 0,{create:!0})}async#t(e){const t=await A(e);if(!t)return;const a=t.system.identification.unidentified.img,i=t.system.identification.unidentified.name,n=t.system.identification.identified.name,s=game.settings.get("pf2e","identifyMagicNotMatchingTraditionModifier"),o=function(e,{proficiencyWithoutLevel:t=!1,notMatchingTraditionModifier:a}){const i=function(e,{proficiencyWithoutLevel:t=!1,rarity:a="common"}={}){const i=f.get(e)??14;return p(t?i-Math.max(e,0):i,a)}(e.level,{proficiencyWithoutLevel:t}),n=function(e){return e.traits.has("cursed")?"unique":e.rarity}(e),s=p(i,n);return e.isMagical?function(e,t,a){const i={occult:t,primal:t,divine:t,arcane:t},n=function(e){const t=e.system.traits.value;return new Set(t.filter((e=>{return t=e,I.has(t);var t})))}(e);for(const e of I)n.size>0&&!n.has(e)&&(i[e]=t+a);return{arc:i.arcane,nat:i.primal,rel:i.divine,occ:i.occult}}(e,s,a):e.isAlchemical?{cra:s}:{dc:s}}(t,{proficiencyWithoutLevel:"ProficiencyWithoutLevel"===game.settings.get("pf2e","proficiencyVariant"),notMatchingTraditionModifier:s}),r=Object.entries(o).map((([e,t])=>({shortForm:e="dc"===e?"cra":e,dc:t,name:game.i18n.localize(E[e])}))),c=await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",{itemImg:a,itemName:i,identifiedName:n,skills:r});await ChatMessage.create({user:game.user.id,content:c})}async#a(e){const t=await A(e);t&&(await t.update({"system.identification.status":t.isIdentified?"unidentified":"identified","system.identification.unidentified":t.getMystifiedData("unidentified"),"flags.world.identify.checked":!1}),this.render())}async#i(e){const t=await A(e);if(!t)return;const a=t.getFlag("world","identify.checked");await t.setFlag("world","identify.checked",!a),this.render()}async#n(e){e.preventDefault();for(const e of this.items)!e.isIdentified&&e.getFlag("world","identify.checked")&&await e.setFlag("world","identify.checked",!1);this.render()}}async function A(e){const t=$(e.currentTarget).closest("[data-item]"),a=t.attr("data-item"),i=await fromUuid(a);return i||t.remove(),i}function N(){if(!game.user.isGM)return void ui.notifications.warn("You not the GM yo!");const e=game.actors.reduce(((e,t)=>{if(!t.hasPlayerOwner)return e;const a=t.items.filter((e=>e.isOfType("physical")&&!e.isIdentified));return e.push(...a),e}),[]);new L(e).render(!0)}const U="pf2e.spells-srd",G="Item.dcALVAyJbYSovzqt";async function V(e){if(!e)return ui.notifications.warn("You must select an actor with the Imaginarium");const t=e.itemTypes.equipment.find((e=>e.getFlag("core","sourceId")===G));if(!t||"dropped"===t.system.equipped.carryType)return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession");const a=Math.floor(e.level/2),i=game.packs.get(U),n=(await i.getIndex({fields:["system.level.value","system.traits","system.category.value"]})).filter((e=>e.system.level.value<=a&&!e.system.traits.value.includes("cantrip")&&"ritual"!==e.system.category.value&&"focus"!==e.system.category.value&&"common"===e.system.traits.rarity)),s=n[Math.floor(Math.random()*n.length)],o=`Compendium.${U}.${s._id}`;let r=o,c="";const l=await async function(e,t,a=!1){const i=(await fromUuid(e))?.toObject();if(!i)return null;!1===t&&(t=i.system.level.value);const n=function(e){return`Compendium.pf2e.equipment-srd.${O[e]}`}(t);S[t]??=await fromUuid(n);const s=S[t]?.toObject();if(!s)return null;i.system.location.heightenedLevel=t,s.name=`Scroll of ${i.name} (Level ${t})`,s.system.temporary=a,s.system.spell=i,s.system.traits.value.push(...i.system.traditions.value);const o=i.flags.core?.sourceId;return o&&(s.system.description.value=`${function(e,t){return`@UUID[${e}]`}(o)}\n<hr />${s.system.description.value}`),s}(o,a);if(l){l.name=l.name+" *";const[t]=await e.createEmbeddedDocuments("Item",[l]);c=" and received the following:",r=t.uuid}ChatMessage.create({content:`<p>Ripped the last page of the Imaginarium${c}</p><p>@UUID[${r}]</p>`,speaker:ChatMessage.getSpeaker({actor:e})})}class q extends FormApplication{static get defaultOptions(){return mergeObject(super.defaultOptions,{id:"idleuh-manual-token",template:x("manual-token.html"),title:"Manual Token Update",width:500})}activateListeners(e){super.activateListeners(e),e.find("button[type=button]").on("click",(()=>this.close()));const t=e.find("input[name=scale]"),a=t.next("span");t.on("input",(()=>{const e=t[0].valueAsNumber;a.text(e.toFixed(2))}));const i=e.find("input[name=grid]"),n=i.next("span");i.on("input",(()=>{const e=i[0].valueAsNumber;n.text(e.toFixed(1))}))}async _updateObject(e,t){const a=this.object,i={displayName:Number(t.name),displayBars:Number(t.hp),"texture.src":t.img,"flags.pf2e.linkToActorSize":!!t.link,width:Number(t.grid),height:Number(t.grid),"texture.scaleX":Number(t.scale),"texture.scaleY":Number(t.scale)},n={};for(const[e,t]of Object.entries(i))getProperty(a,e)!==t&&setProperty(n,e,t);Object.keys(n).length&&this.object.update(n)}}async function K(e){e&&e.isOwner?new q(e.document).render(!0):ui.notifications.warn("You need to select an owned token.")}const W=["trained","expert","master","legendary","untrained"];async function P(){if(!game.user.isGM)return void ui.notifications.warn("You not the GM yo!");let e="<hr>";const t=canvas.tokens;for(const a of t.placeables){const t=a.actor;t&&t.isOfType("character","npc")&&t.hasPlayerOwner&&t.attributes.perception&&(e+=await B(t))}ChatMessage.create({content:e,flavor:"Group Perception Checks",whisper:[game.user.id]})}async function B(e){const t=e.attributes.perception,a=new game.pf2e.CheckModifier("",t),i=await game.pf2e.Check.roll(a,{actor:e,type:"skill-check",createMessage:!1,skipDialog:!0});if(!i)return"";const n=W[(t.rank??1)-1],s=i.dice[0].total;if(void 0===s)return"";let o=`<div style="display:flex;justify-content:space-between;" title="${i.result}">`;return o+=`<span>${e.name} (${n})</span><span`,20==s?o+=' style="color: green;"':1==s&&(o+=' style="color: red;"'),`${o}>${i.total}</span></div>`}const J="Compendium.idleuh.effects.jjFsfolNR04KzPVh",z="Compendium.idleuh.feats.X3SZ0gTpBkGw3UGX",_="Compendium.idleuh.effects.r0hicuQPY0OEAC6g";async function H(e,t){if(!t||!t.isOwner||!t.isOfType("character"))return void ui.notifications.warn("You must select a character token you own.");if(!d(t,z,["feat"]))return void ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.");if(d(t,_,["effect"]))return void ui.notifications.warn("This character cannot enter <strong>Inspiring Marshal Stance</strong>.");const a=h(t),i=await t.skills.diplomacy.roll({createMessage:!1}),n=i.total,s=i.dice[0].total,o=function(e,t,a){let i=e>=a+10?3:e>=a?2:e>a-10?1:0;return 20===t?i++:1===t&&i--,Math.clamped(i,0,3)}(n,s,a);o>=2?await async function(e,t){const a=3===t?20:10,i=await Q(e);if(i){const e=deepClone(i._source.system.rules),t=e.find((e=>"ChoiceSet"===e.key));if(t.selection===a)return;return t.selection=a,void i.update({"system.rules":e})}const n=await fromUuid(J);if(!n)return;const s=n.toObject();s.system.rules.find((e=>"ChoiceSet"===e.key)).selection=a,await e.createEmbeddedDocuments("Item",[s])}(t,o):(await((await Q(t))?.delete()),0===o&&await async function(e){const t=await fromUuid(_);t&&await e.createEmbeddedDocuments("Item",[t.toObject()])}(t)),function(e,t,a,i,n){const s=a-n,o=a-i,r=t>=3?"criticalSuccess":2===t?"success":1===t?"failure":"criticalFailure",c=t>=3?"Critical Success":2===t?"Success":1===t?"Failure":"Critical Failure";let l=`<h4 class="action"><span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <p class="compact-text">(Diplomacy Check)</p></h4>\n    <div class="target-dc-result">\n        <div class="target-dc"><span data-whose="target">Standard DC ${n}</span></div>\n        <div class="result degree-of-success">\n            Result: <span title="Roll: ${a} ${o>=0?"+":"-"} ${Math.abs(o)}">${a}</span> \n            <span data-whose="self" class="${r}">${c}</span> <span data-whose="target">by ${s>=0?"+":""}${s}</span>\n        </div>\n    </div>`;l+='<section class="roll-note">',l+=3===t?"<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and \ngrants you and allies a +1 status bonus to attack rolls and saves against mental effects.":2===t?"<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to \nattack rolls and saves against mental effects.":1===t?"<strong>Failure</strong> You fail to enter the stance.":"<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute.",l+="</section>",ChatMessage.create({flavor:l,speaker:ChatMessage.getSpeaker({actor:e})})}(t,o,n,s,a)}async function Q(e){return d(e,J,["effect"])}const X="idleuh";function Z(e){jQuery.fx.off=e}function ee(e){"exploit-vulnerability"===e.type?k(e):"clean-exploit-vulnerability"===e.type&&C()}!function(a,i=!1){e||(e=a),t=i?"system":"module"}(X),Hooks.once("init",(()=>{var t;(t=e,game.modules.get(t)).api={macros:{exploitVulnerability:b,esotericCheck:r,manualToken:K,groupPerception:P,identify:N,ripImaginarium:V,marshalInspiration:H}},game.settings.register(X,"jquery",{name:"Disable JQuery Animations",hint:"Will cancel sliding animations on different parts of the UI.",type:Boolean,default:!1,config:!0,scope:"client",onChange:Z})})),Hooks.once("ready",(()=>{var t;game.user.isGM&&(t=ee,game.socket.on(`module.${e}`,t)),game.settings.get(e,"jquery")&&Z(!0)}))})();
//# sourceMappingURL=main.js.map