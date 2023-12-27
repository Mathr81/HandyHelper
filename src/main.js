const { Client, IntentsBitField, Collection } = require('discord.js');
const client = new Client({intents: new IntentsBitField(3276799)});
const loadCommmands = require('./loaders/loadCommands');
const loadEvents = require('./loaders/loadEvents');
require('dotenv').config();

client.commands = new Collection();

(async () => {
    await loadCommmands(client);
    await loadEvents(client);
    
    //await client.login(process.env.TOKEN);
    await client.login("MTE4OTE3NDg2Mjk3MTkzMjY5Mg.GJvKJp.3ahUG6dFIRx2Y7SqmdmM8RkyOyBouiTTo8mmcg")
})();