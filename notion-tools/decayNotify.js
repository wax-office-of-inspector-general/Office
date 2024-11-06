import { fetchContributions } from './util/fetchContributions.js';
import { fetchGuilds } from './util/fetchGuilds.js';
import { Octokit } from "@octokit/rest";

const run = async () => {
  try {
    const contributions = await fetchContributions();
    const guilds = await fetchGuilds();

    const products = checkDecays(contributions);

    const issues = groupIssues(products, guilds);

    const issueContent = createIssueContent(issues);

    createIssue(issueContent);
  } catch (error) {
    console.error("Error fetching contributions:", error);
  }
};

const checkDecays = (contributions) => {
  const today = new Date();
  const nextWeek = new Date().setDate(today.getDate() + 14);

  return contributions.filter(contribution => {
    return new Date(contribution.properties["Decay Date"].date.start) < nextWeek;
  });
};

const groupIssues = (products, guilds) => {
  const issues = products.map((product) => {
    if (!product.properties.Guild.relation.length) return false;

    return {
      id: product.id,
      title: product.properties.Name.title[0].text.content,
      url: product.url,
      decay: product.properties["Decay Date"].date.start,
      guild: guilds.find(guild => guild.id === product.properties.Guild.relation[0].id).properties["BP account"].rich_text[0].text.content,
      guildURL: guilds.find(guild => guild.id === product.properties.Guild.relation[0].id).public_url,
    };
  });

  const groupByGuild = issues.reduce((acc, issue) => {
    if (!issue) return acc;

    if (!acc[issue.guild]) {
      acc[issue.guild] = [];
    }

    acc[issue.guild].push(issue);

    return acc;
  }, {});

  return groupByGuild;
};

const createIssueContent = (issues) => {
  const markdown = Object.keys(issues).map(guild => {
    const guildURL = issues[guild][0].guildURL; // Guild URL from the issue object
    return `### [${guild}](${guildURL})\n\n${issues[guild].map(issue => {
      return `**[${issue.title}](${issue.url})** - ${issue.decay}\n\n`;
    }).join('')}`;
  });

  return {
    title: "Decay Notifications for Guilds - " + new Date().toISOString(),
    content: markdown.join('\n\n'),
  };
};

const createIssue = (issueContent) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  octokit.issues.create({
    owner: "wax-office-of-inspector-general",
    repo: "office",
    title: issueContent.title,
    body: issueContent.content,
  });
};

run();