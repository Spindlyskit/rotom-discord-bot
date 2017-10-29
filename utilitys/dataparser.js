'use strict'

const { RichEmbed } = require('discord.js');
const Matcher = require('did-you-mean');
const stripIndents = require('common-tags').stripIndents;

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

    generateAbilityEmbed(ability, parser) {
        return new RichEmbed()
        .setDescription(`${ability.desc}`)
        .setAuthor(ability.name)
        .setColor(0x00AE86)
        .setTimestamp();
    }
    generatePokemonEmbed(pokemon, parser) {
        let weakChart = parser.weak(pokemon);

        return new RichEmbed()
        .setAuthor(`${pokemon.num.toString()} - ${pokemon.species}`)
        .setColor(0x00AE86)
        .setDescription(stripIndents`
        **HP:** ${pokemon.baseStats.hp}
        **Atk:** ${pokemon.baseStats.atk}
        **Def:** ${pokemon.baseStats.def}
        **SpA:** ${pokemon.baseStats.spa}
        **SpD:** ${pokemon.baseStats.spd}
        **Spe:** ${pokemon.baseStats.spe}
        **BST:** ${Object.values(pokemon.baseStats).reduce((a, b) => a + b, 0)}`)
        .setThumbnail(`http://play.pokemonshowdown.com/sprites/xyani/${pokemon.species.toLowerCase().replace(" ", "")}.gif`)
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
        return new RichEmbed()
        .setDescription(`${item.desc}`)
        .setAuthor(item.name)
        .setColor(0x00AE86)
        .setThumbnail(`https://www.serebii.net/itemdex/sprites/pgl/${item.id}.png`)
        .setTimestamp();
    }
    generateMoveEmbed(move, parser) {
        return new RichEmbed()
        .setAuthor(`${move.name}`)
        .setColor(0x00AE86)
        .setDescription(stripIndents`
        ${move.desc}`)
        .setTimestamp()
        .addField(`Info`, `${move.type} - ${move.category}`)
        .setFooter(`Priority: ${move.priority.toString()} |  Z-Effect: ${ move.hasOwnProperty("zMovePower") ? move.zMovePower.toString() : `+${Object.values(move.zMoveBoost).join("")} ${Object.keys(move.zMoveBoost).join("")}`} |  Target: ${move.target}`)
    }
    generateWeakEmbed(weakChart, full) {
        if (full) {
            return new RichEmbed()
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
            .setColor(0x00AE86)
            .setTimestamp();
        } else {
            return new RichEmbed()
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
            .setColor(0x00AE86)
            .setTimestamp();
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
        else throw new ReferenceError(`${name} is not a pokemon!`, 'dataparser.js', 102);
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