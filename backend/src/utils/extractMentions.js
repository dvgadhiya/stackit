// src/utils/extractMentions.js
export const extractMentions = (text) => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
};
