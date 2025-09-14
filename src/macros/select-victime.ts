async function selectVictim(event: Event): Promise<Notification | undefined> {
    return game.hud?.api.actions.randomPick();
}

export { selectVictim };
