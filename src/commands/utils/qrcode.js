const { SlashCommandBuilder } = require('discord.js');
const qrcode = require('qrcode');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("Create a qrcode for a file or a url")
    .setDMPermission(true)
    .addAttachmentOption(option => option
        .setName("file")
        .setDescription("the file to create the qrcode from")
        .setRequired(false))
    .addStringOption(option => option
        .setName("url")
        .setDescription("the url to create the qrcode from")
        .setRequired(false))
    .setDefaultMemberPermissions(null),

    async run(interaction) {
        if(!interaction.options.getAttachment("file") && !interaction.options.getString("url")) {
            await interaction.reply({ content: "Please provide a file or a url", ephemeral: true })
            return
        }
        if(interaction.options.getAttachment("file")) {
            const url = interaction.options.getAttachment("file").url
            await qrcode.toFile(`qrcode.png`, url)
        }else if(interaction.options.getString("url")) {
            await qrcode.toFile(`qrcode.png`, interaction.options.getString("url"))
        }

        await interaction.reply({ content: "Here is your qrcode", files: ["qrcode.png"], ephemeral: true })
        await fs.unlinkSync(`qrcode.png`)
        return
    }
};