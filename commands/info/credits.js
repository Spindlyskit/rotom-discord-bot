'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');
const stripIndents = require('common-tags').stripIndents;

module.exports = class CreditsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'credits',
            group: 'info',
            memberName: 'credit',
            aliases: ['creator', 'dev', 'isthiszarelsbot'],
            description: 'Get bot credits.',
            examples: ['credits'],
        });
    }

    run(msg) {
        let spindly = msg.client.users.get("164352557693534209")
        msg.embed(new MessageEmbed()
            .setDescription(stripIndents`
            **Spindlyskit#6874** - Lead developer
            **Zarel#3732** - Pokemon showdown: the databases the bot parses
            **thecommondude#8240** - Debuging & Testing
            **Ziggy#2207** - Debuging & Testing`)
            .setTitle('Showdown Bot Credits!')
            .setAuthor(spindly.tag, spindly.avatarURL())
            .setColor(config.embedColor)
            .setTimestamp()
        )
    }
};
