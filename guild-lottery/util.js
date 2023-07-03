const APIUrl = "https://wax.greymass.com/";
const { APIClient } = require("@wharfkit/antelope");
const client = new APIClient({ url: `${APIUrl}` });

const fetchGuilds = async () => {
  return client.v1.chain.get_table_rows({
    json: true,
    code: "guilds.oig",
    scope: "guilds.oig",
    table: "evaluations",
    reverse: true,
    limit: 1,
  });
};

const fetchIGs = async () => {
  return client.v1.chain.get_table_rows({
    json: true,
    code: "treasury.oig",
    scope: "treasury.oig",
    table: "oig",
    limit: 3,
  });
};

const fetchAll = async () => {
  try {
    return await Promise.all([fetchGuilds(), fetchIGs()]);
  } catch {
    console.error("Error fetching data!");
  }
};

const shuffleArr = (array) => {
  let currentIndex = array.length;

  while (--currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

module.exports = {
  fetchAll,
  shuffleArr,
}