module.exports.ranks = {
    "administrator": {name: "Administrator", symobl: "~", hierarchy: 6},
    "leader": {name: "Leader", symobl: "&", hierarchy: 5},
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
    "~": "administrator",
    "&": "leader",
    "*": "bot",
    "@": "moderator",
    "%": "driver",
    "+": "voice"
}

module.exports.hierarchy = [
    "voice",
    "driver",
    "moderator",
    "bot",
    "leader",
    "administrator",
];

module.exports.top = 6;