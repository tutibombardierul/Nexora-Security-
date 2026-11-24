
module.exports = {
  bot: {
    name: "NEXORA SECURITY",
    version: "1.0.0",
    prefix: "/"
  },

  security: {
    antiNuke: {
      enabled: true,
      action: "alert",
      logEnabled: true
    },

    antiRaid: {
      enabled: true,
      joinThreshold: 8,
      timeWindow: 10,
      action: "alert"
    },

    antiSpam: {
      enabled: true,
      messageLimit: 5,
      timeWindow: 5,
      action: "timeout"
    },

    antiLink: {
      enabled: false,
      blockInvites: true,
      blockExternalLinks: false
    },

    honeypot: {
      enabled: false,
      action: "alert"
    }
  },

  logging: {
    enabled: true,
    channelId: null
  }
};
