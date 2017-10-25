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
const statuses = require("../data/statuses.js");
const typechart = require("../data/typechart.js");

class EmbedGenerator {
    constructor(client) {
        this.client = client;
    }

    generateAbilityEmbed(ability) {
        return new RichEmbed()
        .setDescription(`${ability.desc}`)
        .setAuthor(ability.name)
        .setColor(0x00AE86)
        .setTimestamp();
    }
    generatePokemonEmbed(pokemon) {
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
        .addField(`Misc`, stripIndents`**Height (M):** ${pokemon.heightm}
        **Weight (KG):** ${pokemon.weightkg}
        **Color:** ${pokemon.color}`)
    }
    generateItemEmbed(item) {
        return new RichEmbed()
        .setDescription(`${item.desc}`)
        .setAuthor(item.name)
        .setColor(0x00AE86)
        .setThumbnail(`https://www.serebii.net/itemdex/sprites/pgl/${item.id}.png`)
        .setTimestamp();
    }
    generateMoveEmbed(move) {
        return new RichEmbed()
        .setAuthor(`${move.name}`)
        .setColor(0x00AE86)
        .setDescription(stripIndents`
        ${move.desc}`)
        .setTimestamp()
        .addField(`Info`, `${move.type} - ${move.category}`)
        .setFooter(`Priority: ${move.priority.toString()} |  Z-Effect: ${ move.hasOwnProperty("zMovePower") ? move.zMovePower.toString() : `+${Object.values(move.zMoveBoost).join("")} ${Object.keys(move.zMoveBoost).join("")}`} |  Target: ${move.target}`)
    }
}

class Parser {
    constructor(client) {
        this.client = client;
        this.EmbedGenerator = new EmbedGenerator(client);
    }
    getAliasOf(alias) {
        alias = alias.toLowerCase();
        if (aliases.BattleAliases.hasOwnProperty(alias)) return aliases.BattleAliases[alias];
        else return false;
    }
    parseAbility(name) {
        let m = new Matcher(Object.keys(abilities.BattleAbilities).join(" "));
        m.setThreshold(2);
        if (!abilities.BattleAbilities.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (abilities.BattleAbilities.hasOwnProperty(name)) return abilities.BattleAbilities[name];
        else return false;
    }
    parsePokemon(name) {
        let m = new Matcher(Object.keys(pokedex.BattlePokedex).join(" "));
        m.setThreshold(2);
        if (!pokedex.BattlePokedex.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (pokedex.BattlePokedex.hasOwnProperty(name)) return pokedex.BattlePokedex[name];
        else return false;
    }
    parseItem(name) {
        let m = new Matcher(Object.keys(items.BattleItems).join(" "));
        m.setThreshold(2);
        if (!items.BattleItems.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (items.BattleItems.hasOwnProperty(name)) return items.BattleItems[name];
        else return false;
    }
    parseMove(name) {
        let m = new Matcher(Object.keys(items.BattleItems).join(" "));
        m.setThreshold(2);
        if (!moves.BattleMovedex.hasOwnProperty(name) && m.get(name)) name = m.get(name);
        name = name.toLowerCase().replace(" ", "");
        if (moves.BattleMovedex.hasOwnProperty(name)) return moves.BattleMovedex[name];
        else return false;
    }

    parseThenGen(name) {
        let test = this.parseAbility(name);
        if (test) return this.EmbedGenerator.generateAbilityEmbed(test);
        else test = this.parsePokemon(name);
        if (test) return this.EmbedGenerator.generatePokemonEmbed(test);
        else test = this.parseItem(name);
        if (test) return this.EmbedGenerator.generateItemEmbed(test);
        else test = this.parseMove(name);
        if (test) return this.EmbedGenerator.generateMoveEmbed(test);
        return false;
    }
}

module.exports.Parser = Parser;