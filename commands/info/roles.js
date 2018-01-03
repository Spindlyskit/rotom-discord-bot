'use strict'

const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('config.json')('./config.json');

module.exports = class RolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roles',
            group: 'info',
            memberName: 'roles',
            description: 'Get a list of all roles on the server.',
            guildOnly: true,
            examples: ['roles']
        });
    };

    run(msg) { 
        let roles = msg.guild.roles.array().sort((a, b) => {
            return 0 - (a.rawPosition - b.rawPosition);
        });

        return msg.channel.send(new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(roles.map(e => e.name))
        .setTitle('Roles on this server'));
    }
};
