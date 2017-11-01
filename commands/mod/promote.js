'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class PromoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'promote',
            group: 'mod',
            memberName: 'promote',
            description: 'Promote a user.\nRequires @, &, ~',
            examples: ['promote Spindlyskit ~'],
            aliases: ['globalpromote'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be promoted?',
                    type: 'member'
                },
                {
                    key: 'rank',
                    type: 'string',
                    prompt: 'What rank should <member> be promoted to?',
                    validate: text => {
                        if (Object.keys(symbols).includes(text) || Object.keys(aliases).includes(text) || hierarchy.includes(text) || text == "off") return true;
                        return false;
                    }
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("@", msg.guild, msg.member).ret;
    }

    run(msg, { member, rank }) {
        let client = msg.client;
        let rankmanager = client.rankmanager;
        let role = rankmanager.getRank(rank, msg.guild).id;
        
        if (!rankmanager.hasRank(rank, msg.guild, msg.member).ret);

        for (let i=0; i<hierarchy.length; i++) {
            if (rankmanager.hasRank(hierarchy[i], msg.guild, msg.member).ret) {
                member.removeRole(rankmanager.getrank(hierarchy[i], msg.guild), `${msg.author.tag} used promote command in ${msg.channel.name}`)
                .catch(console.error);
            }
        }

        member.addRole(role, `${msg.author.tag} used promote command in ${msg.channel.name}`)
        .then(role => msg.say(`Added ${rank} to ${member.user.tag}`))
        .catch(console.error);
    }
};
