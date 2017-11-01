'use strict'

const { Command } = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;

module.exports = class DataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'init',
            group: 'admin',
            memberName: 'init',
            description: 'Initial bot setup!\nnRequires ~',
            examples: ['You\'re on your own LOL!'],
            args: [
                {
                    key: 'administratorrole',
                    prompt: 'What role should be used for Administrator (~)?',
                    type: 'role'
                },
                {
                    key: 'leaderrole',
                    prompt: 'What role should be used for Leader (&)?',
                    type: 'role'
                },{
                    key: 'roomownerrole',
                    prompt: 'What role should be used for Room owner (#)?',
                    type: 'role'
                },
                {
                    key: 'botrole',
                    prompt: 'What role should be used for Bot (*)?',
                    type: 'role'
                },
                {
                    key: 'moderatorrole',
                    prompt: 'What role should be used for Moderator (@)?',
                    type: 'role'
                },
                {
                    key: 'driverrole',
                    prompt: 'What role should be used for Driver (%)?',
                    type: 'role'
                },
                {
                    key: 'voicerole',
                    prompt: 'What role should be used for Voice (+)?',
                    type: 'role'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { administratorrole, leaderrole, roomownerrole, botrole, moderatorrole, driverrole, voicerole }) {
        msg.client.rankmanager.setRank("administrator", msg.guild, administratorrole);            
        msg.client.rankmanager.setRank("leader", msg.guild, leaderrole);        
        msg.client.rankmanager.setRank("roomowner", msg.guild, roomownerrole);        
        msg.client.rankmanager.setRank("bot", msg.guild, botrole);        
        msg.client.rankmanager.setRank("moderator", msg.guild, moderatorrole);        
        msg.client.rankmanager.setRank("driver", msg.guild, driverrole);  
        msg.client.rankmanager.setRank("voice", msg.guild, voicerole);        
        msg.say(stripIndents`Initialised as:
        administrator: ${administratorrole.name}
        leader: ${leaderrole.name}
        roomowner: ${roomownerrole.name}
        bot: ${botrole.name}
        moderator: ${moderatorrole.name}
        driver: ${driverrole.name}
        voice: ${voicerole.name}`)    
    }
};
