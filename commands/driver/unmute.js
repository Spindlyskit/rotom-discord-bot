'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            group: 'driver',
            memberName: 'unmute',
            description: 'Unmute a member.',
            examples: ['unmute Spindlyskit'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to unmute?',
                    type: 'member'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("%", msg.guild, msg.member).ret;
    }

    run(msg, { member }) {
        let mrole = msg.guild.roles.find('name', 'Muted');
        if (!member.roles.has(mrole.id)) {
            return msg.say(`${member.user.tag} is not muted!`);
        } else {
            member.removeRole(mrole, `${msg.author.tag} used unmute command in ${msg.channel.name}!`);
            msg.say(`:ok_hand: ${msg.author}, unmuted ${member.user.tag}!`);
        }
    }
};
