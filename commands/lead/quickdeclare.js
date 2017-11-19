'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class QuickdeclareCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quickdeclare',
            group: 'lead',
            memberName: 'quickdeclare',
            description: 'Anonymously announces a message.\nRequires #, &, ~',
            examples: ['quickdeclare #general "Tournament Unbans" "Aegislash\nGengar-mega\nMagikarp"'],
            args: [
                {
                    key: 'channel',
                    prompt: 'What channel should the embed be in?',
                    type: 'channel'
                },
                {
                    key: 'description',
                    type: 'string',
                    prompt: 'What is the main text in your embed?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("&", msg.guild, msg.member).ret;
    }

    run(msg, { channel, description }) {
        msg.delete();
        msg.guild.members.fetch(msg.client.user)
        channel.send('', new MessageEmbed()
            .setDescription(description)
            .setAuthor(msg.client.user.username, msg.client.user.avatarURL())
            .setColor(config.embedColor)
            .setTimestamp()
        )
    }
};
