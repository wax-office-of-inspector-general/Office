import { fetchGuilds } from './util/fetchGuilds';

async function run() {
  try {
    const guilds = await fetchGuilds();

    const guildsSorted = guilds.map((res) => {
      return {
        guild: res.properties["BP account"].rich_text[0].text.content,
        score: res.properties.Total.number * 10000,
      };
    });

    console.log(`${guildsSorted.length} Guilds in total\n\n`);
  
    console.log('Review the scores below and make sure they are correct before proceeding to vote\n\n');
  
    console.log(
      JSON.stringify(guildsSorted)
    );
  } catch (error) {
    console.error("Error fetching contributions:", error);
  }
}

run();