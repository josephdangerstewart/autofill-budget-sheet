import { Client, TextChannel } from 'discord.js';

const discordClient = new Client();

export async function sendDiscordMessage(channelId: string, message: string): Promise<void> {
	await discordClient.login(process.env.DISCORD_TOKEN);

	console.log(process.env.DISCORD_CHANNEL_ID);

	const channel = await discordClient.channels.fetch(channelId);
	if (channel.isText()) {
		await channel.send(message);
	} else {
		throw new Error(`Configuration error: Discord channel is not text channel: ${channel.type}`);
	}
}
