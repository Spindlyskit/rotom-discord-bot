'use strict'

const { Command } = require('discord.js-commando');

module.exports = class RoombanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roomban',
            group: 'mod',
            memberName: 'roomban',
            description: 'Remove a user from the channel this command is used in.',
            examples: ['roomban @Spindlyskit#6874', 'roomban 267732237045202945'],
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            aliases: ['roomblacklist'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be unable to see this channel?',
                    type: 'member'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("@", msg.guild, msg.member).ret;
    }

    run(msg, { member }) {
        msg.channel.overwritePermissions(member, {
            READ_MESSAGES: false
        })
            .then(msg.say(`Removed ${member.user.tag} from this channel!`))
            .catch(console.error);
    }
};
