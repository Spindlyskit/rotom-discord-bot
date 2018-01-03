'use strict'

function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max+1 - min))
}

const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('config.json')('./config.json');

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'info',
            memberName: 'roll',
            description: 'Roll a die.',
            examples: ['roll 12', 'roll 1d12', 'roll 6d20'],
            args: [
                {
                    key: 'roll',
                    prompt: 'What die/dice would you like to roll?',
                    type: 'string',
                    validate: text => text.match(/([1-9]+d[1-9]+)|([1-9]+)|([1-9]+\-[1-9]+)/)
                }
            ]
        });
    }

    run(msg, { roll }) {
        if (roll.indexOf('d') >= 0) {
            var splits = roll.split('d');

            var count = splits[0];
            var die   = splits[1];
            var rolls = [];
            var total = 0;

            if (die > 100 || count > 100) {
                return msg.say('Cannot roll!\nNumbers too big!');
            }

            for (var i=0; i<parseInt(count); i++) {
                var t = generateRandomInteger(1, parseInt(die));
                rolls.push(t);
                total+=t;
            }

            return msg.say(`🎲 Rolled ${count}d${die} 🎲\n🎲 You got ${total} (${rolls.join('+')}) 🎲`);
        } else if (roll.indexOf('-') >= 0) {
            var splits = roll.split('-');

            var min = parseInt(splits[0]);
            var max   = parseInt(splits[1]);

            if ((max - min) > 1000) {
                return msg.say('Cannot roll!\nNumbers too big!');
            }

            if (min > max) {
                return msg.say(`${min} is greater than ${max}!`);
            }

            return msg.say(`🎲 Created number between ${min} and ${max} 🎲\n🎲 You got ${generateRandomInteger(min, max)}! 🎲`);
        } else {
            if (parseInt(roll) > 500) {
                return msg.say('Cannot roll!\nNumbers too big!');
            }

            var t = generateRandomInteger(1, parseInt(roll));
            return msg.say(`🎲 Rolled 1d${roll} 🎲\n🎲 You got ${t} 🎲`);
        }
    }
};
