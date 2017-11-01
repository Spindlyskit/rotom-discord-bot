'use strict'

const { Command } = require('discord.js-commando');
const { symbols, hierarchy, top, aliases } = require("../../data/ranks.js");

module.exports = class ForcedeleteroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'forcedeleterole',
            group: 'admin',
            memberName: 'forcedeleterole',
            description: 'Force delete a role.\nRequires ~',
            examples: ['forcedeleterole spindly'],
            aliases: ['globalforcedeleterole'],
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be deleted?',
                    type: 'role'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { member, role }) {
        let client = msg.client;
        let rolename = role.name;

        try {
            role.delete();
        } catch(e) {
            return msg.say(`Cannot delete ${rolename}`);
        }
        finally {
            return msg.say(`Deleted ${rolename}`);
        }
    }
};
