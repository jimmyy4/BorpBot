const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class WikiCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'wiki',
            description: 'Query the Touhou Wiki',
            guildID: '163175631562080256',

            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'query',
                    description: 'The page to search',
                    required: true
                }
            ]
        });
    }

    async run(ctx) {
        const search = await axios.get('https://en.touhouwiki.net/api.php', {
            params: {
                action: 'query',
                list: 'search',
                srsearch: ctx.options.query,
                srwhat: 'nearmatch',
                format: 'json'
            }
        });

        if (!search.data.query.search[0]) {
            return ctx.send({
                content: 'that page doesn\'t seem to exist',
                ephemeral: true
            });
        }

        const extract = await axios.get('https://en.touhouwiki.net/api.php?action=query&prop=extracts&exlimit=1&explaintext=1&exintro=1&exchars=500&redirects&format=json&titles='+search.data.query.search[0].title);
        
        const page = extract.data.query.pages[Object.keys(extract.data.query.pages)[0]];

        return ctx.send({
            embeds: [
                new MessageEmbed({
                    title: page.title,
                    url: encodeURI(`https://en.touhouwiki.net/wiki/${page.title}`),
                    description: page.extract.slice(0, -3),
                    footer: {
                        iconURL: `https://en.touhouwiki.net/favicon.ico`,
                        text: `Touhou Wiki`
                    }
                })
            ],
            includeSource: true
        });
    }
}