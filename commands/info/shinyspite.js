'use strict'

const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('config.json')('./config.json');

module.exports = class ShinyspriteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shinysprite',
            group: 'info',
            memberName: 'shinysprite',
            description: 'Get sprite for this pokemon.',
            examples: ['data <pokemon/item/move/ability>'],
            args: [
                {
                    key: 'arg1',
                    prompt: 'What would you like the sprite for?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { arg1 }) {
        let parser = msg.client.parser;
        let pkmn = parser.parsePokemon(arg1);

        if (!pkmn) return msg.say(`${arg1} is not a pokemon!`);
        else return msg.embed(new MessageEmbed()
        .setColor(config.embedColor)
        .setImage(`http://play.pokemonshowdown.com/sprites/xyani-shiny/${pkmn.species.toLowerCase().replace(" ", "").replace('-', '')}.gif`))
    }
};
