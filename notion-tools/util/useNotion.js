const notion = require('dotenv').config();
const { Client } = require("@notionhq/client");

exports.createNotionClient = () => {
  const client = new Client({ auth: process.env.NOTION_API_KEY });
  return client;
}