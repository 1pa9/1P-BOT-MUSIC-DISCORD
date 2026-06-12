const fs = require('fs');
const os = require('os');

if (os.platform() !== 'win32') {
  try {
    fs.chmodSync('./yt-dlp', '755');
    console.log('✅ yt-dlp permission OK!');
  } catch (e) {
    console.error('❌ Gagal set permission:', e.message);
  }
}

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const P1 = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

P1.commands = new Collection();
P1.queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  P1.commands.set(command.name, command);
}

P1.once('Ready', (c) => {
  console.log(`Bot aktif sebagai ${c.user.tag}`);
  c.user.setPresence({
    activities: [{ name: '!play', type: 2 }],
    status: 'online',
  });
});

P1.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = P1.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, P1);
  } catch (error) {
    console.error(error);
    message.reply('❌ Terjadi error!');
  }
});

P1.login(process.env.TOKEN);