async function validate(value, guild) {
    const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
    if(matches) {
        try {
            return await guild.members.fetch(await guild.client.users.fetch(matches[1]));
        } catch(err) {
            return false;
        }
    }
    const search = value.toLowerCase();
    let members = guild.guild.members.filterArray(memberFilterInexact(search));
    if(members.length === 0) return false;
    if(members.length === 1) return members[0];
    const exactMembers = members.filter(memberFilterExact(search));
    if(exactMembers.length === 1) return exactMembers[0];
    if(exactMembers.length > 0) members = exactMembers;
    return members.length <= 15 ?
        `${disambiguation(
            members.map(mem => `${escapeMarkdown(mem.user.username)}#${mem.user.discriminator}`), 'users', null
        )}\n` :
        'Multiple users found. Please be more specific.';
}

function parse(value, guild) {
    const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
    if(matches) return guild.member(matches[1]) || null;
    const search = value.toLowerCase();
    const members = guild.members.filterArray(memberFilterInexact(search));
    if(members.length === 0) return null;
    if(members.length === 1) return members[0];
    const exactMembers = members.filter(memberFilterExact(search));
    if(exactMembers.length === 1) return members[0];
    return null;
}

function memberFilterExact(search) {
	return mem => mem.user.username.toLowerCase() === search ||
		(mem.nickname && mem.nickname.toLowerCase() === search) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
}

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search) ||
		(mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
}

function validateThenParse(search, guild) {
    if (validate(search, guild) === false) return false;
    else return parse(search, guild);
}

module.exports.validate = validate;
module.exports.parse = parse;
module.exports.memberFilterExact = memberFilterExact;
module.exports.memberFilterInexact = memberFilterInexact;
module.exports.validateThenParse = validateThenParse;