const { SlashCommandBuilder } = require('discord.js');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resize")
    .setDescription("resize an image")
    .setDMPermission(true)
    .addAttachmentOption(option => option
        .setName("file")
        .setDescription("the image to resize")
        .setRequired(true))
    .addStringOption(option => option
        .setName("high")
        .setDescription("the high of the desired image")
        .setRequired(true))
    .addStringOption(option => option
        .setName("wide")
        .setDescription("the wide of the desired image")
        .setRequired(true))
    .setDefaultMemberPermissions(null),

    async run(interaction) {

        const supportedFormats = ["heic", "heif", "avif", "jpeg", "jpg", "jpe", "tile", "dz", "png", "raw", "tiff", "tif", "webp", "gif", "jp2", "jpx", "j2k", "j2c", "jxl"];
        await interaction.deferReply({ ephemeral: true });

        if(!supportedFormats.includes(interaction.options.getAttachment("file").name.split(".")[1])) {
            interaction.followUp({ content: "This format is not supported", ephemeral: true });
            return;
        }

        const fileToConvert = interaction.options.getAttachment("file");

        axios({
        method: 'get',
        url: fileToConvert.url,
        responseType: 'arraybuffer'
        })
        .then(response => {
        // Convertir en WebP
        const convertedFile = sharp(Buffer.from(response.data))
            .resize(parseInt(interaction.options.getString("wide")), parseInt(interaction.options.getString("high")));

        interaction.followUp({ content: "Here is your image in " + interaction.options.getString("wide") + " by " + interaction.options.getString("wide") + " format", files: [convertedFile], ephemeral: true });
        })
        .catch(error => {
        console.log(error);
        interaction.followUp({ content: "An error occurred while resizing your image", ephemeral: true });
        });
    }
};