
const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(
  __dirname,
  "../guild-settings.json"
);

const DEFAULT_SETTINGS = {
  antiRaid: {
    enabled: true,
    joinThreshold: 8,
    timeWindow: 10
  },
  antiSpam: {
    enabled: true,
    messageThreshold: 5,
    timeWindow: 5
  },
  antiLink: {
    enabled: false,
    blockInvites: true,
    detectExternalLinks: true
  }
};

function loadSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return {};

    return JSON.parse(
      fs.readFileSync(SETTINGS_PATH, "utf8")
    );
  } catch (error) {
    console.error("[NEXORA] Failed to load settings:", error);
    return {};
  }
}

function saveSettings(settings) {
  fs.writeFileSync(
    SETTINGS_PATH,
    JSON.stringify(settings, null, 2)
  );
}

function getSettings(guildId) {
  const settings = loadSettings();

  return {
    antiRaid: {
      ...DEFAULT_SETTINGS.antiRaid,
      ...settings[guildId]?.antiRaid
    },
    antiSpam: {
      ...DEFAULT_SETTINGS.antiSpam,
      ...settings[guildId]?.antiSpam
    },
    antiLink: {
      ...DEFAULT_SETTINGS.antiLink,
      ...settings[guildId]?.antiLink
    }
  };
}

function updateSetting(guildId, moduleName, key, value) {
  const settings = loadSettings();

  if (!settings[guildId]) {
    settings[guildId] = {};
  }

  if (!DEFAULT_SETTINGS[moduleName]) {
    throw new Error("Unknown security module.");
  }

  if (!Object.hasOwn(DEFAULT_SETTINGS[moduleName], key)) {
    throw new Error("Unknown configuration setting.");
  }

  settings[guildId][moduleName] = {
    ...DEFAULT_SETTINGS[moduleName],
    ...settings[guildId][moduleName],
    [key]: value
  };

  saveSettings(settings);

  return getSettings(guildId);
}

module.exports = {
  getSettings,
  updateSetting,
  DEFAULT_SETTINGS
};
