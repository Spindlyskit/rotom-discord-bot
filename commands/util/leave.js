'use strict'

const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            aliases: ['leavechat', 'leavegroupchat'],
            group: 'util',
            memberName: 'leave',
            description: 'Leave a group chat with <name>',
            examples: ['leave spindlyland'],
            args: [
                {
                    key: 'name',
                    prompt: 'What group chat do you want to leave?',
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
            VIEW_CHANNEL: null
            })
            .catch(console.error);

        return msg.say(`Left ${name.name}(<#${name.id}>) if possible!`)
    }
};
