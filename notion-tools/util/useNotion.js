import dotenv from 'dotenv';
import { Client } from "@notionhq/client";

dotenv.config();

export const createNotionClient = () => {
  const client = new Client({ auth: process.env.NOTION_API_KEY });
  return client;
};