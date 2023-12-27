const { SlashCommandBuilder } = require('discord.js');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("roundcorners")
    .setDescription("round corners of an image")
    .setDMPermission(true)
    .addAttachmentOption(option => option
        .setName("image")
        .setDescription("the image to round corners")
        .setRequired(true))
    .addNumberOption(option => option
        .setName("power")
        .setDescription("the power of the rounding in % ( default: 30 )")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(100))
    .addStringOption(option => option
        .setName("format")
        .setDescription("the format to convert to ( default: png )")
        .setRequired(false))
    .setDefaultMemberPermissions(null),

    async run(interaction) {

        const supportedFormats = ["heic", "heif", "avif", "jpeg", "jpg", "jpe", "tile", "dz", "png", "raw", "tiff", "tif", "webp", "gif", "jp2", "jpx", "j2k", "j2c", "jxl"];

        await interaction.deferReply({ ephemeral: true });

        var outputFormat = interaction.options.getString("format")
        if(!outputFormat) { outputFormat = "png"; }

        var power = interaction.options.getNumber("power")/2
        if(!power) { power = "15"; }

        if(!supportedFormats.includes(interaction.options.getAttachment("image").name.split(".")[1]) || !supportedFormats.includes(outputFormat)) {
            interaction.followUp({ content: "This format is not supported", ephemeral: true });
            return;
        }

        const imageToEdit = interaction.options.getAttachment("image");

        axios({
            method: 'get',
            url: imageToEdit.url,
            responseType: 'arraybuffer'
        })
        .then(response => {
            sharp(Buffer.from(response.data))
                .metadata()
                .then(async metadata => {
                  // Les dimensions sont disponibles dans l'objet metadata
                  const width = metadata.width;
                  const height = metadata.height;
              
                  const roundedMask = Buffer.from(
                    `<svg>
                      <rect width="${width}" height="${height}" rx="${power}%" ry="${power}%" fill="white" />
                    </svg>`
                  );

                // Appliquer le masque à l'image d'entrée
                const roundedImage = await sharp(Buffer.from(response.data))
                    .composite([{ input: roundedMask, blend: 'dest-in' }])
                    .toFormat("png")

                interaction.followUp({ content: "Here is your rounded image :", files: [roundedImage], ephemeral: true });
                })
        })
        .catch(error => {
        console.log(error);
        interaction.followUp({ content: "An error occurred while converting the file", ephemeral: true });
        });
    }
};