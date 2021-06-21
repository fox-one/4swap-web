import en from "./lang/en-US.json";
import zh from "./lang/zh-TW.json";

const localesAddtion = {
  "channel.name": process.env.CHANNEL_NAME,
};

export default {
  fallbackLocale: "en",
  messages: {
    en: { ...localesAddtion, ...en },
    zh: { ...localesAddtion, ...zh },
  },
};
