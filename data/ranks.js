module.exports.ranks = {
    "administrator": {name: "Administrator", symobl: "~", hierarchy: 7},
    "leader": {name: "Leader", symobl: "&", hierarchy: 6},
    "roomowner": {name: "Room Owner", symobl: "#", hierarchy: 5},
    "bot": {name: "Bot", symobl: "*", hierarchy: 4},
    "moderator": {name: "Moderator", symobl: "@", hierarchy: 3},
    "driver": {name: "Driver", symobl: "%", hierarchy: 2},
    "voice": {name: "Voice", symobl: "+", hierarchy: 1},
}

module.exports.aliases = {
    "admin": "administrator",
    "mod": "moderator",
    "talkytalky": "voice"
}

module.exports.symbols = {
    "$": "botowner",
    "~": "administrator",
    "&": "leader",
    "*": "bot",
    "@": "moderator",
    "%": "driver",
    "+": "voice"
}

module.exports.top = 7;