'use strict'

const { ranks, aliases, symbols, top, hierarchy } = require("../data/ranks.js")

class GuildRankManager {
    constructor (client) {
        this.client = client;
        this.provider = client.provider;
    }

    getRank(rank, guild) {
        let client = this.client
        if (symbols.hasOwnProperty(rank)) rank = symbols[rank];
        if (aliases.hasOwnProperty(rank)) rank = aliases[rank];

        if (!ranks.hasOwnProperty(rank)) {
            return {
                success: false,
                message: `*${rank}* is not a rank!`,
                code: 'norank'
            }
        }

        let val = client.provider.get(guild, rank, false);
        if (!val) {
            return {
                success: false,
                message: `*${rank}* is not set for ${guild.name}!`,
                code: 'norankset'
            }
        } else {
            return {
                success: true,
                id: val,
                code: 'success'
            }
        }
    }

    setRank(rank, guild, role) {
        let client = this.client
        if (symbols.hasOwnProperty(rank)) rank = symbols[rank];
        if (aliases.hasOwnProperty(rank)) rank = aliases[rank];

        if (!ranks.hasOwnProperty(rank)) {
            return {
                success: false,
                message: `*${rank}* is not a rank!`,
                code: 'norank'
            }
        }

        client.provider.set(guild, rank, role.id);

        return {
            success: true,
            code: 'success'
        }
    }

    hasRank(rank, guild, member) {
        if (!guild) return false;
        let client = this.client;
        if (client.settings.get("ownerOverwrite", false) && client.isOwner(member.user)) return {ret:true, message: `Owner overwrite`, code: 'owneroverwrite'};
        if (symbols.hasOwnProperty(rank)) rank = symbols[rank];
        if (aliases.hasOwnProperty(rank)) rank = aliases[rank];

        if (!ranks.hasOwnProperty(rank)) {
            return {
                success: false,
                message: `*${rank}* is not a rank!`,
                code: 'norank'
            }
        }

        let val = client.provider.get(guild, rank, false);
        if (!val && !member.hasPermission("ADMINISTRATOR")) {
            return {
                success: false,
                message: `*${rank}* is not set for ${guild.name}!`,
                code: 'norankset'
            }
        } else {
            console.log(val);
            if (member.roles.has(val) || member.hasPermission("ADMINISTRATOR")) {
                return {
                    success: true,
                    ret: true,
                    code: 'success'
                }
            } else {
                if (ranks[rank].hierarchy != top) {
                    // Check higer ranks
                    for (let i=ranks[rank].hierarchy+1; i<top+1; i++) {
                        console.log(hierarchy[i-1]);
                        val = client.provider.get(guild, hierarchy[i-1], false);
                        if (member.roles.has(val)) {
                            return {
                                success: true,
                                ret: true,
                                code: 'success'
                            }
                        }
                    }
                }
                return {
                    success: true,
                    ret: false,
                    code: 'success'
                }
            }
            
        }
    }

}

module.exports.GuildRankManager = GuildRankManager;