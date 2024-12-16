'use strict'
const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN, DISCORD_LOG_CHANNEL_ID } = process.env
class DiscordServie {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        // Load token and channel from environment or config
        this.channelId = DISCORD_LOG_CHANNEL_ID;

        // Login once and set up the ready event
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        this.client.on('messageCreate', async message => {
            if (message.author.bot) return
            if (message.content === 'hello') {
                message.reply('Hi! How can I help you?')
            }
        })
        this.client.login(DISCORD_TOKEN);
    }
    sendToFormatCode({ title, code, message }) {
        const codeMessage = {
            content: message,
            embeds: [
                {
                    collor: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)
    }
    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.log(`Couldn't find channel with id ${this.channelId}`);
            return
        }

        channel.send(message).catch(err => {
            console.error(err);
        })
    }
}

const discordService = new DiscordServie()
module.exports = discordService