'use strict'

const { Command } = require('discord.js-commando');
const webshot = require('webshot');

module.exports = class HTMLboxCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'htmlbox',
            group: 'admin',
            memberName: 'htmlbox',
            description: 'render html (may produce unexpected results).',
            examples: ['htmlbox google.com', 'htmlbox <p style="color: red;">Text</p>'],
            args: [
                {
                    key: 'html',
                    prompt: 'What html would you like to render?',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("~", msg.guild, msg.member).ret;
    }

    run(msg, { html }) {
        webshot(html, 'htmlbox.png', {
            siteType: 'html',
            screenSize: {
                width: 1920,
                height: 1080
            }
        }, function(err) {
            msg.channel.send("", {
                files: ["htmlbox.png"]
            })
        });
        
        
    }
};
