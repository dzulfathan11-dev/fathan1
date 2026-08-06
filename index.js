require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  PermissionFlagsBits, 
  EmbedBuilder 
} = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Menyimpan ID channel khusus per server (Guild ID -> Channel ID)
const activeChannels = new Map();

client.once('ready', () => {
  console.log(`Bot Finansial online sebagai ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // -------------------------------------------------------------
  // PERINTAH 1: !setchannel (Khusus Admin)
  // -------------------------------------------------------------
  if (command === 'setchannel') {
    // Cek apakah pengguna adalah Admin (Administrator / Manage Channels)
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Perintah ini hanya bisa digunakan oleh Admin!');
    }

    // Set channel aktif ke channel tempat perintah dikirim
    activeChannels.set(message.guild.id, message.channel.id);
    return message.reply(`✅ Channel bot berhasil diset ke <#${message.channel.id}>.`);
  }

  // -------------------------------------------------------------
  // VALIDASI CHANNEL TERKUNCI
  // -------------------------------------------------------------
  const allowedChannelId = activeChannels.get(message.guild.id);
  if (allowedChannelId && message.channel.id !== allowedChannelId) {
    return; // Abaikan jika perintah diketik di luar channel yang ditentukan
  }

  // -------------------------------------------------------------
  // PERINTAH 2: !saham [TICKER] (Info Pasar Saham Real-Time)
  // Contoh: !saham AAPL atau !saham BBCA.JK
  // -------------------------------------------------------------
  if (command === 'saham') {
    const symbol = args[0] ? args[0].toUpperCase() : 'AAPL';

    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.FMP_API_KEY}`
      );

      if (!response.data || response.data.length === 0) {
        return message.reply(`❌ Simbol saham \`${symbol}\` tidak ditemukan.`);
      }

      const data = response.data[0];
      const isPositive = data.change >= 0;
      const color = isPositive ? 0x00FF00 : 0xFF0000;

      const embed = new EmbedBuilder()
        .setTitle(`📊 Info Saham: ${data.name} (${data.symbol})`)
        .setColor(color)
        .addFields(
          { name: '💵 Harga Saat Ini', value: `$${data.price}`, inline: true },
          { name: '📈 Perubahan', value: `${data.change} (${data.changesPercentage.toFixed(2)}%)`, inline: true },
          { name: '🔝 Tertinggi Hari Ini', value: `$${data.dayHigh}`, inline: true },
          { name: '📉 Terendah Hari Ini', value: `$${data.dayLow}`, inline: true },
          { name: '🏛️ Bursa', value: `${data.exchange}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Data Real-Time Pasar Finansial' });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Gagal mengambil data saham. Pastikan API Key valid.');
    }
  }

  // -------------------------------------------------------------
  // PERINTAH 3: !global (Info Harga Komoditas & Pasar Global)
  // -------------------------------------------------------------
  if (command === 'global') {
    try {
      // Mengambil indeks utama global (S&P 500, NASDAQ, Emas, Minyak)
      const symbols = ['^GSPC', '^IXIC', 'GCUSD', 'CLUSD'];
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${process.env.FMP_API_KEY}`
      );

      if (!response.data) return message.reply('❌ Gagal mengambil data pasar global.');

      const embed = new EmbedBuilder()
        .setTitle('🌍 Ringkasan Pasar Global & Komoditas')
        .setColor(0x3498DB)
        .setTimestamp();

      response.data.forEach(item => {
        const changeSign = item.change >= 0 ? '+' : '';
        embed.addFields({
          name: `${item.name} (${item.symbol})`,
          value: `**$${item.price}** | Perubahan: ${changeSign}${item.changesPercentage.toFixed(2)}%`,
          inline: false
        });
      });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Terjadi kesalahan saat mengambil data global.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);MTUzNDg3ODU2MjA4MTgzMzA4MA.GaHbHr.hESRdSnCtwf0GHzHT45QZWbivFl9q1MJ3p_oeI