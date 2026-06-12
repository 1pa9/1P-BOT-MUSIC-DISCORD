module.exports = {
  name: 'queue',
  async execute(message, args, P1) {
    const serverQueue = P1.queue.get(message.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) {
      return message.reply('📭 Antrian kosong!');
    }

    const list = serverQueue.songs
      .map((song, i) => `${i === 0 ? '▶️' : `${i}.`} ${song.title}`)
      .join('\n');

    message.reply(`🎶 **Antrian Musik:**\n${list}`);
  }
};