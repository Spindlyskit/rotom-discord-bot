'use strict'

const { Command } = require('discord.js-commando');

module.exports = class WeakCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weak',
            group: 'info',
            memberName: 'weak',
            description: 'Get weaknesses for this pokemon.',
            examples: ['weak <pokemon>'],
            args: [
                {
                    key: 'pokemon',
                    prompt: 'What would you like to get weakness for?',
                    type: 'string'
                },
                {
                    key: 'full',
                    type: 'boolean',
                    prompt: 'display multiplyers equal to zero?',
                    default: false
                },
            ]
        });
    }

    run(msg, { pokemon, full }) {
        let parser = msg.client.parser;
        let embedGen = parser.EmbedGenerator;

        msg.embed(embedGen.generateWeakEmbed(parser.weak(parser.parsePokemon(pokemon)), full));
    }
};
