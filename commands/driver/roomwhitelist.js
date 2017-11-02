'use strict'

const { Command } = require('discord.js-commando');

module.exports = class RoomwhitelistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roomwhitelist',
            group: 'mod',
            memberName: 'roomwhitelist',
            description: 'Alllow a user to see the channel this command is used in.\nRequires %, @, &, ~',
            examples: ['roomwhitelist @Spindlyskit#6874', 'roomwhitelist 267732237045202945'],
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            aliases: ['roomforceunban', 'invite', 'adduser'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be able to see this channel?',
                    type: 'member'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("%", msg.guild, msg.member).ret;
    }

    run(msg, { member }) {
        msg.channel.overwritePermissions(member, {
            READ_MESSAGES: true
        })
            .then(msg.say(`${member.user.tag} can now see this channel!`))
            .catch(console.error);
    }
};
