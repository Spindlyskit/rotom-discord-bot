'use strict'

const { Command } = require('discord.js-commando');
const config = require('config.json')('./config.json')
const { MessageEmbed } = require('discord.js');
const oneLine = require('common-tags').oneLine;

const giveawayUtils = require('../../utilitys/giveaway.js');
const memberUtils = require('../../utilitys/member.js');

const modes = ['question', 'lottery', 'viewanswer', 'changequestion', 'changeanswer', 'end', 'join', 'guess', 'remind', 'leave']

module.exports = class GiveawayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giveaway',
            group: 'util',
            memberName: 'giveaway',
            description: 'Command for giveaways.\nRequires different ranks based on action',
            examples: ['quickdeclare #general "Tournament Unbans" "Aegislash\nGengar-mega\nMagikarp"'],
            args: [
                {
                    key: 'mode',
                    prompt: 'What subcommand do you want to run?',
                    type: 'string',
                    validate: text => {
                        return modes.includes(text.toLowerCase());
                    }
                },
                {
                    key: 'arg1',
                    type: 'string',
                    prompt: 'Option 1',
                    default: ''
                },
                {
                    key: 'arg2',
                    type: 'string',
                    prompt: 'Option 2',
                    default: ''
                },
                {
                    key: 'arg3',
                    type: 'string',
                    prompt: 'Option 3',
                    default: ''
                },
                {
                    key: 'arg4',
                    type: 'string',
                    prompt: 'Option 4',
                    default: ''
                },
                {
                    key: 'arg5',
                    type: 'string',
                    prompt: 'Option 5',
                    default: ''
                },
                {
                    key: 'arg6',
                    type: 'string',
                    prompt: 'Option 6',
                    default: ''
                },
                {
                    key: 'arg7',
                    type: 'string',
                    prompt: 'Option 7',
                    default: ''
                }
            ]
        });
    }

    run(msg, { mode, arg1, arg2, arg3, arg4, arg5, arg6, arg7 }) {
        let { guild } = msg;
        let current = giveawayUtils.getGiveaway(guild);

        if (!current && !(mode == 'lottery' || mode == 'question')) {
            return msg.say(`No givaway in ${guild.name}!`)
        }

        let giver;

        switch (mode) {
            case 'question':
                if (current) {
                    return msg.say(`${guild.name} already has a giveaway in ${current.channel} so another can't be started!`);
                }

                if (!(arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7)) {
                    return msg.say('All required arguments are not given!');
                }

                giver = memberUtils.validateThenParse(arg1, guild);
                if (!giver) {
                    return msg.say(`${arg1} is not a valid member or too many matching members were found!`);
                }

                if (giver != msg.member && !msg.client.rankmanager.hasRank('%', msg.guild, msg.member).ret) {
                    return msg.say(`Only drivers and above can start giveaways for other users!`);
                }

                current = new giveawayUtils.QuestionGiveaway(msg.channel, giver, msg.member, {
                    ot: arg2,
                    tid: arg3,
                    fc: arg4,
                    prize: arg5,
                    question: arg6,
                    answer: arg7
                });
                return msg.say('', current.embed());
                break;
            case 'lottery':
                if (current) {
                    return msg.say(`${guild.name} already has a giveaway in ${current.channel} so another can't be started!`);
                }

                if (!(arg1 && arg2 && arg3 && arg4 && arg5)) {
                    return msg.say('All required arguments are not given!');
                }
                
                giver = memberUtils.validateThenParse(arg1, guild);
                if (!giver) {
                    return msg.say(`${arg1} is not a valid member or too many matching members were found!`);
                }

                if (giver != msg.member && !msg.client.rankmanager.hasRank('%', msg.guild, msg.member).ret) {
                    return msg.say(`Only drivers and above can start giveaways for other users!`);
                }

                current = new giveawayUtils.LotteryGiveaway(msg.channel, giver, msg.member, {
                    ot: arg2,
                    tid: arg3,
                    fc: arg4,
                    prize: arg5,
                });

                msg.delete();

                setTimeout(function() {
                    if (!current) return;
                    let winner = current.draw();
                    if (!winner) return current.channel.send(`No one joined ${current.giver.user.tag}'s giveaway so no winner could be picked!`)
                    current.channel.send(`${winner.user.tag} won the giveaway. Direct messaging winner friend code info!`);
                    winner.createDM().then(dm => {
                        dm.send(oneLine`Congratulations! You won the giveaway in ${current.guild.name}! Please DM the giver(${current.giver.user.tag})
                        to make arangements to claim your prize(${current.prize}). If the giver doesn't give the prize contact staff in ${current.guild.name}. If the server staff see
                        fit they can contact me and, if I see fit, I might blacklist a scammer. **DON'T SPAM ME PLEASE!**`);
                        dm.send(`**${current.giver.tag}'s Friend Code:** ${current.fc}`)
                        current.end()
                    });
                    

                }, 120000);

                return msg.say('', current.embed());
                break;
            case 'viewanswer':
                if (current.creator == msg.member || current.giver == msg.member || msg.client.rankmanager.hasRank('&', msg.guild, msg.member).ret) {
                    msg.author.createDM().then(dm => {dm.send(`The answer to the current givaway is \`${current.answer}\``)});
                }
                break;
            case 'changequestion':
                return msg.say('Not yet implemented!');
                break;
            case 'changeanswer':
                return msg.say('Not yet implemented!');
                break;
            case 'end':
                if (msg.client.rankmanager.hasRank('%', msg.guild, msg.member).ret || current.creator.user == msg.author) {
                    current.end
                    return msg.say('Ended giveaway!')   
                } else {
                    return msg.say('Only driver and above or giveaway host can end giveaways!')
                }
                break;
            case 'join':
                if (current.type != 'lottery') {
                    return msg.say('Only lottery giveaways can be joined!');
                } else {
                    if (current.join(msg.member)) {
                        return msg.say('You have successfully joined the giveaway!');
                    } else {
                        msg.say('Could not join the giveaway, are you already entered?');
                    }
                }

                break;
            case 'guess':
                if (!arg1) {
                    return msg.say('All required arguments are not given!');
                }

                if (!(current.creator == msg.member || current.giver == msg.member)) {
                    msg.say('You are disallowed from entering the giveaway.');
                } else {
                    if (arg1.toLowerCase() == answer.toLowerCase) {
                        let winner = msg.member;
                        current.channel.send(`${winner.user.tag} won the giveaway! The answer was ${current.answer}. Direct messaging winner friend code info!`);
                        winner.createDM().then(dm => {
                            dm.send(oneLine`Congratulations! You won the giveaway in ${current.guild.name}! Please DM the giver(${current.giver.user.tag})
                            to make arangements to claim your prize(${current.prize}). If the giver doesn't give the prize contact staff in ${current.guild.name}. If the server staff see
                            fit they can contact me and, if I see fit, I might blacklist a scammer. **DON'T SPAM ME PLEASE!**`);
                            dm.send(`**${current.giver.tag}'s Friend Code:** ${current.fc}`)
                            current.end()
                        });
                    }
                }
                break;
            case 'remind':
                msg.author.createDM().then(dm => {
                    dm.send('', current.embed());
                });
                break;
            case 'leave':
                if (current.type != 'lottery') {
                    return msg.say('Only lottery giveaways can be left!');
                } else {
                    if (current.leave(msg.member)) {
                        return msg.say('You have left joined the giveaway!');
                    } else {
                        msg.say('Could not leave the giveaway, did you join in the first place?');
                    }
                }
                break;
        }
    }
};
