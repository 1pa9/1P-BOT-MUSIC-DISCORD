module.exports = {
  name: 'stop',
  async execute(message, args, P1) {
    const guildId = message.guild.id;
    const serverQueue = P1.queue.get(guildId);
    if (!serverQueue) return message.reply('Tidak ada lagu yang diputar!');

    serverQueue.songs = [];
    serverQueue.player?.stop();
    serverQueue.connection?.destroy();
    P1.queue.delete(guildId);
    message.reply('Musik dihentikan!');
  }
};