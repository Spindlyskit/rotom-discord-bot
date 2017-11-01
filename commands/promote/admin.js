'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class AdminpromoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'admin',
            group: 'mod',
            memberName: 'admin',
            description: 'Promote a user to admin.\nRequires ~',
            examples: ['admin Spindlyskit'],
            aliases: ['globaladmin', 'administrator', 'globaladministrator'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member should be promoted?',
                    type: 'member'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { member }) {
        let rank = "~";
        let client = msg.client;
        let rankmanager = client.rankmanager;
        let role = rankmanager.getRank(rank, msg.guild).id;
        
        if (!rankmanager.hasRank(rank, msg.guild, msg.member).ret);

        for (let i=0; i<hierarchy.length; i++) {
            let tr = rankmanager.getRank(hierarchy[i], msg.guild).id;
            console.log(`${hierarchy[i]}: ${tr}`)
            if (member.roles.has(tr) && tr != role) {
                member.removeRole(tr, `${msg.author.tag} used admin command in ${msg.channel.name}`)
                .catch(console.error);
            }
        }
        member.addRole(role, `${msg.author.tag} used admin command in ${msg.channel.name}`)
        .then(role => msg.say(`Added ${rank} to ${member.user.tag}`))
        .catch(console.error);
    }
};
