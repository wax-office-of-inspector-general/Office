require("dotenv").config();
const { Client } = require("@notionhq/client");

console.log(process.env.NOTION_API_KEY);

const notion = new Client({ auth: process.env.NOTION_API_KEY });

(async () => {
  const databaseId = "aec8e648244c4b42a19d172f9fe9f1aa";
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "BP account",
        direction: "ascending",
      },
    ],
  });

  let scores = [];

  response.results.map((res) => {
    scores.push({
      guild: res.properties["BP account"].rich_text[0].text.content,
      score: res.properties.Total.number * 10000,
    });
  });

  console.log(`${scores.length} Guilds scored in total\n\n`);
  
  console.log('Review the scores below and make sure they are correct before proceeding\n\n');

  console.log(
    JSON.stringify(scores)
  );
})();
