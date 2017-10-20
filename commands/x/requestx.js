const commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path =  require('path');

module.exports = class RequestXCommand extends commando.Command {
	constructor(client) {
		super(client, {
			aliases: ['rx'],
			name: 'requestx',
			group: 'x',
			memberName: 'requestx',
			description: 'Request an x reaction be placed on a message using it\'s ID. Your message will be deleted after using this command, however it will be logged in any xlog channel.',
			examples: ['\'requestx 339646355217842177'],
			guildOnly: true,

			args: [
				{
					key: 'id',
					label: 'ID',
					default: '1',
					prompt: 'Specify ID.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		function sendMessages(arr, content){
			for(var i = 0; i < arr.length; i++){
				try{
					msg.client.channels.get(arr[i]).send(content)
				}
				catch(err){console.log(err)}
			}
		}
		var xLimit = msg.client.provider.get(msg.guild, 'xLimit' + msg.channel.id, 7)
		var xlogChannelIDs = msg.client.provider.get(msg.guild, 'xlogChannelIDs', []);
		msg.channel.fetchMessage(args.id).then(xmsg => {
			if(xmsg != null && (!msg.client.provider.get(msg.guild, 'blacklist', {}).x || !msg.client.provider.get(msg.guild, 'blacklist', {}).x.includes(msg.author.id))){
				sendMessages(xlogChannelIDs, `Placed an ❌ on ${xmsg.author.username}[${xmsg.author.id}]'s message[${xmsg.id}] by request of ${msg.author.username}[${msg.author.id}].`)
				xLimit > 1 ? xmsg.react('\u{274c}') : xmsg.delete();
			}
			else{
				msg.author.send("Could not find message/something broke/you're blacklisted.")
			}
			msg.delete();
		}).catch(function(){
			msg.author.send("Could not find message/something broke.")
			msg.delete();
		});
	};
}