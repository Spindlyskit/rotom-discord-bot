'use strict'

const { Command } = require('discord.js-commando');

module.exports = class CleverbotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cleverbot',
            group: 'lead',
            memberName: 'cleverbot',
            description: 'Enable/Disable clever bot in this guild\nRequires &, ~.',
            examples: ['cleverbot false', 'cleverbot true'],
            guildOnly: true,
            args: [
                {
                    key: 'value',
                    type: 'boolean',
                    prompt: 'new value for cleverbot?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank('&', msg.guild, msg.member).ret;
    }

    run(msg, { value }) {
        let client = msg.client;
        let { provider } = client;
        
        provider.set(msg.guild, 'disableClever', value);
        return msg.say(`Cleverbot is now ${value ? 'enabled' : 'disabled'} in ${msg.guild.name}`);
    }
};
