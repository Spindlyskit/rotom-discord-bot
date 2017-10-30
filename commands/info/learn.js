'use strict'

const { Command } = require('discord.js-commando');


module.exports = class LearnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'learn',
            group: 'info',
            memberName: 'learn',
            description: 'Get details on this pokemon/item/move/ability/nature.',
            examples: ['data <pokemon/item/move/ability>'],
            args: [
                {
                    key: 'pokemon',
                    prompt: 'What would you like to get data on?',
                    type: 'string'
                },
                {
                    key: 'move',
                    prompt: 'What would you like to get data on?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { pokemon, move }) {
        let parser = msg.client.parser;
        let embedGen = parser.EmbedGenerator;

        msg.say(parser.learn(pokemon, move));
    }
};
