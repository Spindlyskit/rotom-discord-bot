'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class forcecreateroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'forcecreaterole',
            group: 'admin',
            memberName: 'forcecreaterole',
            description: 'forcecreaterole a user.\nRequires ~',
            examples: ['forcecreaterole Spindlyskit Administrator'],
            aliases: ['globalforcecreaterole'],
            args: [
                {
                    key: 'name',
                    prompt: 'what role should be created?',
                    type: 'string'
                },
                {
                    key: 'position',
                    prompt: 'What position should the role have?',
                    type: 'integer'
                },
                {
                    key: 'color',
                    prompt: 'what hex color should the role be?',
                    type: 'string',
                    default: '',
                    validate: text => {
                        return (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(text) || text == '');
                    }
                },
                {
                    key: 'permissions',
                    prompt: 'What permissions should the role have (https://discordapi.com/permissions.html)?',
                    type: 'integer',
                    default: 0
                },
                {
                    key: 'hoist',
                    prompt: 'Should the role be displayed above online members?',
                    type: 'boolean',
                    default: false
                },
                {
                    key: 'mentionable',
                    prompt: 'Should the role be @mentionable?',
                    type: 'boolean',
                    default: false
                },
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { name, position, color, permissions, hoist, mentionable }) {
        let client = msg.client;
        let guild = msg.guild;

        guild.fetchMember(client.user)
            .then(function(clientmember){
            if (clientmember.highestRole.calculatedPosition < position) position = clientmember.highestRole.calculatedPosition;
            
            guild.createRole({
                name: name,
                position: position,
                color: `${color == '' ? null : color}`,
                permissions: permissions,
                hoist: hoist,
                mentionable: mentionable
                })
                .then(role => msg.say(`Created role ${role.name}`))
                .catch(console.error)
        })
        .catch(console.error);

        
    }
};
