'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js")

module.exports = class ModchatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'modchat',
            group: 'mod',
            memberName: 'modchat',
            description: 'Set modchat.',
            examples: ['modchat +', 'modchat ~', 'modchat off'],
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            args: [
                {
                    key: 'rank',
                    prompt: 'What rank can chat?',
                    type: 'string',
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

    run(msg, { rank }) {
        let client = msg.client;
        let rankmanager = client.rankmanager;

        if (rank == "off") {
            msg.channel.overwritePermissions(msg.guild.id, {
                SEND_MESSAGES: null
              })
              .then(msg.say("Modchat is now off, everyone can speak!"));
            return;
        }

        for (let i=0; i<top; i++) {
            let role = rankmanager.getRank(hierarchy[i], msg.guild).id;
            msg.channel.overwritePermissions(role, {
                SEND_MESSAGES: null
              })
            
        }

        msg.channel.overwritePermissions(msg.guild.id, {
            SEND_MESSAGES: false
          });


        let hierarchyPosition = hierarchy.indexOf(symbols[rank]);

        if (hierarchyPosition < top)
        for (let i=hierarchyPosition; i<top; i++) {
            msg.channel.overwritePermissions(rankmanager.getRank(hierarchy[i], msg.guild).id, {
                SEND_MESSAGES: true
              })
        }
        for (let i=0; i<top; i++) {
            
        }
        msg.say(`Modchat is now active, only ${rank} or above can speak!`);
    }
};
