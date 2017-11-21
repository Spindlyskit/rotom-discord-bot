'use strict'

const { MessageEmbed } = require('discord.js');
const config = require('config.json')('./config.json');

class Giveaway {
    constructor(channel, giver, creator, data) {
        this.channel = channel;
        this.giver = giver;
        this.creator = creator;
        this.guild = channel.guild;
        this.client = channel.client;
        this.fc = data.fc;
        this.ot = data.ot;
        this.tid = data.tid;
        this.prize = data.prize;
        this.pokemon = this.client.parser.parsePokemon(data.prize);

        this.guild.giveaway = this;
    }

    end() {
        this.guild.giveaway = null;
        delete this;
    }

    prizeExists() {
        return this.pokemon != false;
    }

    embed() {
        throw new ReferenceError('Giveaway doesn\'t have an embed function!');
    }

}

class LotteryGiveaway extends Giveaway {
    constructor(channel, giver, creator, data) {
        super(channel, giver, creator, data);

        this.type = 'lottery';
        this.entrants = [];
    }

    join(member) {
        const { user } = member;
        
        if (user.id == this.giver.user.id || this.entrants.includes(member)) {
            return false;
        } else {
            this.entrants.push(member);
            return true;
        }
    }

    leave(member) {
        if (this.entrants.includes(member)) {
            this.entrants.splice(this.entrants.indexOf(member), 1);
            return true;
        } else {
            return false;
        }
    }

    draw() {
        if (this.entrants.length == 0) return false;
        else return this.entrants[Math.floor(Math.random() * this.entrants.length)];
    }

    embed() {
        return new MessageEmbed()
            .setDescription(`Prize given by ${this.giver.user.tag}\nDrawing in 2 Minutes\nJoin by typing \`!giveaway join\``)
            .setTitle('It\'s giveaway time!')
            .setAuthor(this.creator.user.username, this.creator.user.avatarURL())
            .setColor(config.embedColor)
            .setThumbnail(`http://play.pokemonshowdown.com/sprites/xyani/${this.pokemon.species.toLowerCase().replace(" ", "")}.gif`)
            .addField(this.pokemon.species,
            `**OT:** ${this.ot}\n**TID:** ${this.tid}`)
            .setFooter('Note: Please do not join if you don\'t have a 3ds, a copy of a gen VII game or are currently unable to receive the prize.');
    }
}

class QuestionGiveaway extends Giveaway {
    constructor(channel, giver, creator, data) {
        super(channel, giver, creator, data);

        this.type = 'question';
        this.question = data.question;
        this.answer = data.answer;
    }

    setQuestion(text) {
        this.question = text;
    }

    setAnswer(text) {
        this.answer = text;
    }

    isCorrect(answer) {
        return answer.toLowerCase() == this.answer;
    }

    embed() {
        return new MessageEmbed()
            .setDescription(`Prize given by ${this.giver.user.tag}\nQuestion: ${this.question}\nJoin by answering the question using \`!giveaway guess <answer>\``)
            .setTitle('It\'s giveaway time!')
            .setAuthor(this.creator.user.username, this.creator.user.avatarURL())
            .setColor(config.embedColor)
            .setThumbnail(`http://play.pokemonshowdown.com/sprites/xyani/${this.pokemon.species.toLowerCase().replace(" ", "")}.gif`)
            .addField(this.pokemon.species,
            `**OT:** ${this.ot}\n**TID:** ${this.tid}`)
            .setFooter('Note: Please do not join if you don\'t have a 3ds, a copy of a gen VII game or are currently unable to receive the prize.');
    }
}

module.exports.Giveaway = Giveaway; 
module.exports.LotteryGiveaway = LotteryGiveaway; 
module.exports.QuestionGiveaway = QuestionGiveaway; 

module.exports.getGiveaway = function(guild) {
    return guild.giveaway;
}