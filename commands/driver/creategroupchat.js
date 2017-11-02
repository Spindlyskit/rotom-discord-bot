'use strict'

const { Command } = require('discord.js-commando');

module.exports = class CreategroupchatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'creategroupchat',
            aliases: ['cgc'],
            group: 'driver',
            memberName: 'creategroupchat',
            description: 'Create a group chat with <name>\nRequires %, @, &, ~',
            examples: ['creategroupchat spindlyland'],
            args: [
                {
                    key: 'name',
                    prompt: 'What should the chat be called?',
                    type: 'string'
                },
                {
                    key: 'nsfw',
                    prompt: 'Should the chat be nsfw?',
                    type: 'boolean',
                    default: 'false'
                },
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("%", msg.guild, msg.member).ret;
    }

    run(msg, { name, nsfw }) {
        let client = msg.client;
        let provider = client.provider;
        let guild = msg.guild;

        let catID = provider.get(guild, "groupChatCategory", false);

        if (!catID) return msg.say(`Can't find a category for group channels!\n& or ~ can use \`!groupchatcategory <category>\` to set one!`);

        let cat = guild.channels.find("id", catID);
        guild.createChannel(name, "text", {nsfw: nsfw, parent: cat, reason: `${msg.author.tag} used creategroupchat in ${msg.channel.name}!`})
        .then(channel => {
            msg.say(`Created group chat ${name}(<#${channel.id}>)\nOther users can join this channel by using \`!join ${name}\`!`);
            channel.overwritePermissions(msg.author, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                MANAGE_MESSAGES: true,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                MENTION_EVERYONE: true,
                MANAGE_CHANNELS: true,
                MANAGE_ROLES: true,
                MANAGE_WEBHOOKS: true
              })
                .catch(console.error);

            channel.overwritePermissions(msg.guild.id, {
                VIEW_CHANNEL: false
                })
                .catch(console.error);
        });
    }
};
