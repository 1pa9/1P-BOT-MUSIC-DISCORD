module.exports = {
  name: 'skip',
  async execute(message, args, P1) {
    const serverQueue = P1.queue.get(message.guild.id);
    if (!serverQueue?.player) return message.reply('Tidak ada lagu yang diputar!');
    serverQueue.player.stop();
    message.reply('⏭️ Lagu di-skip!');
  }
};