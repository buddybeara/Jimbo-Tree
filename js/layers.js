addLayer("j", {
    name: "jimbo", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f0a3d0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "jimbos", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("j",13)) mult = mult.times(upgradeEffect("j",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "j", description: "J: Reset for jimbos", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: { // CHANGE UPGRADE TEXT I FORGOR :sob:
		11: {
			title: "New Beginnings",
			description: "Jimbos generate.",
			cost: new Decimal(1),
		},
		12: {
			title: "Prestigious Hotsauce",
			description: "Jimbo gain is multiplied by Prestiged Jimbos.",
			cost: new Decimal(1),
			effect() {
				effect = player.j.points.add(1).pow(0.4)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return hasUpgrade("j",11) }
		},
		13: {
			title: "Interesting Synergy",
			description: "Prestiged Jimbo gain is multiplied by Jimbo gain.",
			cost: new Decimal(3),
			effect() {
				effect = getPointGen().log(2).add(1)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return hasUpgrade("j",11) }
		},
		21: {
			title: "Antiwalled",
			description: "Jimbo gain boosts itself.",
			cost: new Decimal(5),
			effect() {
				effect = player.points.add(1).log(10).add(1)
				if (hasUpgrade("j",22)) effect = effect.pow(upgradeEffect(this.layer, 22))
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return hasUpgrade("j",12)&&hasUpgrade("j",13) }
		},
		22: {
			title: "Empowering",
			description: "Prestiged Jimbos boost the upgrade to the left and right.",
			cost: new Decimal(8),
			effect() {
				effect = player.j.points.add(1).log(100).add(1).pow(0.5)
				return effect
			},
		  effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return hasUpgrade("j",12)&&hasUpgrade("j",13) }
		},
		23: {
			title: "Reversed Hotsauce",
			description: "Prestiged Jimbo gain is boosted by Jimbos.",
			cost: new Decimal(5),
			effect() {
				effect = player.points.add(1).log(15).add(1).pow(0.5).add(1)
				if (hasUpgrade("j",22)) effect = effect.pow(upgradeEffect(this.layer, 22))
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return hasUpgrade("j",12)&&hasUpgrade("j",13) }
		},
	},
    layerShown(){return true}
})
addLayer("a", {
        startData() { return {
            unlocked: true,
        }},
        color: "yellow",
        row: "side",
		symbol: "A",
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("Achievements")
        },
		requires: new Decimal(0),
		baseResource: "points",
		baseAmount() {return player.points},
        achievements: {
            rows: 6,
            cols: 7,
            11: {
                name: "The beginning of something great",
                done() { return player.j.points.gte(1) },
                tooltip: "Perform a Jimbo reset.",
            },
			12: {
                name: "Hotsauce Factory",
                done() { return player.points.gte(50) },
                tooltip: "Get 50 Hotsauces.",
            },
			13: {
                name: "Jimbo Factory",
                done() { return player.j.points.gte(50) },
                tooltip: "Get 50 Jimbos.",
            },
		},
		tabFormat: [
			"blank", 
			["display-text", function() { return "You have "+player.a.achievements.length+" achievements."}], 
			"blank", "blank",
			"achievements",
		],
    }, 
)
