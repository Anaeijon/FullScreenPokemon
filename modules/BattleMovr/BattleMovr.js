/*
FSP.BattleMover.startBattle({
    "opponent": {
        "title": "Rattata"
    },
    "playerActors": [
        {
            "title": "Mew"
        }
    ]
});
*/

/**
 * BattleMovr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function BattleMovr(settings) {
    "use strict";
    if (this === window) {
        return new BattleMovr(settings);
    }
    var self = this,

        EightBitter,

        actors,

        battleMenuName,

        battleMenuOptions,

        battleInfo,

        animations,

        defaults,

        positions;

    /**
     * 
     */
    self.reset = function (settings) {
        var i;

        EightBitter = settings.EightBitter;
        if (typeof EightBitter === "undefined") {
            throw new Error("No EightBitter given to BattleMovr.");
        }

        battleMenuName = settings.battleMenuName;
        if (typeof battleMenuName === "undefined") {
            throw new Error("No battleMenuName given to BattleMovr.");
        }

        battleMenuOptions = settings.battleMenuOptions;
        if (typeof battleMenuOptions === "undefined") {
            throw new Error("No battleMenuOptions given to BattleMovr.");
        }

        animations = settings.animations;
        if (typeof animations === "undefined") {
            throw new Error("No animations given to BattleMovr.");
        }

        defaults = settings.defaults || {};

        positions = settings.positions;

        actors = {};
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getEightBitter = function () {
        return EightBitter;
    };

    /**
     * 
     */
    self.getActors = function () {
        return actors;
    };

    /**
     * 
     */
    self.getActor = function (name) {
        return actors[name];
    };


    /* Actor manipulations
    */

    /**
     * 
     */
    self.startBattle = function (settings) {
        var textStart = settings.textStart || defaults.textStart || ["", ""];

        battleInfo = settings;

        EightBitter.setMap("Blank", "White");

        EightBitter.MenuGrapher.createMenu("Battle");
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            textStart[0] + battleInfo.opponent.title + textStart[1],
            startBattleIntro
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        self.setActor("player", "PlayerBack");

        self.setActor("opponent", battleInfo.opponent.title + "Front", {
            "displayTitle": battleInfo.opponent.title.toUpperCase()
        });
    };

    /**
     * 
     */
    function startBattleIntro() {
        var textEntry = battleInfo.textEntry || defaults.textEntry || ["", ""];

        EightBitter.MenuGrapher.createMenu("BattleDisplayOpponent");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText", 
            textEntry[0] + "(pokemanz)" + textEntry[1]
        );
        
        EightBitter.TimeHandler.addEvent(
            animations.playerLeaveLeft, 14, actors.player, showPlayerStats
        );
    };

    /**
     * 
     */
    function showPlayerStats() {
        EightBitter.MenuGrapher.createMenu("BattleDisplayPlayer");
        animations.actorEntrance(
            EightBitter, -1, -1, enterPlayerActor
        );
    }

    /**
     * 
     */
    function enterPlayerActor() {
        self.setActor("player", battleInfo.playerActors[0].title + "Back");

        EightBitter.MenuGrapher.createMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(showPlayerMenu, 21);
    }

    /**
     * 
     */
    function showPlayerMenu() {
        EightBitter.MenuGrapher.createMenu("BattleOptions");
        EightBitter.MenuGrapher.addMenuList("BattleOptions", {
            "options": battleMenuOptions
        });
        EightBitter.MenuGrapher.setActiveMenu("BattleOptions");
    }

    ///**
    // * 
    // */
    //self.showBattleMenu = function () {
    //    EightBitter.MenuGrapher.createMenu("GeneralText");

    //    EightBitter.MenuGrapher.createMenu("BattleDisplayOpponent");
    //    EightBitter.MenuGrapher.addMenuDialog(
    //        "BattleDisplayOpponent",
    //        actors.opponent.displayTitle
    //    );

    //    EightBitter.MenuGrapher.createMenu("BattleOptions");
    //    EightBitter.MenuGrapher.addMenuList("BattleOptions", {
    //        "options": battleMenuOptions
    //    });
    //    EightBitter.MenuGrapher.setActiveMenu("BattleOptions");

    //    // Used by MenuGrapher.addMenuDialog
    //    return false;
    //};

    /**
     * 
     */
    self.setActor = function (name, type, settings) {
        var position = positions[name] || {},
            battleMenu = EightBitter.MenuGrapher.getMenu(battleMenuName),
            thing = actors[name];

        if (thing) {
            EightBitter.killNormal(thing);
        }

        thing = actors[name] = EightBitter.ObjectMaker.make(type, settings);

        EightBitter.addThing(
            thing,
            battleMenu.left + (position.left || 0) * EightBitter.unitsize,
            battleMenu.top + (position.top || 0) * EightBitter.unitsize
        );

        EightBitter.GroupHolder.switchObjectGroup(
            thing,
            thing.groupType,
            "Text"
        );
    };


    self.reset(settings || {});
}