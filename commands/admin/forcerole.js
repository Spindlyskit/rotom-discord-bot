'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class ForceroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'forcerole',
            group: 'admin',
            memberName: 'forcerole',
            description: 'forcerole a user.\nRequires ~',
            examples: ['forcerole Spindlyskit Administrator'],
            aliases: ['globalforcerole'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be forceroled?',
                    type: 'member'
                },
                {
                    key: 'role',
                    type: 'role',
                    prompt: 'What role should <member> be forceroled to?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { member, role }) {
        let client = msg.client;
        
        member.addRole(role, `${msg.author.tag} used forcerole command in ${msg.channel.name}`)
        .then(role => msg.say(`Added ${rank} to ${member.user.tag}`))
        .catch(console.error);
    }
};
