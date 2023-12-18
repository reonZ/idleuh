(()=>{var de=Object.defineProperty;var s=(t,e)=>de(t,"name",{value:e,configurable:!0});function D(t){let e=["esoteric","esoteric-lore","lore-esoteric"],n=Object.values(t.skills).find(i=>e.includes(i.slug));return n||ui.notifications.warn("This character doesn't have the 'Esoteric' skill"),n}s(D,"getEsotericSkill");function R(t,e){if(!e||!e.isOwner||!e.isOfType("character")){ui.notifications.warn("You must select a character token you own.");return}let n=D(e);if(!n)return;let i=new Set,a=[{text:`Can be used to Recall Knowledge regarding haunts, curses 
    and creatures of any type, but can't be used to Recall Knowledge of other topics.`}];n.roll({rollMode:"blindroll",extraRollNotes:a,options:i})}s(R,"esotericCheck");var w="idleuh";function V(t){return game.settings.get(w,t)}s(V,"getSetting");function W(t){game.socket.on(`module.${w}`,t)}s(W,"socketOn");function U(t){game.socket.emit(`module.${w}`,t)}s(U,"socketEmit");function L(...t){return t=t.filter(e=>typeof e=="string"),`modules/${w}/templates/${t.join("/")}`}s(L,"templatePath");function N(t){return Array.isArray(t)?e=>me(e,t):e=>H(e)===t}s(N,"getItemSourceIdCondition");function B(t,e){return e?e.flatMap(n=>t.itemTypes[n]):t.items}s(B,"getItems");function p(t,e,n){return B(t,n).find(N(e))}s(p,"findItemWithSourceId");function H(t){return t.getFlag("core","sourceId")}s(H,"getSourceId");function me(t,e){let n=H(t);return n?e.includes(n):!1}s(me,"includesSourceId");function z(t,e,n){return B(t,n).some(N(e))}s(z,"hasItemWithSourceId");var pe="Compendium.pf2e.classfeatures.Item.jyCEC3eC4B6YaGoy",O="Compendium.idleuh.effects.Item.9IapmSGjH0hDaVMv",_=["bludgeoning","slashing","piercing"],q=["fire","earth",..._];async function J(t,e){if(!e?.isOfType("character")){ui.notifications.warn("You need to select a character");return}let n=p(e,pe,["feat"]);if(!n){ui.notifications.warn("Your selected character needs to have the feat <strong>Extract Element</strong>");return}let i=game.user.targets.first(),a=i?.actor;if(!a||a===e){ui.notifications.warn("You need to target another actor");return}if(p(a,O,["effect"])){ui.notifications.warn("Your target's elements have already been extracted");return}let r=await a.saves.fortitude.roll({event:t,label:"Fortitude Save - Extract Element",dc:{slug:"class",label:"Kineticist DC",value:e.classDC.dc.value}});if(r.degreeOfSuccess>2)return;let f=(await fromUuid(O))?.toObject(),l=f.system.rules;f.flags.core.sourceId=O;let d={};l.push({key:"Immunity",mode:"remove",type:q.slice(),predicate:["origin:effect:kinetic-aura"]});let m=!1,u=a.attributes.resistances.filter(({type:g})=>q.includes(g));for(let{type:g,value:S,exceptions:b,doubleVs:h}of u)g==="earth"?m={value:S,exceptions:b}:l.push({key:"Weakness",type:g,value:S,exceptions:b,predicate:["origin:effect:kinetic-aura"]}),h.length&&(d.doubleVs=!0);if(m)for(let g of _)l.push({key:"Weakness",type:g,value:m.value,exceptions:m.exceptions,predicate:["origin:effect:kinetic-aura"]});a.createEmbeddedDocuments("Item",[f]);let c=[];d.doubleVs&&c.push("The creature has some resistances that are doubled versus criticals, this can't be automated and will have to be manually handled by the GM.");let k=`${Math.floor((e.level-n.level)/2)}d4`,y=CONFIG.Dice.rolls.find(g=>g.name==="DamageRoll"),v=await new y(k).evaluate({async:!0}),I=`
<h4 class="action">
    <strong>Extract Element</strong>
    <span class="action-glyph">1</span>
</h4>
<div class="target-dc-result" data-tooltip-class="pf2e" data-tooltip-direction="UP">
    <div class="target-dc"><span data-visibility="all" data-whose="target">Target: ${a.name}</span></div>
</div>
`;c.forEach(g=>I+=`<p>${g}</p>`),v.toMessage({flavor:I,speaker:ChatMessage.getSpeaker({actor:e}),flags:{pf2e:{context:{target:{token:i.document.uuid,actor:a.uuid}}}}}),console.log({saveRoll:r,damageRoll:v,source:f})}s(J,"extractElement");var T=new Set(["arcane","divine","occult","primal"]);function Q(t,{proficiencyWithoutLevel:e=!1,notMatchingTraditionModifier:n}){let i=be(t.level,{proficiencyWithoutLevel:e}),a=ke(t),o=F(i,a);return t.isMagical?ye(t,o,n):t.isAlchemical?{crafting:o}:{dc:o}}s(Q,"getItemIdentificationDCs");function ge(t,e){return t.has(e)}s(ge,"setHasElement");function he(t){let e=t.system.traits.value;return new Set(e.filter(n=>ge(T,n)))}s(he,"getMagicTraditions");function ye(t,e,n){let i={occult:e,primal:e,divine:e,arcane:e},a=he(t);for(let o of T)a.size>0&&!a.has(o)&&(i[o]=e+n);return{arcana:i.arcane,nature:i.primal,religion:i.divine,occultism:i.occult}}s(ye,"getIdentifyMagicDCs");function ke(t){return t.traits.has("cursed")?"unique":t.rarity}s(ke,"getDcRarity");var Z=new Map([[-1,13],[0,14],[1,15],[2,16],[3,18],[4,19],[5,20],[6,22],[7,23],[8,24],[9,26],[10,27],[11,28],[12,30],[13,31],[14,32],[15,34],[16,35],[17,36],[18,38],[19,39],[20,40],[21,42],[22,44],[23,46],[24,48],[25,50]]),we=new Map([["incredibly-easy",-10],["very-easy",-5],["easy",-2],["normal",0],["hard",2],["very-hard",5],["incredibly-hard",10]]);function Ie(t="common"){switch(t){case"uncommon":return"hard";case"rare":return"very-hard";case"unique":return"incredibly-hard";default:return"normal"}}s(Ie,"rarityToDCAdjustment");function ve(t,e="normal"){return t+(we.get(e)??0)}s(ve,"adjustDC");function F(t,e="common"){return ve(t,Ie(e))}s(F,"adjustDCByRarity");function be(t,{proficiencyWithoutLevel:e,rarity:n="common"}={}){let i=game.settings.get("pf2e","proficiencyVariant");e??=i==="ProficiencyWithoutLevel";let a=Z.get(t)??14;return F(e?a-Math.max(t,0):a,n)}s(be,"calculateDC");function C(t){let e=Math.clamped(t.level,-1,25);return Z.get(e)}s(C,"getDcByLevel");var xe={1:"RjuupS9xyXDLgyIr",2:"Y7UD64foDbDMV9sx",3:"ZmefGBXGJF3CFDbn",4:"QSQZJ5BC3DeHv153",5:"tjLvRWklAylFhBHQ",6:"4sGIy77COooxhQuC",7:"fomEZZ4MxVVK3uVu",8:"iPki3yuoucnj7bIt",9:"cFHomF3tty8Wi1e5",10:"o1XIHJ4MJyroAHfF"},K=[];async function X(t,e,n=!1){let i=await fromUuid(t);if(!i)return null;e===!1&&(e=i.system.level.value);let a=`Compendium.pf2e.equipment-srd.Item.${xe[e]}`;K[e]??=await fromUuid(a);let o=K[e]?.toObject();if(!o)return null;let r=o.system.traits;r.value=Array.from(new Set([...r.value,...i.traits])),r.rarity=i.rarity,r.value.includes("magical")&&r.value.some(l=>T.has(l))&&r.value.splice(r.value.indexOf("magical"),1),r.value.sort(),o._id=null,o.name=game.i18n.format("PF2E.Item.Physical.FromSpell.Scroll",{name:i.name,level:e});let f=o.system.description.value;return o.system.description.value=(()=>{let l=document.createElement("p");l.append(i.sourceId?`@UUID[${i.sourceId}]{${i.name}}`:i.description);let d=document.createElement("div"),m=document.createElement("hr");return d.append(l,m),m.insertAdjacentHTML("afterend",f),d.innerHTML})(),o.system.temporary=n,o.system.spell=i.clone({"system.location.heightenedLevel":e}).toObject(),o}s(X,"createSpellScroll");var x=class extends Application{constructor(e,n){super(n),this.items=e}static get defaultOptions(){return mergeObject(super.defaultOptions,{id:"idleuh-identify",title:"Identify Items",template:L("identify.html"),width:500})}getData(e){return mergeObject(super.getData(e),{items:this.items.map(n=>{let i=n.system.identification.identified,a=n.isIdentified,o=!a&&n.getFlag("world","identify.checked"),r=[];return a&&r.push("identified"),o&&r.push("checked"),{uuid:n.uuid,img:i.img,name:n.isOfType("treasure")?`($) ${i.name}`:i.name,css:r.join(" "),identified:a,checked:o}})})}activateListeners(e){e.find('[data-action="chat"]').on("click",this.#e.bind(this)),e.find('[data-action="checks"]').on("click",this.#t.bind(this)),e.find('[data-action="identify"]').on("click",this.#n.bind(this)),e.find('[data-action="remove"]').on("click",this.#i.bind(this)),e.find('[data-action="reset"]').on("click",this.#s.bind(this))}async#e(e){(await M(e))?.toMessage(void 0,{create:!0})}async#t(e){let n=await M(e);if(!n)return;let i=n.system.identification.unidentified.img,a=n.system.identification.unidentified.name,o=n.system.identification.identified.name,r=game.settings.get("pf2e","identifyMagicNotMatchingTraditionModifier"),f=game.settings.get("pf2e","proficiencyVariant")==="ProficiencyWithoutLevel",l=Q(n,{proficiencyWithoutLevel:f,notMatchingTraditionModifier:r}),d=Object.entries(l).map(([c,k])=>{c=c==="dc"?"crafting":c;let y=game.i18n.localize(CONFIG.PF2E.skillList[c]);return{slug:c,name:y,dc:k}}),m=n.isMagical?"action:identify-magic":n.isAlchemical?"action:identify-alchemy":null,u=await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",{itemImg:i,itemName:a,identifiedName:o,rollOptions:["concentrate","exploration","secret",m].filter(Boolean),skills:d});await CONFIG.ChatMessage.documentClass.create({user:game.user.id,content:u})}async#n(e){let n=await M(e);n&&(await n.setIdentificationStatus(n.isIdentified?"unidentified":"identified"),this.render())}async#i(e){let n=await M(e);if(!n)return;let i=n.getFlag("world","identify.checked");await n.setFlag("world","identify.checked",!i),this.render()}async#s(e){e.preventDefault();for(let n of this.items)n.isIdentified||!n.getFlag("world","identify.checked")||await n.setFlag("world","identify.checked",!1);this.render()}};s(x,"Identify");async function M(t){let e=$(t.currentTarget).closest("[data-item]"),n=e.attr("data-item"),i=await fromUuid(n);return i||e.remove(),i}s(M,"getItemFromEvent");function ee(){if(!game.user.isGM){ui.notifications.warn("You not the GM yo!");return}let e=game.actors.reduce((n,i)=>{if(!i.hasPlayerOwner)return n;let a=i.items.filter(o=>o.isOfType("physical")&&!o.isIdentified);return n.push(...a),n},[]);new x(e).render(!0)}s(ee,"identify");var te="pf2e.spells-srd",Se="Item.dcALVAyJbYSovzqt";async function ne(t){if(!t)return ui.notifications.warn("You must select an actor with the Imaginarium");let e=t.itemTypes.equipment.find(c=>c.getFlag("core","sourceId")===Se);if(!e||e.system.equipped.carryType==="dropped")return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession");let n=Math.floor(t.level/2)||1,o=(await game.packs.get(te).getIndex({fields:["system.level.value","system.traits","system.ritual"]})).filter(c=>c.system.level.value<=n&&!c.system.traits.value.includes("cantrip")&&!c.system.traits.value.includes("focus")&&!c.system.ritual&&c.system.traits.rarity==="common"),r=Math.floor(Math.random()*o.length),f=o[r],l=`Compendium.${te}.${f._id}`,d=l,m="",u=await X(l,n);if(u){u.name=u.name+" *";let[c]=await t.createEmbeddedDocuments("Item",[u]);m=" and received the following:",d=c.uuid}ChatMessage.create({content:`<p>Ripped the last page of the Imaginarium${m}</p><p>@UUID[${d}]</p>`,speaker:ChatMessage.getSpeaker({actor:t})})}s(ne,"ripImaginarium");var ie="Compendium.idleuh.effects.Item.jjFsfolNR04KzPVh",Ee="Compendium.idleuh.feats.Item.X3SZ0gTpBkGw3UGX",se="Compendium.idleuh.effects.Item.r0hicuQPY0OEAC6g";async function ae(t,e){if(!e||!e.isOwner||!e.isOfType("character")){ui.notifications.warn("You must select a character token you own.");return}if(!p(e,Ee,["feat"])){ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.");return}if(p(e,se,["effect"])){ui.notifications.warn("This character cannot enter <strong>Inspiring Marshal Stance</strong>.");return}let n=C(e),a=(await e.skills.diplomacy.roll({dc:{value:n},rollMode:"roll",label:'<span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <span>(Diplomacy Check)</span>',extraRollNotes:[{outcome:["criticalFailure"],text:"<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute."},{outcome:["failure"],text:"<strong>Failure</strong> You fail to enter the stance."},{outcome:["success"],text:"<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to attack rolls and saves against mental effects."},{outcome:["criticalSuccess"],text:"<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and grants you and allies a +1 status bonus to attack rolls and saves against mental effects."}]})).degreeOfSuccess;a>=2?await Ce(e,a):(await(await oe(e))?.delete(),a===0&&await De(e))}s(ae,"marshalInspiration");async function De(t){let e=await fromUuid(se);e&&await t.createEmbeddedDocuments("Item",[e.toObject()])}s(De,"setDebuff");async function Ce(t,e){let n=e===3?20:10,i=await oe(t);if(i){let f=deepClone(i._source.system.rules),l=f.find(d=>d.key==="ChoiceSet");if(l.selection===n)return;l.selection=n,i.update({"system.rules":f});return}let a=await fromUuid(ie);if(!a)return;let o=a.toObject(),r=o.system.rules.find(f=>f.key==="ChoiceSet");r.selection=n,await t.createEmbeddedDocuments("Item",[o])}s(Ce,"setEffect");async function oe(t){return p(t,ie,["effect"])}s(oe,"getEffect");var Me=["trained","expert","master","legendary","untrained"];async function re(){if(!game.user.isGM){ui.notifications.warn("You not the GM yo!");return}let t="<hr>",e=canvas.tokens;for(let n of e.placeables){let i=n.actor;!i||!i.isOfType("character","npc")||!i.hasPlayerOwner||!i.attributes.perception||(t+=await Ue(i))}ChatMessage.create({content:t,flavor:"Group Perception Checks",whisper:[game.user.id]})}s(re,"groupPerception");async function Ue(t){let e=t.attributes.perception,n=new game.pf2e.CheckModifier("",e),i=await game.pf2e.Check.roll(n,{actor:t,type:"skill-check",createMessage:!1,skipDialog:!0});if(!i)return"";let a=Me[(e.rank??1)-1],o=i.dice[0].total;if(o===void 0)return"";let r=`<div style="display:flex;justify-content:space-between;" title="${i.result}">`;return r+=`<span>${t.name} (${a})</span><span`,o==20?r+=' style="color: green;"':o==1&&(r+=' style="color: red;"'),`${r}>${i.total}</span></div>`}s(Ue,"rollPerception");var Oe="Compendium.pf2e.feats-srd.Item.40mZVDnIP5qBNhTH";function ce(t,e){if(!e?.isOfType("character")){ui.notifications.warn("You need to select a character");return}if(!p(e,Oe,["feat"])){ui.notifications.warn("Your selected character needs to have the feat <strong>Sand Snatcher</strong>");return}let i=game.user.targets.first()?.actor;e.getStatistic("impulse").roll({event:t,label:"Sand Snatcher - Grapple",target:i,dc:{slug:"fortitude",label:"Fortitude DC",value:i?.saves.fortitude.dc.value},traits:["attack","impulse","kineticist"],extraRollNotes:[{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalSuccess"),outcome:["criticalSuccess"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.success"),outcome:["success"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.failure"),outcome:["failure"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalFailure"),outcome:["criticalFailure"]}]})}s(ce,"sandSnatcher");var j="Compendium.idleuh.effects.Item.MqgbuaqGMJ92VRze",Y="Compendium.idleuh.effects.Item.Lz5hNf4dbXKjDWBa",A="Compendium.idleuh.effects.Item.8BxBB5ztfRI9vFfZ",le="Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg";async function ue(t,e,n){if(t.ctrlKey){game.user.isGM?P():U({type:"clean-exploit-vulnerability"}),ui.notifications.notify("All effects are being removed.");return}let i=game.user.targets,[a]=i,o=a?.actor;if(!e||!e.isOwner||!e.isOfType("character")||i.size!==1||!o||!o.isOfType("creature")){ui.notifications.warn("You must select a character token you own and target another one.");return}let r=D(e);if(!r)return;let f="action:recall-knowledge",l=C(o),d=e.getRollOptions(["all","skill-check","Esoteric"]);d.push(f),d.push("secret");let m=o.system.attributes.weaknesses,u=m.reduce((h,E)=>E.value>h?E.value:h,0),c=m.filter(h=>h.value===u).map(h=>h.type),k=c.join(", "),y=k?`<strong>[ ${k} ]</strong> = ${u}<br>`:"",I=(await r.roll({extraRollOptions:d,dc:{value:l},rollMode:"roll",label:'<span class="pf2-icon">A</span> <b>Exploit Vulnerability</b> <span">(Esoteric Check)</span>',extraRollNotes:[{outcome:["criticalFailure"],text:"<strong>Critical Failure</strong> You couldn't remember the right object to use and become distracted while you rummage through your esoterica. You become flat-footed until the beginning of your next turn."},{outcome:["failure"],text:"<strong>Failure</strong> Failing to recall a salient weakness about the creature, you instead attempt to exploit a more personal vulnerability. You can exploit only the creature's personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already."},{outcome:["success"],text:`${y}<strong>Success</strong> You recall an important fact about the creature, learning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, resistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`},{outcome:["criticalSuccess"],text:`${y}<strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, you have a flash of insight that grants even more knowledge about the creature. You learn all of the creature's resistances, weaknesses, and immunities, including the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, such as what spells will pass through a golem's antimagic. You can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`}]})).degreeOfSuccess,g=p(e,j,["effect"]);if(I>=1&&!g){let h=(await fromUuid(j)).toObject();e.createEmbeddedDocuments("Item",[h])}else if(I<1&&(g?.delete(),!z(e,le,["condition"]))){let E=(await fromUuid(le)).toObject();e.createEmbeddedDocuments("Item",[E])}let S=c.filter(h=>!n.includes(h)),b={type:"exploit-vulnerability",actorId:e.id,targetId:a.id,vulnerability:S.length?u:0,success:I};game.user.isGM?G(b):U(b)}s(ue,"exploitVulnerability");async function G({actorId:t,targetId:e,vulnerability:n,success:i}){let a=game.actors.get(t),o=canvas.tokens.get(e)?.actor;if(!a||!o)return;let r=2+Math.floor(a.level/2),f=i>1&&n>=r,l=(await fromUuid(A)).toObject(),d={key:"Weakness",type:"piercing",value:n,predicate:["origin:effect:exploit-vulnerability"]};l.system.rules.push(d);for(let m of canvas.tokens.placeables){let u=m.actor;if(!u||u===a)continue;let c=p(u,Y,["effect"]),k=p(u,A,["effect"]);if(await c?.delete(),await k?.delete(),!(i<1))if(u===o){let y=(await fromUuid(Y)).toObject(),v={key:"Weakness",type:"piercing",value:f?n:r,predicate:["origin:effect:exploit-vulnerability"]};y.system.rules.push(v),u.createEmbeddedDocuments("Item",[y])}else f&&u.id===o.id&&u.createEmbeddedDocuments("Item",[l])}}s(G,"exploitVulnerabilityGM");function P(){for(let t of canvas.tokens.placeables){let e=t.actor;if(!e)continue;let n=p(e,j,["effect"]),i=p(e,Y,["effect"]),a=p(e,A,["effect"]);n?.delete(),i?.delete(),a?.delete()}}s(P,"cleanExploitVulnerabilityGM");Hooks.once("init",()=>{game.modules.get(w).api={macros:{exploitVulnerability:ue,esotericCheck:R,groupPerception:re,identify:ee,ripImaginarium:ne,marshalInspiration:ae,sandSnatcher:ce,extractElement:J}},game.settings.register(w,"jquery",{name:"Disable JQuery Animations",hint:"Will cancel sliding animations on different parts of the UI.",type:Boolean,default:!1,config:!0,scope:"client",onChange:fe})});Hooks.once("ready",()=>{game.user.isGM&&W(Fe),V("jquery")&&fe(!0)});function fe(t){jQuery.fx.off=t}s(fe,"setJQueryFx");function Fe(t){t.type==="exploit-vulnerability"?G(t):t.type==="clean-exploit-vulnerability"&&P()}s(Fe,"onPacketReceived");})();
//# sourceMappingURL=main.js.map
