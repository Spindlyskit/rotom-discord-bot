'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'voice',
            memberName: 'embed',
            description: 'Embed a message.',
            examples: ['embed "Tournament Unbans" "Aegislash\nGengar-mega\nMagikarp"'],
            args: [
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
                    prompt: 'What is the main text in your embed?',
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
        return msg.client.rankmanager.hasRank("+", msg.guild, msg.member).ret;
    }

    run(msg, { title, description, color, image }) {
        msg.delete();
        msg.embed(new MessageEmbed()
            .setDescription(description)
            .setTitle(title)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setColor(`${color == '' ? config.embedColor : color}`)
            .setImage(`${image == '' ? image : null}`)
            .setTimestamp()
        )
    }
};
