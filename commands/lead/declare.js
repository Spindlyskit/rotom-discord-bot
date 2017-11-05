'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class DeclareCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'declare',
            group: 'lead',
            memberName: 'declare',
            description: 'Anonymously announces a message.\nRequires #, &, ~',
            examples: ['declare #general "Tournament Unbans" "Aegislash\nGengar-mega\nMagikarp"'],
            args: [
                {
                    key: 'channel',
                    prompt: 'What channel should the embed be in?',
                    type: 'channel'
                },
                {
                    key: 'title',
                    prompt: 'What is your embed title?',
                    type: 'string'
                },
                {
                    key: 'description',
                    type: 'string',
                    prompt: 'What is the main text in your embed?',
                },
                {
                    key: 'color',
                    type: 'string',
                    prompt: 'What color should the embed be?',
                    default: '',
                    validate: text => {
                        return (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(text) || text == '');
                    },
                },
                {
                    key: 'image',
                    type: 'string',
                    prompt: 'Image url to use?',
                    validate: text => {
                        return(text.match(/\.(jpeg|jpg|gif|png)$/) != null || text == '');
                    },
                    default: ''
                },
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("&", msg.guild, msg.member).ret;
    }

    run(msg, { channel, title, description, color, image }) {
        msg.delete();
        msg.guild.members.fetch(msg.client.user)
        channel.sendEmbed(new MessageEmbed()
            .setDescription(description)
            .setTitle(title)
            .setAuthor(msg.client.user.username, msg.client.user.avatarURL)
            .setColor(`${color == '' ? config.embedColor : color}`)
            .setImage(`${image == '' ? image : null}`)
            .setTimestamp()
        )
    }
};
