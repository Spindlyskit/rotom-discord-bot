'use strict'

const { Command } = require('discord.js-commando');

module.exports = class RoomunbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roomunban',
            group: 'mod',
            memberName: 'roomunban',
            description: 'Unban a user from the channel this command is used in.\nRequires @, &, ~',
            examples: ['roomunban @Spindlyskit#6874', 'roomunban 267732237045202945'],
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            aliases: ['roomunblacklist', 'roomunwhitelist'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be unbanned in this channel?',
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
            READ_MESSAGES: null
        })
            .then(msg.say(`Unbanned ${member.user.tag} from this channel!`))
            .catch(console.error);
    }
};
