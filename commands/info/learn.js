'use strict'

const { Command } = require('discord.js-commando');


module.exports = class LearnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'learn',
            group: 'info',
            memberName: 'learn',
            description: 'Get details on this pokemon/item/move/ability/nature.',
            examples: ['learn pikachu thunder', 'learn arcanine, helping hand', 'learn "tapu lele" "moonblast"'],
            args: [
                {
                    key: 'pokemon',
                    prompt: 'What pokemon do you want to test?',
                    type: 'string'
                },
                {
                    key: 'opt',
                    prompt: 'opt',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'move',
                    prompt: 'What move do you want to test for?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    run(msg, { pokemon, opt, move }) {
        if (move == '') move = opt;
        else pokemon = pokemon + opt;
        let parser = msg.client.parser;
        let embedGen = parser.EmbedGenerator;

        msg.embed(embedGen.generateLearnEmbed(parser.learn(pokemon, move)));
    }
};
