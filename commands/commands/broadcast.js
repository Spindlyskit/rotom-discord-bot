'use strict'

const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json');

module.exports = class BroadcastCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'broadcast',
            group: 'commands',
            memberName: 'broadcast',
            description: 'Send an embed to the general channel of each of the bots guilds.\nRequires $.',
            examples: ['broadcast "Support server" "We now have an official server for support for Rotom!\nJoin here: discord.gg/Uu7YNmF!'],
            args: [
                {
                    key: 'title',
                    type: 'string',
                    prompt: 'What is the title of the embed you want to send?',
                },
                {
                    key: 'body',
                    type: 'string',
                    prompt: 'What is the main body of the embed you want to send?',
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.client.isOwner(msg.author);
    }

    run(msg, { title, body }) {
        let client = msg.client;
        let guilds = client.guilds;

        for (let guild of guilds) {
            guild = guild[1];
            for (let channel of guild.channels) {
                channel = channel[1];
                let cperms = channel.permissionOverwrites.get(guild.id);

                let csut = false;

                if (channel.type == 'text') {
                    if (!cperms) csut = true;
                    else if (!cperms.denied.has('SEND_MESSAGES') && !cperms.denied.has('VIEW_CHANNEL')) csut = true;
                }
                
                if (csut && !channel.permissionsFor(client.user).has('SEND_MESSAGES')) csut = false;

                if (csut) {
                    channel.send(new MessageEmbed()
                    .setTitle(title)
                    .setDescription(body)
                    .setColor(config.embedColor)
                    .setTimestamp()
                    .setAuthor(client.user.username, client.user.avatarURL()));
                    break;
                }
            }
        }

        return msg.say('Sent embed to all servers!');
    }
};
