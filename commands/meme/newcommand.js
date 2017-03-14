const commando = require('discord.js-commando');
const sqlite = require('sqlite');

module.exports = class AnnounceToggleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'newcommand',
			group: 'meme',
			memberName: 'newcommand',
			description: 'Adds a custom command.',
			examples: ['\'newcommand sumirekt http://i.imgur.com/yUKLbuc.jpg'],

			args: [
				{
					key: 'name',
					label: 'name',
					prompt: 'The command input.',
					type: 'string'
				},
				{
					key: 'out',
					label: 'output',
					prompt: 'The command output.',
					type: 'string',
					infinite: true
				}
			]
		});
	}
	
	

	async run(msg, args) {
		let customCommands = this.client.provider.get(msg.guild, 'customCommands', []);
		customCommands.push({
			name: args.name,
			output: args.out.join(" ")
		});
		this.client.provider.set(msg.guild, 'customCommands', customCommands);
		return msg.reply(`\`'${args.name}\` added.`);
	}
};
