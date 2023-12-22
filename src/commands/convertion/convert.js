const { SlashCommandBuilder } = require('discord.js');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("convert")
    .setDescription("convert a file into another format")
    .setDMPermission(true)
    .addAttachmentOption(option => option
        .setName("file")
        .setDescription("the file to convert")
        .setRequired(true))
    .addStringOption(option => option
        .setName("format")
        .setDescription("the format to convert to")
        .setRequired(true))
    .setDefaultMemberPermissions(null),

    async run(interaction) {

        interaction.deferReply({ ephemeral: true });

        const fileToConvert = interaction.options.getAttachment("file");

        axios({
        method: 'get',
        url: fileToConvert.url,
        responseType: 'arraybuffer'
        })
        .then(response => {
        // Convertir en WebP
        const convertedFile = sharp(Buffer.from(response.data))
            .toFormat(interaction.options.getString("format"));

        interaction.followUp({ content: "Here is your file in " + interaction.options.getString("format") + " format", files: [convertedFile], ephemeral: true });
        })
        .catch(error => {
        console.log(error);
        interaction.followUp({ content: "An error occurred while converting the file", ephemeral: true });
        });
    }
};