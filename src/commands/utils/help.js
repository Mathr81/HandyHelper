const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display a list of available commands'),

    async run(interaction) {
        const { commands } = interaction.client;

        const commandNames = commands.map(command => `\`/${command.data.name}\``);
        const commandDescriptions = commands.map(command => command.data.description || 'No description available');

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Available Commands')
            .setDescription('Here is a list of available commands:')
            .setFields([
                {
                    name: 'Commands',
                    value: commandNames.join('\n'),
                    inline: true,
                }, {
                    name: 'Descriptions',
                    value: commandDescriptions.join('\n'),
                    inline: true,
                }
            ])

        await interaction.reply({ embeds: [embed] });
    },
};