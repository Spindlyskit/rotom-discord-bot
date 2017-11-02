'use strict'

const { Command } = require('discord.js-commando');

module.exports = class GroupchatcategoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'groupchatcategory',
            group: 'driver',
            memberName: 'groupchatcategory',
            description: 'Create a group chat with <name>\nRequires &, ~',
            examples: ['groupchatcategory Driver Channels'],
            args: [
                {
                    key: 'category',
                    prompt: 'What category should be used for group chats?',
                    type: 'channel'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("&", msg.guild, msg.member).ret;
    }

    run(msg, { category }) {
        let client = msg.client;
        let provider = client.provider;
        
        if (category.type != "category") return msg.say(`${category.name} is not a category!`);

        provider.set(msg.guild, "groupChatCategory", category.id);

        return msg.say(`Set group chat category to ${category.name}!`);
    }
};
