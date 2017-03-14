const commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path =  require('path');

module.exports = class AnnounceToggleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'removecommand',
			group: 'meme',
			memberName: 'removecommand',
			description: 'Removes a custom command.',
			examples: ['\'removecommand sumirekt'],

			args: [
				{
					key: 'name',
					label: 'name',
					prompt: 'The command input.',
					type: 'string'
				}
			]
		});
	}
	
	hasPermission(msg) {
		if(msg.client.isOwner(msg.author)){
			return true;
		}
		else{
			//manage messages
			return msg.member.hasPermission(8192);
		}
	}

	async run(msg, args) {
		let customCommands = this.client.provider.get(msg.guild, 'customCommands', []);
		customCommands.splice(customCommands.findIndex(function(element){return element.name === args.name}), 1)
		this.client.provider.set(msg.guild, 'customCommands', customCommands);
		return msg.reply(`\`'${args.name}\` removed.`);
	}
};
