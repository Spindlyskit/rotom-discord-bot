'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class OrderCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'order',
            aliases: ['randomorder', 'inrole'],
            group: 'util',
            memberName: 'order',
            description: 'Randomly order users with a given role!',
            examples: ['Order Admin'],
            args: [
                {
                    key: 'role',
                    prompt: 'What roll do you want to randomly order members with?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, { role }) {
        return msg.channel.send(new MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Random order for ${role.name}`)
        .setDescription(msg.client.parser.shuffle(role.members.map(e => e.user.tag)).join('\n'))
        .setTimestamp());
    }
};
