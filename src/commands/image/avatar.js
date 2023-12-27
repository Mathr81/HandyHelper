const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("download the discord avatr of a user")
    .setDMPermission(true)
    .addUserOption(option => option
        .setName("target")
        .setDescription("the user")
        .setRequired(true))
    .setDefaultMemberPermissions(null),

    async run(interaction) {

        await interaction.deferReply({ ephemeral: true });

        let target = interaction.options.getMember("target");
        let embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Avatar by ${target.user.tag}`)
            .setDescription(`Download Avatar\n[[PNG]](${target.user.displayAvatarURL({extension: 'png', size: 4096, dynamic: false})})┃[[JPG]](${target.user.displayAvatarURL({extension: 'jpg', size: 4096, dynamic: false})})┃[[GIF]](${target.user.displayAvatarURL({extension: 'gif', size: 4096, dynamic: true})})`)
            .setFooter({text: `Requested by ${interaction.user.tag}`, avatar: interaction.user.displayAvatarURL})
            .setImage(target.user.displayAvatarURL({size: 4096, dynamic: true}))
        interaction.followUp({embeds: [embed]});
    }
};