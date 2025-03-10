addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        
		points:new Decimal(0)
            
        
    }},
    
    
    color: "#4BDC13",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 21))
        if (hasUpgrade('b', 11)) mult = mult.times(upgradeEffect('b', 11))
        if (hasUpgrade('b', 13)) mult = mult.dividedBy(upgradeEffect("b", 13))
        if(hasChallenge('o',12)) mult = mult.times(1000)
            
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses

        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    
    passiveGeneration(){
        let pas = new Decimal(0)
        if(hasUpgrade('p', 31)) pas = pas.add(0.1)
        if (hasMilestone('m',4))  pas = pas.times(5)  
        
        return pas
    },

    effect(){
        let eff=player[this.layer].points.add(1).pow(0.1)
        if(hasUpgrade('p',12))eff = eff.pow(2)
        return eff
    },
    effectDescription() {return "which boosts points gain by x"+format(layers.p.effect())}, 
    
    upgrades:{
        11:{
            title: "start idle",
            description: "point buffs point gain",
            cost: new Decimal(5),
            effect() {
                return player.points.add(5).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12:{
            title: "",
            description: "prestige buff is ^2(display ^1)",
            cost: new Decimal(20),
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21:{
            title: "AB",
            description: "points buffs your prestige point gain",
            cost: new Decimal(40),
            effect() {
                return player.points.add(100).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22:{
            title: "time buff time",
            description: "prestige buffs prestige gain",
            cost: new Decimal(300),
            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31:{
            title: "relax mouse or keyboard",
            description: "gain 10% prestige points every sec",
            cost: new Decimal(15000),
            effect() {
                if(hasUpgrade('p', 31))
                    return 0.1
                else
                return 0.0
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        32:{
            title: "up rank",
            description: "5x point gain",
            cost: new Decimal(1e20),
            
        },
        },
        doReset(resettingLayer) {
            // Stage 1, almost always needed, makes resetting this layer not delete your progress
            if (layers[resettingLayer].row <= this.row) return;
          
            // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
            let keptUpgrades = []
            if (false && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)
          
            // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
            let keep = [];
            if (hasMilestone('m',1)) keep.push("upgrades");
          
            // Stage 4, do the actual data reset
            layerDataReset(this.layer, keep);
          
            // Stage 5, add back in the specific subfeatures you saved earlier
            player[this.layer].upgrades.push(...keptUpgrades);
            if(hasChallenge('o',13)) player[this.layer].points=player[this.layer].points.add(1e40);
          }
    },
    

)
addLayer("b", {
    name: "buffer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#123456",
    
    requires(){
        let req = new Decimal(2e5)
        if(hasUpgrade('b',12)) req = req.times(0.001)
        if(hasUpgrade('b',21)) req = req.times(0.00001)
        if(hasUpgrade('b',22)) req = req.times(0.0000001)
        return req
    } , // Can be a function that takes requirement increases into account
    resource: "buffer", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player['p'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        let exp=0.2
        
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        
        mult = new Decimal(1)
        mult = mult.times(tmp.f.effect)
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade('f',11)) exp = exp.times(1.5)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "b:reset for buffers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    effect() {
        let eff=player[this.layer].points.add(1).pow(0.2)
        if(hasUpgrade('f',21)) eff = eff.times(100)
        return eff
    },
    effectDescription() {
        return "which boosts points gain by x"+format(layers.b.effect())
    }, 
    
    layerShown(){return true},
    passiveGeneration(){
        let pas = new Decimal(0)
        if(hasUpgrade('f',12)) pas = pas.add(player['f'].points).times(0.1)
        if (hasMilestone('m',4)) pas = pas.times(5)
        if(hasChallenge('o',12)) pas = pas.dividedBy(2)
        return pas
        
    },
    resetsNothing(){
        return false
    },
    upgrades:{
        11:{
            title: "prestige buffer",
            description: "buffer buffs prestige point",
            cost: new Decimal(1),
            effect(){
                return player[this.layer].points.add(100000).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12:{
            title: "Special sale",
            description: "buffer 1000x cheaper",
            cost: new Decimal(3),
            effect(){
                if(hasUpgrade('b',12))
                    0.001
                else
                1
            }
        },
        13:{
            title: "balance",
            description: "generate less prestige points to get more points(prestige^0.1)",
            cost: new Decimal(5000),
            effect(){
                return player['p'].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21:{
            title: "buffer generator",
            description: "buffer 100000x cheaper",
            cost: new Decimal(8),
            effect(){
                if(hasUpgrade('b',21))
                    0.00001
                else
                1
            }
            
        },
        22:{
            title: "black friday",
            description: "buffer 10000000x cheaper",
            cost: new Decimal(100),
            effect(){
                if(hasUpgrade('b',22))
                    0.0000001
                else
                1
            }
            
        }
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;
      
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (false && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)
      
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        if (hasMilestone('m',2)) keep.push("upgrades");
      
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
      
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
      }
})
addLayer("f", {
    name: "factory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    
    color: "#123456",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "factory", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player['p'].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    effect(){
        let eff=player[this.layer].points
        eff = new Decimal(5).pow(eff)
        return eff
    },
    effectDescription(){
        return "which boosts buffer and point gain by x"+format(layers.f.effect())
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "f:reset for factory", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades:{
        11:{
            title: "evolution",
            description: "buffer gain ^1.5 and 5x point generation",
            cost: new Decimal(2),
        },
        12:{
            title: "worker coming",
            description: "every factory gives 10% buffer gain",
            cost: new Decimal(4),
        },
        21:{
            title: "better product",
            description: "buffer effect x100",
            cost: new Decimal(6),
        },
    },
    autoPrestige(){
        if(hasChallenge('o',11))
            return true
    },
    resetsNothing(){
        if(hasChallenge('o',11))
            return true
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;
      
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (false && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)
      
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        if (hasMilestone('m',3)) keep.push("upgrades");
      
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
      
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
      },
    layerShown(){return true}
})
addLayer("m", {
    name: "milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

		points: new Decimal(3),
    }},
    color: "#123456",
    requires(){
        
        
        return  1e7
        
        
    } , // Can be a function that takes requirement increases into account
    resource: "milestone tier", // Name of prestige currency
    baseResource: "point", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        return 5
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 100, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "m:reset everything for milestone resets", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown(){return true},
    passiveGeneration(){
        return 0
    },
    milestones: {
        1: {
            requirementDescription: "tier 1",
            effectDescription: "double point generation and keep prestige upgrade",
            done() { return player.m.points.gte(1) }
        },
        2: {
            requirementDescription: "tier 2",
            effectDescription: "5x point generation and keep buffer upgrade",
            done() { return player.m.points.gte(2) }
        },
        3: {
            requirementDescription: "tier 3",
            effectDescription: "10x point generation and keep factory upgrade",
            done() { return player.m.points.gte(3) }
        },
        4: {
            requirementDescription: "tier 4",
            effectDescription: "5x prestige,buffers,products,points passive generation and keep product upgrade",
            done() { return player.m.points.gte(4) }
        }
    },
    
    upgrades:{
        
    }
})
addLayer("o", {
    name: "order", 
    symbol: "O",
    position: 2, 
    
    startData() { return {
        unlocked: true,
        challenge_time:new Decimal(0),
		points: new Decimal(0),
    }},
    color: "#123456",
    type:"static",
    baseAmount() {return player.points}, 
    exponent:11,
    requires(){
        
        
        return  1
        
        
    } ,
    resource:"order completed",
     // Name of prestige currency
    baseResource: "point",
    row: 2, // Row the layer is in on the tree (0 is the first row)
    
    resetsNothing:false,
    layerShown(){return true},
   
    
    challenges:{
        11: {
            name: "get automatic",
            challengeDescription: "use buffer to construct autobuyer",
            canComplete: function() {return player['b'].points.gte(1e25)},
            goalDescription(){
                return "reach 1e25 buffer"
            },
            rewardDescription(){
                return "auto buy factory and factory resets nothing"
            },
            onComplete(){
                player['o'].points = player['o'].points.add(1)
            },
        },
        12: {
            name: "build trust",
            challengeDescription: "make prestige to sell buffer",
            canComplete: function() {return player['p'].points.gte(1e95)},
            goalDescription(){
                return "reach 1e95 prestige"
            },
            rewardDescription(){
                return "buffer passive gain /2 but prestige gain x1000"
            },
            onComplete(){
                player['o'].points = player['o'].points.add(1)
            },
        },
        13: {
            name: "show efficiency",
            challengeDescription: "make buffers as fast as can(do a row 3 reset)",
            canComplete: function() {return player['b'].points.gte(1)},
            goalDescription(){
                return "reach 1e80 buffers in 30s"
            },
            rewardDescription(){
                return "start with 1e40 prestige points and point generation x1000"
            },
            onEnter(){
                resetRow(1111)
                doReset(this.layer)
                player['o'].challenge_time= new Decimal(30)
            },
            onComplete(){
                player['o'].points = player['o'].points.add(1)
            },
        },
        doReset(resettingLayer) {
            // Stage 1, almost always needed, makes resetting this layer not delete your progress
            if (layers[resettingLayer].row <= this.row) return;
            player['p'].points = new Decimal(0)
            
            player['b'].points = new Decimal(0)
            player["pd"].points = new Decimal(0)
            player['b'].points = new Decimal(0)        
            // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
            let keptUpgrades = []
            if (false && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)
          
            // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
            let keep = [];
            
          
            // Stage 4, do the actual data reset
            layerDataReset(this.layer, keep);
          
            // Stage 5, add back in the specific subfeatures you saved earlier
            player[this.layer].upgrades.push(...keptUpgrades)
          }
    },
    update(){
        if(player['o'].challenge_time>0)    player['o'].challenge_time=player['o'].challenge_time.add(-0.05)
    }
   ,
   effectDescription(){
    return "you have " + player['o'].challenge_time +"s left"
   },
    upgrades:{
        
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text",
            function() { return '' },
            { "color": "red", "font-size": "32px", "font-family": "Comic Sans MS" }],
        "blank",
        ["toggle", ["c", "beep"]],
        "milestones",
        "challenges",
        "blank",
        "blank",
        "upgrades"
    ],
    resetsNothing:false,
})
addLayer("pd", {
    name: "product", 
    symbol: "PD", 
    position: 2, 
    startData() { return {
        unlocked: false,

		points: new Decimal(0),
    }},
    color: "#123456",
    requires(){
        
        let req = new Decimal(1e50)
        req = req.times(layers.pd.effect())
        return  req
        
        
    } , // Can be a function that takes requirement increases into account
    resource: "product", // Name of prestige currency
    baseResource: "buffers", // Name of resource prestige is based on
    baseAmount() {return player['b'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
        let eff=player[this.layer].points
        eff = new Decimal(2).pow(eff)
        return eff
    },
    effectDescription(){
        return "Storage costs lead to price increases x"+format(layers.pd.effect())+",current price is "+format(layers.pd.requires())
    },
    exponent(){
        return 1e-100
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow:1
    ,
    resetsNothing:true,
    hotkeys: [
        {key: "P", description: "shift+p:get products with nothing reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown(){return true},
    passiveGeneration(){
        let pas = new Decimal(0)
        if (hasMilestone('m',4)) pas = pas.times(5)
        return pas
    },
    
    doReset(resettingLayer) {
        
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;
      
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (false && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)
      
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        if (hasMilestone('m',4)) keep.push("upgrades");
      
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
      
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
            },
    upgrades:{
        
    },
    
    
    
   
    upgrades:{
        
    }
})

addLayer("l", {
    name: "production line", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,

		points: new Decimal(0),
    }},
    color: "#123456",
    requires(){
        
        
        return  1e7
        
        
    } , // Can be a function that takes requirement increases into account
    resource: "production line", // Name of prestige currency
    baseResource: "product", // Name of resource prestige is based on
    baseAmount() {return player["pd"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        return 5
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "shift+p:reset products for production line", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    effect(){

    },
    effectDescription(){
        return 0
    },
    layerShown(){return true},
    passiveGeneration(){
        return 0
    },
    
    
    upgrades:{
        
    },
    
    
    
   
    upgrades:{
        
    }
})

