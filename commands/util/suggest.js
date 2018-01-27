'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class SuggestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'suggest',
            aliases: ['addsuggestion', 'suggestion'],
            group: 'util',
            memberName: 'suggest',
            description: 'Suggest a new feature for the bot!',
            examples: ['suggest "Add a suggest command." "It would be nice to have an easy way of suggesting bot features!"'],
            args: [
                {
                    key: 'title',
                    prompt: 'What is the title of your suggestion?',
                    type: 'string'
                },
                {
                    key: 'description',
                    prompt: 'What is the description of your suggestion?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { title, description }) {
        if (!config.hasOwnProperty('suggestions'))
            return msg.say(`Sorry ${msg.author}, suggestions aren't configured correctly on this host of the bot. Please contact ${msg.client.owners.map(e => e.tag).join(' or ')}`);
        else if (!(config.suggestions.hasOwnProperty('guild') && config.suggestions.hasOwnProperty('channel')))  
            return msg.say(`Sorry ${msg.author}, suggestions aren't configured correctly on this host of the bot. Please contact ${msg.client.owners.map(e => e.tag).join(' or ')}`);
        
        let settings = msg.client.settings;
        
        let fbid = settings.get('feedbackid', 1);
        settings.set('feedbackid', fbid + 1);

        msg.client.guilds.find('id', config.suggestions.guild)
        .channels.find('id', config.updates.channel).send(new MessageEmbed()
        .setColor(config.embedColor)
        .addField('Title', title)
        .addField('Description', description)
        .setAuthor(`Feedback #${fbid}`, msg.client.user.avatarURL())
        .setFooter(`Posted by ${msg.author.tag}`, msg.author.avatarURL())
        .setTimestamp());

        return msg.say(`Added suggestion with title \`\`\`${title}\`\`\` and description \`\`\`${description}\`\`\``);
    }
};
