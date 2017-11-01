const { Command } = require('discord.js-commando');


module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'driver',
            memberName: 'mute',
            description: 'Mutes the target user.\nRequires %, @, &, ~',
            examples: ['mute @User!', 'mute @User 10'],
            clientPermissions: ['MANAGE_ROLES'],
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to mute?',
                    type: 'member',
                },
                {
                    key: 'time',
                    prompt: 'How long should they be muted for?',
                    type: 'integer',
                    default: ''
                },
                {
                    key: 'reason',
                    prompt: 'Why are you muting them?',
                    type: 'string',
                    default: ''
                }
            ]
        });    
    }
    
    hasPermission(msg) {
        return msg.client.rankmanager.hasRank("%", msg.guild, msg.member).ret;
	}

    run(msg, args) {
        const { user, time, reason } = args;

        var mrole = msg.guild.roles.find('name', 'Muted');

        if(!mrole) {
            msg.say("`Muted` role not found! Creating...");

            // Create a new role with data
            msg.guild.createRole({
                name: 'Muted',
                mentionable: true
            })
                .then(function(role) {
                    
                    for (const item of msg.guild.channels.values()) {
                        if (item.type == "text") item.overwritePermissions(role, {
                            SEND_MESSAGES: false
                        })
                            .catch(console.error);

                        if (item.type == "voice") item.overwritePermissions(role, {
                            SPEAK: false
                        })
                            .catch(console.error);
                    }
                    msg.say(`Created role ${role}`);
                    role.setMentionable(false);
                    role.setPosition(msg.guild.me.highestRole.calculatedPosition - 1);

                    user.addRole(role, `${reason ? `${reason}` : 'Muted User!'}`);
                    msg.say(`:ok_hand: ${msg.author}, muted ${user} ${time ? `for ${time} minutes!` : ''} ${reason ? `(\`${reason}\`)` : ''}`);
                })
                .catch(console.error)
        } else {
            user.addRole(mrole, `${reason ? `${reason}` : 'Muted User!'}`);
            msg.say(`:ok_hand: ${msg.author}, muted ${user} ${time ? `for ${time} minutes!` : ''} ${reason ? `(\`${reason}\`)` : ''}`);

            var info = [
                {key: "Target",
                    val: user.user.tag},
                {key: "Time",
                    val: `${time ? `${time.toString()} minutes` : "No time specified"}`}
            ];
        }
        if (time && time != 0) {
            setTimeout(function() {
                mrole = msg.guild.roles.find('name', 'Muted');
                user.removeRole(mrole, "Mute timer expired!");
                msg.say(`${user}, you are no longer muted!`)
            }, time*60000);
        }

        
    }
}