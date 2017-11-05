'use strict'

const { Command } = require('discord.js-commando');

module.exports = class OwneroverwriteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'owneroverwrite',
            group: 'commands',
            memberName: 'owneroverwrite',
            description: 'Enable/Disable owner overwrite (global setting)\nRequires $.',
            examples: ['owneroverwrite false', 'owneroverwrite true'],
            args: [
                {
                    key: 'value',
                    type: 'boolean',
                    prompt: 'new value for owneroverwrite?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.isOwner(msg.author);
    }

    run(msg, { value }) {
        let client = msg.client;
        let { settings } = client;
        
        settings.set("ownerOverwrite", value);
        return msg.say(`Set owneroverwrite to ${value.toString()}`);
    }
};
