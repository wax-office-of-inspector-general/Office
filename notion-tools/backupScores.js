import { fetchContributions } from './util/fetchContributions.js';
import { fetchGuilds } from './util/fetchGuilds.js';
import { Octokit } from "@octokit/rest";

const run = async () => {
  try {
    const contributions = await fetchContributions();
    const guilds = await fetchGuilds();

    const issues = formatIssues(contributions, guilds);

    const issueContent = createIssueContent(issues);

    createIssue(issueContent);
  } catch (error) {
    console.error("Error fetching contributions:", error);
  }
};

// This function filters contributions that are decaying within the next two weeks
const formatIssues = (products, guilds) => {

  const issues = products.map((product) => {
    if (!product.properties.Guild.relation.length) return false;

    return {
      id: product.id,
      title: product.properties.Name.title[0].text.content,
      url: product.url,
      score: product.properties["Score"].number,
      decayRate: product.properties["Decay Rate"].number,
      decayDate: product.properties["Decay Date"].date.start,
      guild: guilds.find(guild => guild.id === product.properties.Guild.relation[0].id).properties["BP account"].rich_text[0].text.content,
      guildURL: guilds.find(guild => guild.id === product.properties.Guild.relation[0].id).public_url,
    };
  });

  issues.sort((a, b) => {
    if (a.guild < b.guild) return -1;
    if (a.guild > b.guild) return 1;
    return 0;
  });

  return issues;
};

// This function creates the content for the GitHub issue in markdown format
const createIssueContent = (issues) => {
  let content = `## Contribution Scores snapshot at ${new Date().toISOString()}\n\n`;

  content += '| Guild | Contribution | Score | Decay Rate | Decay Date |\n';
  content += '|-------|--------------|-------|------------|------------|\n';

  const markdown = issues.map(issue => {
    const guildName = issue.guild;
    const guildURL = issue.guildURL;
    
    const issueTitle = issue.title;
    const issueURL = issue.url;
    const score = issue.score;
    const decayRate = issue.decayRate;
    const decayDate = issue.decayDate;

    content += `| ${guildName} | ${issueTitle} | ${score} | ${decayRate} | ${decayDate} |\n`;

    return content;
  });

  return {
    title: 'Score Snapshots for Guilds - ' + new Date().toISOString(),
    content: markdown.join('\n\n'),
  };
};

// This function creates the GitHub issue
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