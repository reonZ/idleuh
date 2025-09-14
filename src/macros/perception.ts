async function groupPerception(): Promise<Notification | undefined> {
    return game.hud?.api.actions.rollGroupPerception();
}

export { groupPerception };
