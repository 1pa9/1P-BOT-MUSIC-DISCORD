const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const { execFile, spawn } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const YTDLP_PATH = path.join(__dirname, '..', isWindows ? 'yt-dlp.exe' : 'yt-dlp');
const ffmpegPath = isWindows ? require('ffmpeg-static') : 'ffmpeg';

function getSongInfo(query) {
  return new Promise((resolve, reject) => {
    const isUrl = query.startsWith('http');
    const args = isUrl
      ? ['--dump-json', '--no-playlist', query]
      : ['--dump-json', '--no-playlist', `ytsearch1:${query}`];

    execFile(YTDLP_PATH, args, { encoding: 'utf8' }, (err, stdout) => {
      if (err) return reject(err);
      try {
        const info = JSON.parse(stdout.trim());
        resolve({
          title: info.title,
          url: info.webpage_url || info.url,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = {
  name: 'play',
  async execute(message, args, P1) {
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply('Masuk ke Voice Channel dulu!');
    if (!args.length) return message.reply('Mana link/nama lagu kocak. Contoh: `!play never gonna give you up`');

    const loadingMsg = await message.channel.send('🔍 Mencari lagu...');

    try {
      const query = args.join(' ');
      const song = await getSongInfo(query);

      const guildId = message.guild.id;
      if (!P1.queue.has(guildId)) {
        P1.queue.set(guildId, {
          songs: [],
          connection: null,
          player: null,
          resource: null,
          volume: 1,
          textChannel: message.channel
        });
      }

      const serverQueue = P1.queue.get(guildId);
      serverQueue.songs.push(song);
      await loadingMsg.delete();

      if (!serverQueue.connection) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
        });
        serverQueue.connection = connection;
        playSong(P1, guildId);
      } else {
        message.channel.send(`Ditambahkan ke antrian: **${song.title}**`);
      }

    } catch (err) {
      console.error('Error:', err);
      loadingMsg.edit('Gagal mencari lagu: ' + err.message);
    }
  }
};

async function playSong(P1, guildId) {
  const serverQueue = P1.queue.get(guildId);
  if (!serverQueue || serverQueue.songs.length === 0) {
    serverQueue?.connection?.destroy();
    P1.queue.delete(guildId);
    serverQueue?.textChannel?.send('Antrian habis, bot keluar!');
    P1.user.setPresence({
      activities: [{ name: '!play untuk memutar musik', type: 2 }],
      status: 'online',
    });
    return;
  }

  const song = serverQueue.songs[0];
  console.log('Playing:', song.title);

  try {
    const ytdlp = spawn(YTDLP_PATH, [
      '-f', 'bestaudio',
      '--no-playlist',
      '-o', '-',
      '--quiet',
      song.url
    ]);

    const ffmpeg = spawn(ffmpegPath, [
      '-i', 'pipe:0',
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2',
      'pipe:1'
    ]);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    const resource = createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Raw,
      inlineVolume: true,
    });

    resource.volume?.setVolume(serverQueue.volume || 1);
    serverQueue.resource = resource;

    const player = createAudioPlayer();
    player.play(resource);
    serverQueue.connection.subscribe(player);
    serverQueue.player = player;

    serverQueue.textChannel.send(`Sekarang memutar: **${song.title}**`);

    P1.user.setPresence({
      activities: [{ name: song.title, type: 2 }],
      status: 'online',
    });

    player.on(AudioPlayerStatus.Idle, () => {
      ytdlp.kill();
      ffmpeg.kill();
      serverQueue.songs.shift();
      playSong(P1, guildId);
    });

    player.on('error', err => {
      console.error('Player error:', err);
      ytdlp.kill();
      ffmpeg.kill();
      serverQueue.textChannel.send('Error saat memutar!');
      serverQueue.songs.shift();
      playSong(P1, guildId);
    });

  } catch (err) {
    console.error('Stream error:', err);
    serverQueue.textChannel.send('Gagal stream: ' + err.message);
    serverQueue.songs.shift();
    playSong(P1, guildId);
  }
}

module.exports.playSong = playSong;