const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const { OpenAI } = require('openai');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Ask a question to chatGPT")
    .setDMPermission(true)
    .setDefaultMemberPermissions(null)
    .addStringOption(option => option
        .setName("question")
        .setDescription("the question")
        .setRequired(true)),

    async run(interaction) {
        await interaction.deferReply();
    
        const openai = new OpenAI({
            //apiKey: process.env.API_KEY,
            apiKey: "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",
            basePath: "https://api.pawan.krd/v1",
        });
    
        try {
            const message = interaction.options.getString("question");
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                temperature: 0,
                max_tokens: 1000,
            });
    
            const generatedJson = response.data.choices[0].message.content;
            console.log(generatedJson);
            await interaction.followUp(generatedJson);
        } catch (err) {
            console.error(err);
            await interaction.followUp("An error occurred while generating the response.");
        }
    }
};