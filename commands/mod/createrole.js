'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class CreateroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createrole',
            group: 'admin',
            memberName: 'createrole',
            description: 'create a role.\nRequires @, &, ~',
            examples: ['createrole Voice'],
            aliases: ['globalcreaterole'],
            args: [
                {
                    key: 'name',
                    prompt: 'what role should be created?',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("@", msg.guild, msg.member).ret;
    }

    run(msg, { name }) {
        let guild = msg.guild;

        guild.createRole({data:{
        name: name,
        }})
        .then(role => msg.say(`Created role ${role.name}`))
        .catch(console.error);

        
    }
};
