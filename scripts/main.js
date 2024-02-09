(()=>{var xe=Object.defineProperty;var s=(t,e)=>xe(t,"name",{value:e,configurable:!0});function E(t){let e=["esoteric","esoteric-lore","lore-esoteric"],n=Object.values(t.skills).find(i=>e.includes(i.slug));return n||ui.notifications.warn("This character doesn't have the 'Esoteric' skill"),n}s(E,"getEsotericSkill");function _(t,e){if(!e||!e.isOwner||!e.isOfType("character")){ui.notifications.warn("You must select a character token you own.");return}let n=E(e);if(!n)return;let i=new Set,a=[{text:`Can be used to Recall Knowledge regarding haunts, curses 
    and creatures of any type, but can't be used to Recall Knowledge of other topics.`}];n.roll({rollMode:"blindroll",extraRollNotes:a,options:i})}s(_,"esotericCheck");var v="idleuh";function z(t){return game.settings.get(v,t)}s(z,"getSetting");function B(t){game.socket.on(`module.${v}`,t)}s(B,"socketOn");function T(t){game.socket.emit(`module.${v}`,t)}s(T,"socketEmit");function L(...t){return t=t.filter(e=>typeof e=="string"),`modules/${v}/templates/${t.join("/")}`}s(L,"templatePath");function H(t){return Array.isArray(t)?e=>Se(e,t):e=>J(e)===t}s(H,"getItemSourceIdCondition");function q(t,e){return e?e.flatMap(n=>t.itemTypes[n]):t.items}s(q,"getItems");function p(t,e,n){return q(t,n).find(H(e))}s(p,"findItemWithSourceId");function J(t){return t.getFlag("core","sourceId")}s(J,"getSourceId");function Se(t,e){let n=J(t);return n?e.includes(n):!1}s(Se,"includesSourceId");function K(t,e,n){return q(t,n).some(H(e))}s(K,"hasItemWithSourceId");var De="Compendium.pf2e.classfeatures.Item.jyCEC3eC4B6YaGoy",j="Compendium.idleuh.effects.Item.9IapmSGjH0hDaVMv",X=["bludgeoning","slashing","piercing"],Q=["fire","earth",...X];async function Z(t,e){if(!e?.isOfType("character")){ui.notifications.warn("You need to select a character");return}let n=p(e,De,["feat"]);if(!n){ui.notifications.warn("Your selected character needs to have the feat <strong>Extract Element</strong>");return}let i=game.user.targets.first(),a=i?.actor;if(!a||a===e){ui.notifications.warn("You need to target another actor");return}if(p(a,j,["effect"])){ui.notifications.warn("Your target's elements have already been extracted");return}let r=await a.saves.fortitude.roll({event:t,label:"Fortitude Save - Extract Element",dc:{slug:"class",label:"Kineticist DC",value:e.classDC.dc.value}});if(r.degreeOfSuccess>2)return;let u=(await fromUuid(j))?.toObject(),c=u.system.rules;u.flags.core.sourceId=j;let l={};c.push({key:"Immunity",mode:"remove",type:Q.slice(),predicate:["origin:effect:kinetic-aura"]});let m=!1,f=a.attributes.resistances.filter(({type:g})=>Q.includes(g));for(let{type:g,value:S,exceptions:b,doubleVs:h}of f)g==="earth"?m={value:S,exceptions:b}:c.push({key:"Weakness",type:g,value:S,exceptions:b,predicate:["origin:effect:kinetic-aura"]}),h.length&&(l.doubleVs=!0);if(m)for(let g of X)c.push({key:"Weakness",type:g,value:m.value,exceptions:m.exceptions,predicate:["origin:effect:kinetic-aura"]});a.createEmbeddedDocuments("Item",[u]);let d=[];l.doubleVs&&d.push("The creature has some resistances that are doubled versus criticals, this can't be automated and will have to be manually handled by the GM.");let w=`${Math.floor((e.level-n.level)/2)}d4`,y=CONFIG.Dice.rolls.find(g=>g.name==="DamageRoll"),I=await new y(w).evaluate({async:!0}),k=`
<h4 class="action">
    <strong>Extract Element</strong>
    <span class="action-glyph">1</span>
</h4>
<div class="target-dc-result" data-tooltip-class="pf2e" data-tooltip-direction="UP">
    <div class="target-dc"><span data-visibility="all" data-whose="target">Target: ${a.name}</span></div>
</div>
`;d.forEach(g=>k+=`<p>${g}</p>`),I.toMessage({flavor:k,speaker:ChatMessage.getSpeaker({actor:e}),flags:{pf2e:{context:{target:{token:i.document.uuid,actor:a.uuid}}}}}),console.log({saveRoll:r,damageRoll:I,source:u})}s(Z,"extractElement");var Y=new Set(["arcane","divine","occult","primal"]);function te(t,{proficiencyWithoutLevel:e=!1,notMatchingTraditionModifier:n}){let i=je(t.level,{proficiencyWithoutLevel:e}),a=Oe(t),o=A(i,a);return t.isMagical?Ce(t,o,n):t.isAlchemical?{crafting:o}:{dc:o}}s(te,"getItemIdentificationDCs");function Ee(t,e){return t.has(e)}s(Ee,"setHasElement");function Me(t){let e=t.system.traits.value;return new Set(e.filter(n=>Ee(Y,n)))}s(Me,"getMagicTraditions");function Ce(t,e,n){let i={occult:e,primal:e,divine:e,arcane:e},a=Me(t);for(let o of Y)a.size>0&&!a.has(o)&&(i[o]=e+n);return{arcana:i.arcane,nature:i.primal,religion:i.divine,occultism:i.occult}}s(Ce,"getIdentifyMagicDCs");function Oe(t){return t.traits.has("cursed")?"unique":t.rarity}s(Oe,"getDcRarity");var ne=new Map([[-1,13],[0,14],[1,15],[2,16],[3,18],[4,19],[5,20],[6,22],[7,23],[8,24],[9,26],[10,27],[11,28],[12,30],[13,31],[14,32],[15,34],[16,35],[17,36],[18,38],[19,39],[20,40],[21,42],[22,44],[23,46],[24,48],[25,50]]),Ue=new Map([["incredibly-easy",-10],["very-easy",-5],["easy",-2],["normal",0],["hard",2],["very-hard",5],["incredibly-hard",10]]);function Fe(t="common"){switch(t){case"uncommon":return"hard";case"rare":return"very-hard";case"unique":return"incredibly-hard";default:return"normal"}}s(Fe,"rarityToDCAdjustment");function Te(t,e="normal"){return t+(Ue.get(e)??0)}s(Te,"adjustDC");function A(t,e="common"){return Te(t,Fe(e))}s(A,"adjustDCByRarity");function je(t,{proficiencyWithoutLevel:e,rarity:n="common"}={}){let i=game.settings.get("pf2e","proficiencyVariant");e??=i==="ProficiencyWithoutLevel";let a=ne.get(t)??14;return A(e?a-Math.max(t,0):a,n)}s(je,"calculateDC");function M(t){let e=Math.clamped(t.level,-1,25);return ne.get(e)}s(M,"getDcByLevel");var Ae={1:"RjuupS9xyXDLgyIr",2:"Y7UD64foDbDMV9sx",3:"ZmefGBXGJF3CFDbn",4:"QSQZJ5BC3DeHv153",5:"tjLvRWklAylFhBHQ",6:"4sGIy77COooxhQuC",7:"fomEZZ4MxVVK3uVu",8:"iPki3yuoucnj7bIt",9:"cFHomF3tty8Wi1e5",10:"o1XIHJ4MJyroAHfF"},ee=[];async function ie(t,e,n=!1){let i=await fromUuid(t);if(!i)return null;e===!1&&(e=i.system.level.value);let a=`Compendium.pf2e.equipment-srd.Item.${Ae[e]}`;ee[e]??=await fromUuid(a);let o=ee[e]?.toObject();if(!o)return null;let r=o.system.traits;r.value=Array.from(new Set([...r.value,...i.traits])),r.rarity=i.rarity,r.value.includes("magical")&&r.value.some(c=>Y.has(c))&&r.value.splice(r.value.indexOf("magical"),1),r.value.sort(),o._id=null,o.name=game.i18n.format("PF2E.Item.Physical.FromSpell.Scroll",{name:i.name,level:e});let u=o.system.description.value;return o.system.description.value=(()=>{let c=document.createElement("p");c.append(i.sourceId?`@UUID[${i.sourceId}]{${i.name}}`:i.description);let l=document.createElement("div"),m=document.createElement("hr");return l.append(c,m),m.insertAdjacentHTML("afterend",u),l.innerHTML})(),o.system.temporary=n,o.system.spell=i.clone({"system.location.heightenedLevel":e}).toObject(),o}s(ie,"createSpellScroll");var $e=function(t,e,n){if(n||arguments.length===2)for(var i=0,a=e.length,o;i<a;i++)(o||!(i in e))&&(o||(o=Array.prototype.slice.call(e,0,i)),o[i]=e[i]);return t.concat(o||Array.prototype.slice.call(e))};function ae(t,e,n){var i=t.length-e.length,a=Array.from(e);if(i===0)return t.apply(void 0,a);if(i===1){var o=s(function(r){return t.apply(void 0,$e([r],a,!1))},"ret");return(n||t.lazy)&&(o.lazy=n||t.lazy,o.lazyArgs=e),o}throw new Error("Wrong number of arguments")}s(ae,"purry");function C(t){for(var e={},n=0,i=t;n<i.length;n++){var a=i[n],o=a[0],r=a[1];e[o]=r}return e}s(C,"fromPairs");(function(t){t.strict=t})(C||(C={}));var O=function(){return O=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},O.apply(this,arguments)},Ye=function(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,i=Object.getOwnPropertySymbols(t);a<i.length;a++)e.indexOf(i[a])<0&&Object.prototype.propertyIsEnumerable.call(t,i[a])&&(n[i[a]]=t[i[a]]);return n};function se(){return ae(Ge,arguments)}s(se,"omit");function Ge(t,e){if(e.length===0)return O({},t);if(e.length===1){var n=e[0],i=t,a=n,o=i[a],r=Ye(i,[typeof a=="symbol"?a:a+""]);return r}if(!e.some(function(c){return c in t}))return O({},t);var u=new Set(e);return C(Object.entries(t).filter(function(c){var l=c[0];return!u.has(l)}))}s(Ge,"_omit");var x=class extends Application{constructor(e,n){super(n),this.items=e}static get defaultOptions(){return mergeObject(Application.defaultOptions,{id:"idleuh-identify",title:"Identify Items",template:L("identify.html"),width:500})}getData(e){return mergeObject(super.getData(e),{items:this.items.map(n=>{let i=n.system.identification.identified,a=n.isIdentified,o=!a&&n.getFlag("world","identify.checked"),r=[];return a&&r.push("identified"),o&&r.push("checked"),{uuid:n.uuid,img:i.img,name:n.isOfType("treasure")?`($) ${i.name}`:i.name,css:r.join(" "),identified:a,checked:o}})})}activateListeners(e){e.find('[data-action="chat"]').on("click",this.#e.bind(this)),e.find('[data-action="checks"]').on("click",this.#t.bind(this)),e.find('[data-action="identify"]').on("click",this.#n.bind(this)),e.find('[data-action="remove"]').on("click",this.#i.bind(this)),e.find('[data-action="reset"]').on("click",this.#a.bind(this))}async#e(e){(await U(e))?.toMessage(void 0,{create:!0})}async#t(e){let n=await U(e),i=n.system.identification.identified.name,a=te(n,{pwol:game.pf2e.settings.variants.pwol.enabled,notMatchingTraditionModifier:game.settings.get("pf2e","identifyMagicNotMatchingTraditionModifier")}),o=n.isMagical?"identify-magic":n.isAlchemical?"identify-alchemy":null,r=await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",{identifiedName:i,action:o,skills:se(a,["dc"]),unidentified:n.system.identification.unidentified,uuid:n.uuid});await ChatMessage.implementation.create({user:game.user.id,content:r})}async#n(e){let n=await U(e);n&&(await n.setIdentificationStatus(n.isIdentified?"unidentified":"identified"),this.render())}async#i(e){let n=await U(e);if(!n)return;let i=n.getFlag("world","identify.checked");await n.setFlag("world","identify.checked",!i),this.render()}async#a(e){e.preventDefault();for(let n of this.items)n.isIdentified||!n.getFlag("world","identify.checked")||await n.setFlag("world","identify.checked",!1);this.render()}};s(x,"Identify");async function U(t){let e=$(t.currentTarget).closest("[data-item]"),n=e.attr("data-item"),i=await fromUuid(n);return i||e.remove(),i}s(U,"getItemFromEvent");function oe(){if(!game.user.isGM){ui.notifications.warn("You not the GM yo!");return}let e=game.actors.reduce((n,i)=>{if(!i.hasPlayerOwner)return n;let a=i.items.filter(o=>o.isOfType("physical")&&!o.isIdentified);return n.push(...a),n},[]);new x(e).render(!0)}s(oe,"identify");var re="pf2e.spells-srd",Re="Item.dcALVAyJbYSovzqt";async function ce(t){if(!t)return ui.notifications.warn("You must select an actor with the Imaginarium");let e=t.itemTypes.equipment.find(d=>d.getFlag("core","sourceId")===Re);if(!e||e.system.equipped.carryType==="dropped")return ui.notifications.warn("This actor doesn't have the Imaginarium in their possession");let n=Math.floor(t.level/2)||1,o=(await game.packs.get(re).getIndex({fields:["system.level.value","system.traits","system.ritual"]})).filter(d=>d.system.level.value<=n&&!d.system.traits.value.includes("cantrip")&&!d.system.traits.value.includes("focus")&&!d.system.ritual&&d.system.traits.rarity==="common"),r=Math.floor(Math.random()*o.length),u=o[r],c=`Compendium.${re}.${u._id}`,l=c,m="",f=await ie(c,n);if(f){f.name=`${f.name} *`;let[d]=await t.createEmbeddedDocuments("Item",[f]);m=" and received the following:",l=d.uuid}ChatMessage.create({content:`<p>Ripped the last page of the Imaginarium${m}</p><p>@UUID[${l}]</p>`,speaker:ChatMessage.getSpeaker({actor:t})})}s(ce,"ripImaginarium");var le="Compendium.idleuh.effects.Item.jjFsfolNR04KzPVh",Pe="Compendium.idleuh.feats.Item.X3SZ0gTpBkGw3UGX",ue="Compendium.idleuh.effects.Item.r0hicuQPY0OEAC6g";async function fe(t,e){if(!e||!e.isOwner||!e.isOfType("character")){ui.notifications.warn("You must select a character token you own.");return}if(!p(e,Pe,["feat"])){ui.notifications.warn("This character doesn't have <strong>Inspiring Marshal Stance</strong> feat.");return}if(p(e,ue,["effect"])){ui.notifications.warn("This character cannot enter <strong>Inspiring Marshal Stance</strong>.");return}let n=M(e),a=(await e.skills.diplomacy.roll({dc:{value:n},rollMode:"roll",label:'<span class="pf2-icon">A</span> <b>Marshal Inspiration</b> <span>(Diplomacy Check)</span>',extraRollNotes:[{outcome:["criticalFailure"],text:"<strong>Critical Failure</strong> You fail to enter the stance and can't take this action again for 1 minute."},{outcome:["failure"],text:"<strong>Failure</strong> You fail to enter the stance."},{outcome:["success"],text:"<strong>Success</strong> Your marshal's aura grants you and allies a +1 status bonus to attack rolls and saves against mental effects."},{outcome:["criticalSuccess"],text:"<strong>Critical Success</strong> Your marshal's aura increases to a 20ft. emanation and grants you and allies a +1 status bonus to attack rolls and saves against mental effects."}]})).degreeOfSuccess;a>=2?await We(e,a):(await(await me(e))?.delete(),a===0&&await Ve(e))}s(fe,"marshalInspiration");async function Ve(t){let e=await fromUuid(ue);e&&await t.createEmbeddedDocuments("Item",[e.toObject()])}s(Ve,"setDebuff");async function We(t,e){let n=e===3?20:10,i=await me(t);if(i){let u=deepClone(i._source.system.rules),c=u.find(l=>l.key==="ChoiceSet");if(c.selection===n)return;c.selection=n,i.update({"system.rules":u});return}let a=await fromUuid(le);if(!a)return;let o=a.toObject(),r=o.system.rules.find(u=>u.key==="ChoiceSet");r.selection=n,await t.createEmbeddedDocuments("Item",[o])}s(We,"setEffect");async function me(t){return p(t,le,["effect"])}s(me,"getEffect");async function F({actor:t,token:e,item:n,formula:i}){let a=CONFIG.Dice.rolls.find(l=>l.name==="DamageRoll"),o=await new a(i).evaluate({async:!0}),r=Array.from(n.traits),u={type:"damage-roll",sourceType:"attack",actor:t.id,token:e?.id,target:null,domains:[],options:[r,t.getRollOptions(),n.getRollOptions("item")].flat(),mapIncreases:void 0,notes:[],secret:!1,rollMode:"roll",traits:r,skipDialog:!1,outcome:null,unadjustedOutcome:null},c=`<h4 class="action"><strong>${n.name}</strong></h4>`;return c+='<div class="tags" data-tooltip-class="pf2e">',c+=r.map(l=>{let m=game.i18n.localize(CONFIG.PF2E.actionTraits[l]),f=CONFIG.PF2E.traitsDescriptions[l];return`<span class="tag" data-trait="${l}" data-tooltip="${f}">${m}</span>`}).join(""),c+="</div><hr>",o.toMessage({flavor:c,speaker:ChatMessage.implementation.getSpeaker({actor:t,token:e}),flags:{pf2e:{context:u,origin:n.getOriginData()}}})}s(F,"rollDamage");var Ne="Compendium.pf2e.feats-srd.Item.XJCsa3UbQtsKcqve";async function de(t,e){let n=t?.itemTypes.feat.find(a=>a.sourceId===Ne);if(!n){ui.notifications.warn("You need to select a kineticist with the <strong>Thermal Nimbus</strong> feat.");return}let i=`${Math.floor(t.level/2)}[fire]`;await F({actor:t,token:e,item:n,formula:i})}s(de,"thermalNimbus");var _e=["untrained","trained","expert","master","legendary"];async function pe(){if(!game.user.isGM){ui.notifications.warn("You not the GM yo!");return}let t="",e=game.actors.party?.members??[];await Promise.all(e.map(async n=>{if(!n.isOfType("character"))return;let i=await n.perception.roll({createMessage:!1}),a=i.dice[0].total;t+=`<div style="display:flex;justify-content:space-between;" title="${i.result}">`,t+=`<span>${n.name} (${_e[n.perception.rank]})</span><span`,a===20?t+=' style="color: green;"':a===1&&(t+=' style="color: red;"'),t+=`>${i.total}</span></div>`})),t&&ChatMessage.create({content:t,flavor:"Group Perception Checks<hr>",whisper:[game.user.id]})}s(pe,"groupPerception");var ze="Compendium.pf2e.feats-srd.Item.40mZVDnIP5qBNhTH";function ge(t,e){if(!e?.isOfType("character")){ui.notifications.warn("You need to select a character");return}if(!p(e,ze,["feat"])){ui.notifications.warn("Your selected character needs to have the feat <strong>Sand Snatcher</strong>");return}let i=game.user.targets.first()?.actor;e.getStatistic("impulse").roll({event:t,label:"Sand Snatcher - Grapple",target:i,dc:{slug:"fortitude",label:"Fortitude DC",value:i?.saves.fortitude.dc.value},traits:["attack","impulse","kineticist"],extraRollNotes:[{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalSuccess"),outcome:["criticalSuccess"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.success"),outcome:["success"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.failure"),outcome:["failure"]},{text:game.i18n.localize("PF2E.Actions.Grapple.Notes.criticalFailure"),outcome:["criticalFailure"]}]})}s(ge,"sandSnatcher");var G="<strong>Spike Skin</strong> effect",Be="Compendium.idleuh.effects.Item.aJWj25WLTiG67a1y",Le="Compendium.pf2e.feats-srd.Item.9p28s0zg4Vv4r5i2";function he(t){return t?.itemTypes.effect.find(e=>e.sourceId===Be)}s(he,"getEffect");function ye(){ui.notifications.warn(`You need to select an actor with the ${G}.`)}s(ye,"effectMissing");async function ve(t){let e=he(t);if(!e)return ye();let n=e.system.duration.value;if(n<=0){ui.notifications.warn(`The ${G} is already expired on the selected actor.`);return}await e.update({"system.duration.value":Math.max(0,n-1)}),ui.notifications.info(`The ${G} duration has been reduced by 1 minute.`)}s(ve,"spikeSkinDuration");async function we(t,e){if(!he(t))return ye();let i=await fromUuid(Le),a=`${Math.floor((t.level-8)/2)*2+2}[piercing]`;await F({actor:t,token:e,item:i,formula:a})}s(we,"spikeSkinDamage");var R="Compendium.idleuh.effects.Item.MqgbuaqGMJ92VRze",P="Compendium.idleuh.effects.Item.Lz5hNf4dbXKjDWBa",V="Compendium.idleuh.effects.Item.8BxBB5ztfRI9vFfZ",ke="Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg";async function Ie(t,e,n){if(t.ctrlKey){game.user.isGM?N():T({type:"clean-exploit-vulnerability"}),ui.notifications.notify("All effects are being removed.");return}let i=game.user.targets,[a]=i,o=a?.actor;if(!e||!e.isOwner||!e.isOfType("character")||i.size!==1||!o||!o.isOfType("creature")){ui.notifications.warn("You must select a character token you own and target another one.");return}let r=E(e);if(!r)return;let u="action:recall-knowledge",c=M(o),l=e.getRollOptions(["all","skill-check","Esoteric"]);l.push(u),l.push("secret");let m=o.system.attributes.weaknesses,f=m.reduce((h,D)=>D.value>h?D.value:h,0),d=m.filter(h=>h.value===f).map(h=>h.type),w=d.join(", "),y=w?`<strong>[ ${w} ]</strong> = ${f}<br>`:"",k=(await r.roll({extraRollOptions:l,dc:{value:c},rollMode:"roll",label:'<span class="pf2-icon">A</span> <b>Exploit Vulnerability</b> <span">(Esoteric Check)</span>',extraRollNotes:[{outcome:["criticalFailure"],text:"<strong>Critical Failure</strong> You couldn't remember the right object to use and become distracted while you rummage through your esoterica. You become flat-footed until the beginning of your next turn."},{outcome:["failure"],text:"<strong>Failure</strong> Failing to recall a salient weakness about the creature, you instead attempt to exploit a more personal vulnerability. You can exploit only the creature's personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already."},{outcome:["success"],text:`${y}<strong>Success</strong> You recall an important fact about the creature, learning its highest weakness (or one of its highest weaknesses, if it has multiple with the same value) but not its other weaknesses, resistances, or immunities. You can exploit either the creature's mortal weakness or personal antithesis. Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`},{outcome:["criticalSuccess"],text:`${y}<strong>Critical Success</strong> You remember the creature's weaknesses, and as you empower your esoterica, you have a flash of insight that grants even more knowledge about the creature. You learn all of the creature's resistances, weaknesses, and immunities, including the amounts of the resistances and weaknesses and any unusual weaknesses or vulnerabilities, such as what spells will pass through a golem's antimagic. You can exploit either the creature's mortal weakness or personal antithesis (see the Exploit Vulnerability class feature). Your unarmed and weapon Strikes against the creature also become magical if they weren't already.`}]})).degreeOfSuccess,g=p(e,R,["effect"]);if(k>=1&&!g){let h=(await fromUuid(R)).toObject();e.createEmbeddedDocuments("Item",[h])}else if(k<1&&(g?.delete(),!K(e,ke,["condition"]))){let D=(await fromUuid(ke)).toObject();e.createEmbeddedDocuments("Item",[D])}let S=d.filter(h=>!n.includes(h)),b={type:"exploit-vulnerability",actorId:e.id,targetId:a.id,vulnerability:S.length?f:0,success:k};game.user.isGM?W(b):T(b)}s(Ie,"exploitVulnerability");async function W({actorId:t,targetId:e,vulnerability:n,success:i}){let a=game.actors.get(t),o=canvas.tokens.get(e)?.actor;if(!a||!o)return;let r=2+Math.floor(a.level/2),u=i>1&&n>=r,c=(await fromUuid(V)).toObject(),l={key:"Weakness",type:"piercing",value:n,predicate:["origin:effect:exploit-vulnerability"]};c.system.rules.push(l);for(let m of canvas.tokens.placeables){let f=m.actor;if(!f||f===a)continue;let d=p(f,P,["effect"]),w=p(f,V,["effect"]);if(await d?.delete(),await w?.delete(),!(i<1))if(f===o){let y=(await fromUuid(P)).toObject(),I={key:"Weakness",type:"piercing",value:u?n:r,predicate:["origin:effect:exploit-vulnerability"]};y.system.rules.push(I),f.createEmbeddedDocuments("Item",[y])}else u&&f.id===o.id&&f.createEmbeddedDocuments("Item",[c])}}s(W,"exploitVulnerabilityGM");function N(){for(let t of canvas.tokens.placeables){let e=t.actor;if(!e)continue;let n=p(e,R,["effect"]),i=p(e,P,["effect"]),a=p(e,V,["effect"]);n?.delete(),i?.delete(),a?.delete()}}s(N,"cleanExploitVulnerabilityGM");Hooks.once("init",()=>{game.modules.get(v).api={macros:{exploitVulnerability:Ie,esotericCheck:_,groupPerception:pe,identify:oe,ripImaginarium:ce,marshalInspiration:fe,sandSnatcher:ge,extractElement:Z,thermalNimbus:de,spikeSkinDuration:ve,spikeSkinDamage:we}},game.settings.register(v,"jquery",{name:"Disable JQuery Animations",hint:"Will cancel sliding animations on different parts of the UI.",type:Boolean,default:!1,config:!0,scope:"client",onChange:be})});Hooks.once("ready",()=>{game.user.isGM&&B(He),z("jquery")&&be(!0)});function be(t){jQuery.fx.off=t}s(be,"setJQueryFx");function He(t){t.type==="exploit-vulnerability"?W(t):t.type==="clean-exploit-vulnerability"&&N()}s(He,"onPacketReceived");})();
//# sourceMappingURL=main.js.map
