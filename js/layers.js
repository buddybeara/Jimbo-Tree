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
		if (hasUpgrade("f",11)) mult = mult.times(upgradeEffect("f",11))
		if (hasUpgrade("s",11)) mult = mult.times(upgradeEffect("s",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "j", description: "J: Reset for Jimbos", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: { // FIXED UPGRADE TEXT
		11: {
			title: "New Beginnings",
			description: "Hotsauce generates.",
			cost: new Decimal(1),
		},
		12: {
			title: "Prestigious Hotsauce",
			description: "Hotsauce gain is multiplied by Jimbos.",
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
			description: "Jimbo gain is multiplied by hotsauce gain.",
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
			description: "Hotsauce boosts itself.",
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
			description: "Jimbos boost the upgrade to the left and right.",
			cost: new Decimal(8),
			effect() {
				effect = player.j.points.add(1).log(100).add(1).pow(0.5)
				if (hasUpgrade("f",13)) { effect = effect.pow(upgradeEffect("f",13)) }
				return effect
			},
		  effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return hasUpgrade("j",12)&&hasUpgrade("j",13) }
		},
		23: {
			title: "Reversed Hotsauce",
			description: "Jimbo gain is boosted by hotsauce.",
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
    layerShown(){return true},
	doReset(resettingLayer) {
			let keep = [];
			if (hasMilestone("f", 0) && resettingLayer=="f") keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("j", keep)
		},
})
addLayer("f", {
	branches: ['j'],
	effectDescription() {
			return "which are generating "+format(tmp.f.effect)+" energy per second."
		},
    name: "factory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
    }},
    color: "#a3a2a5",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "factories", // Name of prestige currency
    baseResource: "jimbos", // Name of resource prestige is based on
    baseAmount() {return player.j.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("f",21)) { mult = mult.div(upgradeEffect("f",21)) }
		if (hasUpgrade("s",13)) { mult = mult.div(upgradeEffect("s",13)) }
        return mult
    },
	effect() {
		base = new Decimal(5)
		if (hasUpgrade("f",12)) { base = base.add(upgradeEffect("f",12)) }
		eff = base.pow(player.f.points).sub(1)
		return eff 
	},
	pointMult() {
		return player.f.energy.add(1).pow(0.5)
	},
	update(diff) {
			if (player.f.unlocked) {player.f.energy = player.f.energy.add(tmp.f.effect.times(diff))}
		},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for Factories", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: { // CHANGE UPGRADE TEXT I FORGOR :sob:
		11: {
			title: "Engineering",
			description: "Energy now boosts Jimbos by a small amount.",
			cost: new Decimal(1),
			effect() {
				effect = player.f.energy.add(1).pow(0.02).add(1)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return true }
		},
		12: {
			title: "Plasma Ring",
			description: "Energy boosts its own gain.",
			cost: new Decimal(2),
			effect() {
				effect = player.f.energy.add(1).log(25).div(5)
				return effect
			},
		  effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return true }
		},
		13: {
			title: "Outer Power",
			description: "Energy boosts Empower strength.",
			cost: new Decimal(2),
			effect() {
				effect = player.f.energy.add(1).log(1e3).div(12).add(1)
				return effect
			},
		  effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return true }
		},
		21: {
			title: "Self-Assembling Factories",
			description: "Factories boost their own gain.",
			cost: new Decimal(3),
			effect() {
				effect = player.f.points.add(1).pow(0.5).add(1)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return true }
		},
		22: {
			title: "Industrial Revolution",
			description: "Energy gives a small power to Hotsauce gain.",
			cost: new Decimal(4),
			effect() {
				effect = player.f.energy.add(1).pow(0.05).log(5).div(10).add(1)
				return effect
			},
		  effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return true }
		},
		23: {
			title: "Cooking",
			description: "Spices are slightly boosted by Jimbos.",
			cost: new Decimal(4),
			effect() {
				effect = player.j.points.pow(0.1).add(1)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return hasUpgrade("s",12) }
		},
	},
	milestones: {
			0: {
				requirementDescription: "4 Factories",
				done() { return player.f.points.gte(4) },
				effectDescription: "Factories don't reset Jimbo upgrades.",
			},
			1: {
				requirementDescription: "20 Factories",
				done() { return player.f.points.gte(20) },
				effectDescription: "x1.5 Spice.",
			},
		},
		tabFormat: ["main-display",
				["display-text",
				function() {return 'You have '+format(player.f.energy)+' energy, which is multiplying your point gain by '+format(tmp.f.pointMult)+'.'},
					{}],
				"blank",
			"prestige-button",
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
    layerShown(){return hasAchievement('a',11)}
})
addLayer("s", {
	branches: ['j'],
    name: "spice", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8f3e1e",
    requires: new Decimal(5000), // Can be a function that takes requirement increases into account
    resource: "spices", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("f",23)) mult = mult.times(upgradeEffect("j",23))
		if (hasMilestone("f",1)) mult = mult.times(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Spice", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: { // FIXED UPGRADE TEXT
		11: {
			title: "Salt and Pepper",
			description: "Spices now boost Jimbos.",
			cost: new Decimal(2),
			effect() {
				effect = player.s.points.add(1).log(10).add(1)
				return effect
			},
		  effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) },
		  unlocked() { return true }
		},
		12: {
			title: "More Choices",
			description: "Gain more Factory upgrades. (intended to have 3 but there's only 1 so far lmao)",
			cost: new Decimal(6),
		},
		13: {
			title: "Placeholders! Yippee!!!",
			description: "Reduce factory costs with our new invention, Jimspice. (Factory costs cannot go below 50 Jimbos)",
			cost: new Decimal(10),
			effect() {
				effect = player.s.points.add(1).pow(0.5)
				return effect
			},
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() { return true }
		},
	},
    layerShown(){return hasAchievement('a',15)},
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
            rows: 5,
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
			14: {
                name: "Gain Factory",
                done() { return getPointGen().gte(50) },
                tooltip: "Get 50 Hotsauces per second.",
            },
			15: {
                name: "Higher Domain",
                done() { return player.f.unlocked }, // update next layer
                tooltip: "Do a Row 2 Reset.",
            },
			21: {
                name: "Innovation",
                done() { return player.f.points.gte(10) },
                tooltip: "Get 10 Factories.",
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
