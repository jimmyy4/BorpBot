const { suggestions } = require('../database.js');
const moment = require('moment');

module.exports = {
	name: 'listsuggestions',
    description: 'List all of this server\'s suggestions',
    permission: ['MANAGE_GUILD'],
	async execute(msg, args) {
        const guildSuggestions = await suggestions.findAll({ where: {
            guild_id: msg.guild.id
        }});

        var message = '';
        for (const suggestion of guildSuggestions) {
            let sender = msg.guild.members.resolve(suggestion.sender_id) || (await msg.guild.members.fetch(suggestion.sender_id));
            sender = sender ? sender.user.tag : '[Missing User]';
            message += `${suggestion.anonymous ? '[Anonymous]' : sender} suggested: ${suggestion.suggestion}
Suggestion created at ${moment.utc(suggestion.createdAt).format('ddd MMM D YYYY')}, ID: ${suggestion.id}\n\n`
        }
        
        if (message.length < 1) return msg.reply('this server has no suggestions');
        if (message.length > 1999) return msg.channel.send({ files: [ {
            attachment: Buffer.from(message, 'utf-8'),
            name: 'result.txt'
        } ] });
        
        return msg.channel.send(message);
	},
};
