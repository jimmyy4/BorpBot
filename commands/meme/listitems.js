const commando = require('discord.js-commando');
const sqlite = require('sqlite');

module.exports = class ListItemsCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'listitems',
			group: 'meme',
			memberName: 'listitems',
			description: 'List duel items.',
			examples: ['\'listitems'],
			guildOnly: true
		});
	}
	

	async run(msg, args) {
		function createStringFromTemplate(template, variables) {
			return template.replace(new RegExp("\{([^\{]+)\}", "g"), function(_unused, varName){
				return variables[varName];
			});
		}
		var types = [
			{name: "damage", template: "Increase damage dealt by {mag}%."},
			{name: "drain", template: "Heal yourself for {mag}% of all damage you deal."},
			{name: "defense", template: "Decrease damage taken by {mag}%."},
			{name: "extraturn", template: "{mag}% chance to take an extra turn."},
			{name: "healsteal", template: "Steal all healing done by the enemy (before modifiers)."},
			{name: "healsteallegendary", template: "Steal all healing done by the enemy (after modifiers)."},
			{name: "doubledamage", template: "{mag}% chance to double damage dealt."},
			{name: "halfdamage", template: "{mag}% chance to halve damage taken."},
			{name: "skipcooldown", template: "{mag}% chance to skip your fight cooldown when you lose."},
			{name: "fedoratip", template: "0.1% chance to use Fedora Tip."},
			{name: "flatdamageafter", template: "Add {mag} damage to all of your attacks (after modifiers)."},
			{name: "flatdamage", template: "Add {mag} damage to all of your attacks."}
		];
		function createDescString(item){
			if(!item){
				return "None";
			}
			else{
				if(!item.template){
					item.template = types.find(function(element){return element.name === item.type}).template;
				}
				return `${item.quality} quality: ${createStringFromTemplate(item.template, {mag: item.mag})}`;
			}
		};
		let itemssend = "```diff\n- Equipped items -\n";
		let duelstats = msg.client.provider.get(msg.guild, "duelstats" + msg.author.id, null);
		if(!duelstats){
			return msg.reply("```diff\n- You have no items or equipped items -```")
		}
		else{
			for(var i = 0; i < duelstats.equipped.length; i++){
				itemssend += `+ Slot ${i+1}: ${createDescString(duelstats.equipped[i])}\n`;
			};
			itemssend += '```\n```diff\n- Unequipped items -\n'
			for(var i = 0; i < duelstats.items.length; i++){
				itemssend += `+ Index ${i}: ${createDescString(duelstats.items[i])}\n`;
			};
			itemssend += '```'
			if(itemssend.length > 1999){
				let itemsBuffer = new Buffer(itemssend, 'utf-8');
				return msg.channel.send({files: [{attachment: itemsBuffer,name: `items.txt`}]});
			}
			else{
				return msg.reply(itemssend)
			}
		}
	}
};
