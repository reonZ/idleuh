function getUserSettings() {
    const isGM = game.user.isGM;

    return {
        core: {
            chatBubbles: false,
            chatBubblesPan: false,
            leftClickRelease: true,
        },
        system: {
            distanceDisplay: "never",
        },
        "pf2e-dailies.addedHighlight": {
            addedHighlight: true,
        },
        "pf2e-hud": {
            "foundrySidebar.expand": true,
            "foundrySidebar.noRollMode": true,
            "tracker.enabled": true,
            "dice.enabled": true,
            "persistent.display": "left",
            "persistent.selection": "manual",
            "persistent.autoFill": true,
            "time.enabled": true,
            "token.activation": isGM ? "second" : "disabled",
            "tooltip.distance": "idiot",
            "tooltip.status": true,
        },
        "pf2e-toolbelt": {
            "actionable.use": true,
            "actionable.apply": true,
            "betterSheet.showPlayers": isGM ? true : undefined,
            "betterSheet.sortList": true,
            "betterSheet.retrainFeats": false,
            "betterEffectsPanel.remove": true,
            "betterInventory.improvised": true,
            "betterInventory.mergeItems": true,
            "betterInventory.splitItem": true,
            "betterMovement.history": true,
            "conditionManager.enabled": true,
            "mergeDamage.merge": true,
            "mergeDamage.inject": false,
            "targetHelper.targets": true,
            "targetHelper.checks": true,
            "targetHelper.template": true,
            "betterTrade.invertTrade": isGM ? undefined : true,
        },
        "xdy-pf2e-workbench": {
            decreaseFrightenedConditionEachTurn: true,
        },
    };
}

export { getUserSettings };
