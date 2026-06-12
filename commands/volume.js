module.exports = {
  name: 'volume',
  async execute(message, args, P1) {
    const serverQueue = P1.queue.get(message.guild.id);
    if (!serverQueue?.player) return message.reply('Tidak ada lagu yang diputar!');

    if (!args.length) {
      const current = Math.round((serverQueue.volume || 1) * 100);
      return message.reply(`Volume saat ini: **${current}%**`);
    }

    const vol = parseInt(args[0]);
    if (isNaN(vol) || vol < 1 || vol > 200) {
      return message.reply('Volume harus antara **1 - 200**!\nContoh: `!volume 50`');
    }

    serverQueue.volume = vol / 100;
    serverQueue.resource?.volume?.setVolume(vol / 100);
    message.reply(`Volume diubah ke **${vol}%**`);
  }
};