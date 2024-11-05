const { createNotionClient } = require('./useNotion');
const DATABASE_ID = 'aec8e648244c4b42a19d172f9fe9f1aa';

async function fetchGuilds() {
  try {
    const response = await createNotionClient().databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "BP account",
          direction: "ascending",
        },
      ],
    });

    if (!response.results) {
      throw new Error("No results found in the Notion database.");
    }

    return response.results;
  } catch (error) {
    console.error("Error fetching Contributions:", error);
    throw error;
  }
}

exports.fetchGuilds = fetchGuilds;