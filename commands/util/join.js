'use strict'

const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            aliases: ['joinchat', 'joingroupchat'],
            group: 'util',
            memberName: 'join',
            description: 'Join a group chat with <name>',
            examples: ['join spindlyland'],
            args: [
                {
                    key: 'name',
                    prompt: 'What group chat do you want to join?',
                    type: 'channel'
                },
            ]
        });
    }

    run(msg, { name }) {
        let client = msg.client;
        let provider = client.provider;
        let guild = msg.guild;

        let catID = provider.get(guild, "groupChatCategory", false);

        if (!catID) return msg.say(`Can't find a category for group channels!\n& or ~ can use \`!groupchatcategory <category>\` to set one!`);

        if (!name.parent.id == catID) return msg.say(`${name.name} is not a group chat!`);

        name.overwritePermissions(msg.author, {
            VIEW_CHANNEL: true
            })
            .catch(console.error);

        return msg.say(`Joined ${name.name}(<#${name.id}>)!`)
    }
};
