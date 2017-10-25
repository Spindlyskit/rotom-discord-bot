'use strict'

const { Command } = require('discord.js-commando');

module.exports = class DataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'data',
            group: 'data',
            memberName: 'data',
            description: 'Get details on this pokemon/item/move/ability/nature.',
            examples: ['data <pokemon/item/move/ability>'],
            args: [
                {
                    key: 'arg1',
                    prompt: 'What would you like to get data on?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { arg1 }) {
        let parser = msg.client.parser;
        let embedGen = parser.EmbedGenerator;

        if (parser.getAliasOf(arg1)) arg1 = parser.getAliasOf(arg1);
        let res = parser.parseThenGen(arg1);
        if (!res) return msg.say(`${arg1.toLowerCase()} is not a pokemon/item/move/ability!`)
        else return msg.embed(res);
    }
};
