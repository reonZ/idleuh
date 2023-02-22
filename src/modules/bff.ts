import { getSetting } from '@utils/foundry/settings'

const effectId = 'Item.pFguo7KVVjFMqHhe'

export function enableBFF(enable: boolean) {
    if (!game.user.isGM) return
    const method = enable ? 'on' : 'off'
    Hooks[method]('updateToken', updateToken)
}

function getDebuff(actor: ActorPF2e) {
    return actor.itemTypes.effect.find(x => x.getFlag('core', 'sourceId') === effectId)
}

function updateToken(token: TokenDocument, data: DocumentUpdateData<TokenDocument>) {
    const actor = token.actor as ActorPF2e | undefined
    if (!('x' in data || 'y' in data) || !actor) return
    const debuff = getDebuff(actor)
    if (debuff) setDebuff(token, debuff)
}

function setDebuff(firstToken: TokenDocument, firstDebuff: EffectPF2e) {
    let otherToken
    let otherDebuff

    const tokens = canvas.tokens.placeables
    for (const token of tokens) {
        const otherActor = token.actor
        if (!otherActor || otherActor === firstToken.actor) continue
        const debuff = getDebuff(otherActor)
        if (!debuff) continue
        otherToken = token
        otherDebuff = debuff
        break
    }

    if (!otherToken || !otherDebuff) {
        firstDebuff.update({ 'system.badge.value': 0 })
        return
    }

    const distance = canvas.grid.measureDistance(firstToken, otherToken, { gridSpaces: true })
    const squares = distance / 5
    const debuff = squares <= getSetting<number>('bffDistance') ? 1 : 0

    firstDebuff.update({ 'system.badge.value': debuff })
    otherDebuff.update({ 'system.badge.value': debuff })
}
