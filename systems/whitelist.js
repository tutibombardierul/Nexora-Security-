const fs = require("fs");
const path = require("path");

const WHITELIST_PATH = path.join(
  __dirname,
  "../whitelist.json"
);

function loadWhitelist() {
  try {
    if (!fs.existsSync(WHITELIST_PATH)) return {};

    return JSON.parse(
      fs.readFileSync(WHITELIST_PATH, "utf8")
    );
  } catch (error) {
    console.error("[NEXORA] Failed to load whitelist:", error);
    return {};
  }
}

function saveWhitelist(data) {
  fs.writeFileSync(
    WHITELIST_PATH,
    JSON.stringify(data, null, 2)
  );
}

function getWhitelist(guildId) {
  const data = loadWhitelist();
  return data[guildId] || [];
}

function isWhitelisted(guildId, userId) {
  return getWhitelist(guildId).includes(userId);
}

function addToWhitelist(guildId, userId) {
  const data = loadWhitelist();

  if (!data[guildId]) {
    data[guildId] = [];
  }

  if (data[guildId].includes(userId)) {
    return false;
  }

  data[guildId].push(userId);
  saveWhitelist(data);

  return true;
}

function removeFromWhitelist(guildId, userId) {
  const data = loadWhitelist();

  if (!data[guildId] || !data[guildId].includes(userId)) {
    return false;
  }

  data[guildId] = data[guildId].filter(
    id => id !== userId
  );

  saveWhitelist(data);

  return true;
}

module.exports = {
  getWhitelist,
  isWhitelisted,
  addToWhitelist,
  removeFromWhitelist
};
