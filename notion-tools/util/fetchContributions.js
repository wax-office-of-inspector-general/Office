import { createNotionClient } from './useNotion.js';
const DATABASE_ID = "b13a262bd3ea480db01b3127535e496b";

export async function fetchContributions(limit = 50) {
  try {
    const response = await createNotionClient().databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "Decay Date",
          direction: "ascending",
        },
      ],
      page_size: limit,
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