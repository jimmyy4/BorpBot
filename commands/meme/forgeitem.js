const commando = require('discord.js-commando');
const sqlite = require('sqlite');
var duelconfig = require('../../duel.json');
for(var i = 0; i < duelconfig.itemmovesets.length; i++){
	duelconfig.types.push({
		name: duelconfig.itemmovesets[i].name,
		max: 1,
		min: 1,
		ordinary: false,
		epic: true,
		legendary: false,
		moveset: true,
		template: `Change your attacks to attacks from ${duelconfig.itemmovesets[i].name}.`
	})
}

module.exports = class ForgeItemCommand extends commando.Command {
	constructor(client) {
		super(client, {
			aliases: ['forge'],
			name: 'forgeitem',
			group: 'meme',
			memberName: 'forgeitem',
			description: 'Forge an item out of Borpdust. 300 for Ordinary, 1,500 for Epic, 6,000 for Legendary.',
			examples: ['\'forgeitem legendary'],
			guildOnly: true,
			
			args: [
				{
					key: 'qu',
					label: 'quality',
					prompt: 'Specify quality.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		function ucFirst(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		function getRandomInt(min, max){
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
		function clone(obj) {
			// Handle the 3 simple types, and null or undefined
			if (null == obj || "object" != typeof obj) return obj;
		
			// Handle Date
			if (obj instanceof Date) {
				var copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}
		
			// Handle Array
			if (obj instanceof Array) {
				var copy = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					copy[i] = clone(obj[i]);
				}
				return copy;
			}
		
			// Handle Object
			if (obj instanceof Object) {
				var copy = {};
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
				}
				return copy;
			}
		
			throw new Error("Unable to copy obj! Its type isn't supported.");
		}
		function generateNewItem(){
			let item = {};
			item.quality = ['Ordinary', 'Epic', 'Legendary'].includes(ucFirst(args.qu)) ? ucFirst(args.qu) : 'Ordinary';
			let filteredtypes = duelconfig.types.filter(function(element){return element[item.quality.toLowerCase()]})
			let type = filteredtypes[getRandomInt(0,filteredtypes.length-1)];
			item.type = type.name;
			item.moveset = type.moveset ? true : false;
			item.mag = item.quality === "Legendary" ? getRandomInt(type.max*2+1,type.max*3) : (item.quality === "Epic" ? getRandomInt(type.max+1,type.max*2) : getRandomInt(type.min,type.max));
			return item;
		}
		
		function createStringFromTemplate(template, variables) {
			return template.replace(new RegExp("\{([^\{]+)\}", "g"), function(_unused, varName){
				return variables[varName];
			});
		}
		
		function createDescString(item){
			if(!item){
				return "None";
			}
			else{
				if(item.template){
					return `${item.quality} quality: ${createStringFromTemplate(item.template, {mag: item.mag})}`;
				}
				else{
					return `${item.quality} quality: ${createStringFromTemplate(duelconfig.types.find(element => {return element.name === item.type}).template, {mag: item.mag})}`;
				}
			}
		}
		let duelstats = msg.client.provider.get(msg.guild, "duelstats", {});
		if(duelstats[msg.author.id]){
			if(!duelstats[msg.author.id].borpdust || duelstats[msg.author.id].borpdust < (ucFirst(args.qu) === "Legendary" ? 6000 : (ucFirst(args.qu) === "Epic" ? 1500 : 300))){
				return msg.reply("```diff\n- You don't have enough Borpdust -```")
			}
			else{
				duelstats[msg.author.id].borpdust -= ucFirst(args.qu) === "Legendary" ? 6000 : (ucFirst(args.qu) === "Epic" ? 1500 : 300)
				duelstats[msg.author.id].items.push(generateNewItem());
				msg.client.provider.set(msg.guild, "duelstats", duelstats);
				msg.reply(`\`\`\`diff\n! You forged: ${createDescString(duelstats[msg.author.id].items[duelstats[msg.author.id].items.length-1])} !\`\`\``);
			}
		}
		else{
			return msg.reply("```diff\n- You don't have enough Borpdust -```")
		}
	}
};
