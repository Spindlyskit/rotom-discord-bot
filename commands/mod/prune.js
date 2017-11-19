'use strict'

const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            group: 'mod',
            memberName: 'prune',
            description: 'Delete x messages.\nRequires @, &, ~',
            aliases: ['purge', 'clean', 'p'],
            examples: ['prune 10'],
            args: [
                {
                    key: 'count',
                    prompt: 'How many messages should be deleted?',
                    type: 'integer'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("@", msg.guild, msg.member).ret;
    }

    run(msg, { count }) {
        msg.channel.bulkDelete(count + 1);
    }
};
