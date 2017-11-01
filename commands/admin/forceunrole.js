'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class forceunroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'forceunrole',
            group: 'admin',
            memberName: 'forceunrole',
            description: 'forceunrole a user.\nRequires ~',
            examples: ['forceunrole Spindlyskit Administrator'],
            aliases: ['globalforceunrole', 'forceremoverole'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be forceunroled?',
                    type: 'member'
                },
                {
                    key: 'role',
                    type: 'role',
                    prompt: 'What role should <member> be forceremoved from?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { member, role }) {
        let client = msg.client;
        
        if (!member.roles.has(role.id)) return msg.say(`Member doesn't have ${role.name}!`);

        member.removeRole(role, `${msg.author.tag} used forceunrole command in ${msg.channel.name}`)
        .then(msg.say(`removed ${role.name} from ${member.user.tag}`))
        .catch(console.error);
    }
};
