const core = require('@actions/core');
const { fetchAll, shuffleArr } = require('./util.js');

fetchAll()
  .then(([guildsRes, IGsRes]) => {
    const guildsSorted = guildsRes.rows[0].scores.sort((a, b) => {
      return b.score - a.score;
    });

    let t21Guilds = guildsSorted.slice(0, 21).map(g => g.guild);
    let standbyGuilds = guildsSorted.slice(21).map(g => g.guild);
    
    const IGsWithGuilds = shuffleArr(
      IGsRes.rows.map(row => ({ ig: row.ig, guilds: []}))
    );

    shuffleArr(t21Guilds).forEach((guild, index) => {
      IGsWithGuilds[index % IGsWithGuilds.length].guilds.push(guild);
    });

    shuffleArr(standbyGuilds).forEach((guild, index) => {
      IGsWithGuilds[index % IGsWithGuilds.length].guilds.push(guild);
    });
    
    core.info(IGsWithGuilds);
    console.table(IGsWithGuilds)
  });
