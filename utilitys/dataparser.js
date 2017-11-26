'use strict'

const { MessageEmbed } = require('discord.js');
const Matcher = require('did-you-mean');
const stripIndents = require('common-tags').stripIndents;
const config = require('config.json')('./config.json');

const abilities = require("../data/abilities.js");
const aliases = require("../data/aliases.js");
const items = require("../data/items.js");
const learnsets = require("../data/learnsets.js");
const moves = require("../data/moves.js");
const pokedex = require("../data/pokedex.js");
const typechart = require("../data/typechart.js");

class EmbedGenerator {
    constructor(parser) {
        this.parser = parser;
    }

    quick(title, text) {
        return new MessageEmbed()
        .setDescription(text)
        .setTitle(title)
        .setColor(config.embedColor)
        .setTimestamp();
    }

    generateAbilityEmbed(ability, parser) {
        return new MessageEmbed()
        .setDescription(`${ability.desc}`)
        .setAuthor(ability.name)
        .setColor(config.embedColor)
        .setTimestamp();
    }
    generatePokemonEmbed(pokemon, parser) {
        let weakChart = parser.weak(pokemon);

        return new MessageEmbed()
        .setAuthor(`${pokemon.num.toString()} - ${pokemon.species}`)
        .setColor(config.embedColor)
        .setDescription(stripIndents`
        **HP:** ${pokemon.baseStats.hp}
        **Atk:** ${pokemon.baseStats.atk}
        **Def:** ${pokemon.baseStats.def}
        **SpA:** ${pokemon.baseStats.spa}
        **SpD:** ${pokemon.baseStats.spd}
        **Spe:** ${pokemon.baseStats.spe}
        **BST:** ${Object.values(pokemon.baseStats).reduce((a, b) => a + b, 0)}`)
        .setThumbnail(`http://play.pokemonshowdown.com/sprites/xyani/${pokemon.species.toLowerCase().replace(" ", "").replace('-', '')}.gif`)
        .setTimestamp()
        .addField(`Types`, `${pokemon.types.join(", ")}`)
        .addField(`Abilities`, `${Object.values(pokemon.abilities).join(", ")}`)
        .addField(`Weakness & Resistance`, stripIndents`
        *1x values are ommited use \`weak ${weakChart.pokemon} true\` to show.*`
        + `${weakChart["Bug"] != 1 ? `\n**Bug**: ${weakChart["Bug"]}`: ""}`
        + `${weakChart["Dark"] != 1 ? `\n**Dark**: ${weakChart["Dark"]}`: ""}`
        + `${weakChart["Dragon"] != 1 ? `\n**Dragon**: ${weakChart["Dragon"]}`: ""}`
        + `${weakChart["Electric"] != 1 ? `\n**Electric**: ${weakChart["Electric"]}`: ""}`
        + `${weakChart["Fairy"] != 1 ? `\n**Fairy**: ${weakChart["Fairy"]}`: ""}`
        + `${weakChart["Fighting"] != 1 ? `\n**Fighting**: ${weakChart["Fighting"]}`: ""}`
        + `${weakChart["Fire"] != 1 ? `\n**Fire**: ${weakChart["Fire"]}`: ""}`
        + `${weakChart["Flying"] != 1 ? `\n**Flying**: ${weakChart["Flying"]}`: ""}`
        + `${weakChart["Ghost"] != 1 ? `\n**Ghost**: ${weakChart["Ghost"]}`: ""}`
        + `${weakChart["Grass"] != 1 ? `\n**Grass**: ${weakChart["Grass"]}`: ""}`
        + `${weakChart["Ground"] != 1 ? `\n**Ground**: ${weakChart["Ground"]}`: ""}`
        + `${weakChart["Ice"] != 1 ? `\n**Ice**: ${weakChart["Ice"]}`: ""}`
        + `${weakChart["Normal"] != 1 ? `\n**Normal**: ${weakChart["Normal"]}`: ""}`
        + `${weakChart["Poison"] != 1 ? `\n**Poison**: ${weakChart["Poison"]}`: ""}`
        + `${weakChart["Psychic"] != 1 ? `\n**Psychic**: ${weakChart["Psychic"]}`: ""}`
        + `${weakChart["Rock"] != 1 ? `\n**Rock**: ${weakChart["Rock"]}`: ""}`
        + `${weakChart["Steel"] != 1 ? `\n**Steel**: ${weakChart["Steel"]}`: ""}`
        + `${weakChart["Water"] != 1 ? `\n**Water**: ${weakChart["Water"]}`: ""}`)
        .addField(`Misc`, stripIndents`**Height (M):** ${pokemon.heightm}
        **Weight (KG):** ${pokemon.weightkg}
        **Color:** ${pokemon.color}`)
    }
    generateItemEmbed(item, parser) {
        return new MessageEmbed()
        .setDescription(`${item.desc}`)
        .setAuthor(item.name)
        .setColor(config.embedColor)
        .setThumbnail(`https://www.serebii.net/itemdex/sprites/pgl/${item.id}.png`)
        .setTimestamp();
    }
    generateMoveEmbed(move, parser) {
        let details = {
            "Priority": move.priority,
            "Gen": move.gen || 'CAP',
        };

        if (move.secondary || move.secondaries) details["Secondary effect"] = "";
        if (move.flags['contact']) details["Contact"] = "";
        if (move.flags['sound']) details["Sound"] = "";
        if (move.flags['bullet']) details["Bullet"] = "";
        if (move.flags['pulse']) details["Pulse"] = "";
        if (!move.flags['protect'] && !/(ally|self)/i.test(move.target)) details["Bypasses Protect"] = "";
        if (move.flags['authentic']) details["Bypasses Substitutes"] = "";
        if (move.flags['defrost']) details["Thaws user"] = "";
        if (move.flags['bite']) details["Bite"] = "";
        if (move.flags['punch']) details["Punch"] = "";
        if (move.flags['powder']) details["Powder"] = "";
        if (move.flags['reflectable']) details["Bounceable"] = "";
        if (move.flags['gravity']) details["Suppressed by Gravity"] = "";

        if (move.zMovePower) {
            details["Z-Power"] = move.zMovePower;
        } else if (move.zMoveEffect) {
            details["Z-Effect"] = {
                'clearnegativeboost': "Restores negative stat stages to 0",
                'crit2': "Crit ratio +2",
                'heal': "Restores HP 100%",
                'curse': "Restores HP 100% if user is Ghost type, otherwise Attack +1",
                'redirect': "Redirects opposing attacks to user",
                'healreplacement': "Restores replacement's HP 100%",
            }[move.zMoveEffect];
        } else if (move.zMoveBoost) {
            details["Z-Effect"] = "";
            let boost = move.zMoveBoost;
            let stats = {atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', accuracy: 'Accuracy', evasion: 'Evasiveness'};
            for (let i in boost) {
                details["Z-Effect"] += " " + stats[i] + " +" + boost[i];
            }
        } else {
            details["Z-Effect"] = "None";
        }

        details["Target"] = {
            'normal': "One Adjacent Pokmon",
            'self': "User",
            'adjacentAlly': "One Ally",
            'adjacentAllyOrSelf': "User or Ally",
            'adjacentFoe': "One Adjacent Opposing Pokmon",
            'allAdjacentFoes': "All Adjacent Opponents",
            'foeSide': "Opposing Side",
            'allySide': "User's Side",
            'allyTeam': "User's Side",
            'allAdjacent': "All Adjacent Pokmon",
            'any': "Any Pokmon",
            'all': "All Pokmon",
        }[move.target] || "Unknown";

        if (move.id === 'mirrormove') {
            details['https://pokemonshowdown.com/dex/moves/mirrormove'] = '';
        }

        return new MessageEmbed()
        .setAuthor(`${move.name}`)
        .setColor(config.embedColor)
        .setDescription(stripIndents`
        ${move.desc}`)
        .setTimestamp()
        .addField(`Info`, stripIndents`
        **Type:** ${move.type}
        **Category:** ${move.category}
        **Base Power:** ${move.hasOwnProperty('basePower') ? move.basePower : 'N/A'}
        **Target:** ${details["Target"]}
        **${details.hasOwnProperty("Z-Effect") ? `Z-Effect:** ${details["Z-Effect"]}` : `Z-Power:** ${details["Z-Power"]}`}`
        + `${details.hasOwnProperty("Contact") ? `${details["Contact"]}\n` : ""}`
        + `${details.hasOwnProperty("Sound") ? `${details["Sound"]}\n` : ""}`
        + `${details.hasOwnProperty("Bullet") ? `${details["Bullet"]}\n` : ""}`
        + `${details.hasOwnProperty("Pulse") ? `${details["Pulse"]}\n` : ""}`
        + `${details.hasOwnProperty("Bypasses Protect") ? `${details["Bypasses Protect"]}\n` : ""}`
        + `${details.hasOwnProperty("Bypasses Substitutes") ? `${details["Bypasses Substitutes"]}\n` : ""}`
        + `${details.hasOwnProperty("Thaws user") ? `${details["Thaws user"]}\n` : ""}`
        + `${details.hasOwnProperty("Bite") ? `${details["Bite"]}\n` : ""}`
        + `${details.hasOwnProperty("Punch") ? `${details["Punch"]}\n` : ""}`
        + `${details.hasOwnProperty("Powder") ? `${details["Powder"]}\n` : ""}`
        + `${details.hasOwnProperty("Bounceable") ? `${details["Bounceable"]}\n` : ""}`
        + `${details.hasOwnProperty("Suppressed by Gravity") ? `${details["Suppressed by Gravity"]}\n` : ""}
        `)
    }
    generateWeakEmbed(weakChart, full) {
        if (full) {
            return new MessageEmbed()
            .setDescription(stripIndents`
            \n*Damage multiplyers for ${weakChart.pokemon}*
            **Bug**: ${weakChart["Bug"]}
            **Dark**: ${weakChart["Dark"]}
            **Dragon**: ${weakChart["Dragon"]}
            **Electric**: ${weakChart["Electric"]}
            **Fairy**: ${weakChart["Fairy"]}
            **Fighting**: ${weakChart["Fighting"]}
            **Fire**: ${weakChart["Fire"]}
            **Flying**: ${weakChart["Flying"]}
            **Ghost**: ${weakChart["Ghost"]}
            **Grass**: ${weakChart["Grass"]}
            **Ground**: ${weakChart["Ground"]}
            **Ice**: ${weakChart["Ice"]}
            **Normal**: ${weakChart["Normal"]}
            **Poison**: ${weakChart["Poison"]}
            **Psychic**: ${weakChart["Psychic"]}
            **Rock**: ${weakChart["Rock"]}
            **Steel**: ${weakChart["Steel"]}
            **Water**: ${weakChart["Water"]}
            `)
            .setAuthor(weakChart.pokemon)
            .setColor(config.embedColor)
            .setTimestamp();
        } else {
            return new MessageEmbed()
            .setDescription(stripIndents`
            \n*Damage multiplyers for ${weakChart.pokemon}*
            *1x values are ommited use \`weak ${weakChart.pokemon} true\` to show.*`
            + `${weakChart["Bug"] != 1 ? `\n**Bug**: ${weakChart["Bug"]}`: ""}`
            + `${weakChart["Dark"] != 1 ? `\n**Dark**: ${weakChart["Dark"]}`: ""}`
            + `${weakChart["Dragon"] != 1 ? `\n**Dragon**: ${weakChart["Dragon"]}`: ""}`
            + `${weakChart["Electric"] != 1 ? `\n**Electric**: ${weakChart["Electric"]}`: ""}`
            + `${weakChart["Fairy"] != 1 ? `\n**Fairy**: ${weakChart["Fairy"]}`: ""}`
            + `${weakChart["Fighting"] != 1 ? `\n**Fighting**: ${weakChart["Fighting"]}`: ""}`
            + `${weakChart["Fire"] != 1 ? `\n**Fire**: ${weakChart["Fire"]}`: ""}`
            + `${weakChart["Flying"] != 1 ? `\n**Flying**: ${weakChart["Flying"]}`: ""}`
            + `${weakChart["Ghost"] != 1 ? `\n**Ghost**: ${weakChart["Ghost"]}`: ""}`
            + `${weakChart["Grass"] != 1 ? `\n**Grass**: ${weakChart["Grass"]}`: ""}`
            + `${weakChart["Ground"] != 1 ? `\n**Ground**: ${weakChart["Ground"]}`: ""}`
            + `${weakChart["Ice"] != 1 ? `\n**Ice**: ${weakChart["Ice"]}`: ""}`
            + `${weakChart["Normal"] != 1 ? `\n**Normal**: ${weakChart["Normal"]}`: ""}`
            + `${weakChart["Poison"] != 1 ? `\n**Poison**: ${weakChart["Poison"]}`: ""}`
            + `${weakChart["Psychic"] != 1 ? `\n**Psychic**: ${weakChart["Psychic"]}`: ""}`
            + `${weakChart["Rock"] != 1 ? `\n**Rock**: ${weakChart["Rock"]}`: ""}`
            + `${weakChart["Steel"] != 1 ? `\n**Steel**: ${weakChart["Steel"]}`: ""}`
            + `${weakChart["Water"] != 1 ? `\n**Water**: ${weakChart["Water"]}`: ""}`
            )
            .setAuthor(weakChart.pokemon)
            .setColor(config.embedColor)
            .setTimestamp();
        }
    }
    generateLearnEmbed(learn) {
        let { pokemon, move, ret, suc } = learn;
        if (suc) {
            let final = "";
            for (let i=1; i<=ret.length; i++) {
                final = final + `** **- gen ${ret[i-1].generation} ${ret[i-1].source} \n`
            }
            return new MessageEmbed()
            .setAuthor(`${pokedex.BattlePokedex[pokemon].species} can learn ${moves.BattleMovedex[move].name}!`)
            .setColor(config.embedColor)
            .setDescription(final)
            .setTimestamp()
        } else {
            return new MessageEmbed()
            .setAuthor(`${pokemon} can't learn ${move}!`)
            .setColor(config.embedColor)
            .setDescription(ret)
            .setTimestamp()
        }
    }
}

class Parser {
    constructor(client) {
        this.client = client;
        this.EmbedGenerator = new EmbedGenerator(this);

        this.types = ["ability", "pokemon", "item", "move"];
        
        this.generators = {
            "ability": this.EmbedGenerator.generateAbilityEmbed,
            "pokemon": this.EmbedGenerator.generatePokemonEmbed,
            "item": this.EmbedGenerator.generateItemEmbed,
            "move": this.EmbedGenerator.generateMoveEmbed,
        }
    
        this.dataArrays = {
            "ability": abilities.BattleAbilities,
            "pokemon": pokedex.BattlePokedex,
            "item": items.BattleItems,
            "move": moves.BattleMovedex
        }

        let match = Object.keys(this.dataArrays[this.types[0]]);
        for (let i=1; i<this.types.length; i++) {
            match = match.concat(Object.keys(this.dataArrays[this.types[i]]));
        }
        
        this.match = match;
    }
    getAliasOf(alias) {
        alias = alias.toLowerCase();
        if (aliases.BattleAliases.hasOwnProperty(alias)) return aliases.BattleAliases[alias];
        else return false;
    }
    parseAbility(name) {
        let m = new Matcher(Object.keys(abilities.BattleAbilities).join(" "));
        m.setThreshold(3);
        if (!abilities.BattleAbilities.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (abilities.BattleAbilities.hasOwnProperty(name)) return abilities.BattleAbilities[name];
        else throw new ReferenceError(`${name} is not an ability!`, 'dataparser.js', 102);
    }
    parsePokemon(name) {
        let m = new Matcher(Object.keys(pokedex.BattlePokedex).join(" "));
        m.setThreshold(3);
        if (!pokedex.BattlePokedex.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (pokedex.BattlePokedex.hasOwnProperty(name)) return pokedex.BattlePokedex[name];
        else return false;
    }
    parseItem(name) {
        let m = new Matcher(Object.keys(items.BattleItems).join(" "));
        m.setThreshold(3);
        if (!items.BattleItems.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (items.BattleItems.hasOwnProperty(name)) return items.BattleItems[name];
        else throw new ReferenceError(`${name} is not an item!`, 'dataparser.js', 102);
    }
    parseMove(name) {
        let m = new Matcher(Object.keys(items.BattleItems).join(" "));
        m.setThreshold(3);
        if (!moves.BattleMovedex.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (moves.BattleMovedex.hasOwnProperty(name)) return moves.BattleMovedex[name];
        else throw new ReferenceError(`${name} is not a move!`, 'dataparser.js', 102);
    }

    parse(name) {
        let m = new Matcher(this.match.join(" "));
        m.setThreshold(3);
        for (let i=0; i<this.types.length; i++) {
            let type = this.types[i];
            if (this.dataArrays[type].hasOwnProperty(name)) { // If the name is in the array
                return this.generators[type](this.dataArrays[type][name], this);
            } else if (m.get(name)){
                name = m.get(name);
                if (this.dataArrays[type].hasOwnProperty(name)) return this.generators[type](this.dataArrays[type][name], this);
            } 
        }
        return false;
    }

    learn(pokemon, move) {
        let { BattleLearnsets } = learnsets;

        let moveMatcher = new Matcher(Object.keys(moves.BattleMovedex).join(" "));
        moveMatcher.setThreshold(3);
        if (!moves.BattleMovedex.hasOwnProperty(move) && moveMatcher.get(move)) move = moveMatcher.get(move);
        move = move.toLowerCase().replace(" ", "");
        if (!moves.BattleMovedex.hasOwnProperty(move)) return {ret: `${move} is not a move!`, pokemon: pokemon, suc: false, move: move};

        let monMatcher = new Matcher(Object.keys(pokedex.BattlePokedex).join(" "));
        monMatcher.setThreshold(3);
        if (!pokedex.BattlePokedex.hasOwnProperty(pokemon) && monMatcher.get(pokemon)) pokemon = monMatcher.get(pokemon);
        pokemon = pokemon.toLowerCase().replace(" ", "");
        
        if (!BattleLearnsets[pokemon]) return {ret: `${pokemon} is not a pokemon!`, pokemon: pokemon, suc: false, move: move};
        let pokemonLearnsets = BattleLearnsets[pokemon].learnset;
        if (!Object.keys(pokemonLearnsets).includes(move)) return {ret: `${move} not found in ${pokemon}'s learnset!`, pokemon: pokemon, suc: false, move: move};
        // Pokemon can learn move
        let sourceNames = {E:"egg", S:"event", D:"dream world", M: "technical or hidden machine", L: "level [level]", T: "tutor", V:"virtual console transfer from gen 1", E:"egg", Y:"event, traded back"};
        let souceID = Object.keys(sourceNames);
        let learnMethod = BattleLearnsets[pokemon].learnset[move];
        let ret = [];
    
        for (let i=1; i<=learnMethod.length; i++) {
            let gen = parseInt(learnMethod[i-1].charAt());
            let source = sourceNames[learnMethod[i-1].charAt(1)].replace("[level]", learnMethod[i-1].substring(2));
            ret.push({
                generation: gen,
                source, source
            });
        }
        return {ret: ret, pokemon: pokemon,suc: true, move: move};
    }

    weak(pokemon) {
        let types = Object.keys(typechart.BattleTypeChart);
        let weakChart = {
            pokemon: pokemon.species,
			"Bug": 1,
			"Dark": 1,
			"Dragon": 1,
			"Electric": 1,
			"Fairy": 1,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 1,
			"Ghost": 1,
			"Grass": 1,
			"Ground": 1,
			"Ice": 1,
			"Normal": 1,
			"Poison": 1,
			"Psychic": 1,
			"Rock": 1,
			"Steel": 1,
			"Water": 1,
        };
        
        for (let i=0; i<pokemon.types.length; i++) {
            let current = typechart.BattleTypeChart[pokemon.types[i]];
            for (let x=0; x<types.length; x++) {
                let dmg = weakChart[types[x]];
                switch (current.damageTaken[types[x]]) {
                    case 3:
                    weakChart[types[x]] = 0;
                    break;
                    case 2:
                    weakChart[types[x]] = dmg / 2;
                    break;
                    case 1:
                    weakChart[types[x]] = dmg * 2;
                    break;
                }
            }
        }
        return weakChart;
    }

}

module.exports.Parser = Parser;