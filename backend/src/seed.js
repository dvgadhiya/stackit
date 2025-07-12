import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from 'bcryptjs';
import User from "./models/User.model.js";
import Tag from "./models/Tag.model.js";
import Question from "./models/Question.model.js";
import Answer from "./models/Answer.model.js";
import Comment from "./models/Comment.model.js";
import Mention from "./models/Mention.model.js";
import Notification from "./models/Notification.model.js";

dotenv.config();

const NUM_USERS = 10;
const NUM_TAGS = 5;
const NUM_QUESTIONS = 15;
const NUM_MENTIONS = 50;
const NUM_ANSWERS = 40;
const NUM_COMMENTS = 60;

async function seed() {
  try {

    console.log("Connecting to DB:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Clearing collections...");

    await User.deleteMany({});
    await Tag.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Comment.deleteMany({});
    await Mention.deleteMany({});
    await Notification.deleteMany({});

    // --------------------------
    // Create Users
    // --------------------------

    console.log("Creating users...");

    const users = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const passwordHash = await bcrypt.hash("password123", 10);
      const user = await User.create({
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        passwordHash,
        role: i === 0 ? "admin" : "user" // first user = admin
      });
      users.push(user);
    }

    console.log(`Created ${users.length} users.`);

    // --------------------------
    // Create Tags
    // --------------------------

    console.log("Creating tags...");

    const tags = [];

    for (let i = 0; i < NUM_TAGS; i++) {
      const tag = await Tag.create({
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        color: faker.color.rgb()
      });
      tags.push(tag);
    }

    console.log(`Created ${tags.length} tags.`);

    // --------------------------
    // Create Questions
    // --------------------------

    console.log("Creating questions...");

const questions = [];

for (let i = 0; i < NUM_QUESTIONS; i++) {
  const randomUser = faker.helpers.arrayElement(users);
  const randomTags = faker.helpers.arrayElements(tags, faker.number.int({ min: 1, max: 3 }));
  const question = await Question.create({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(2),
    tags: randomTags.map(t => t._id),
    user: randomUser._id
  });
  questions.push(question);
}

console.log(`Created ${questions.length} questions.`);

    // --------------------------
    // Create Answers
    // --------------------------

    console.log("Creating answers...");

    const answers = [];

    for (let i = 0; i < NUM_ANSWERS; i++) {
      const question = faker.helpers.arrayElement(questions);
      const user = faker.helpers.arrayElement(users);
      const answer = await Answer.create({
        question: question._id,
        author: user._id,
        content: faker.lorem.paragraph(),
        upvotes: [],
        downvotes: [],
        isPinned: false
      });
      answers.push(answer);
    }

    console.log(`Created ${answers.length} answers.`);

    // --------------------------
    // Create Comments (+ Mentions)
    // --------------------------

    console.log("Creating comments and mentions...");

    for (let i = 0; i < NUM_COMMENTS; i++) {
  const answer = faker.helpers.arrayElement(answers);
  const user = faker.helpers.arrayElement(users);

  // Randomly decide whether to include a mention
  let content = faker.lorem.sentence();
  let mentionUser = null;

  if (Math.random() < 0.4) {
    // 40% chance to mention someone
    mentionUser = faker.helpers.arrayElement(users);
    if (mentionUser._id.toString() !== user._id.toString()) {
      content += ` @${mentionUser.username}`;
    }
  }

  const comment = await Comment.create({
    answer: answer._id,
    user: user._id,
    content
  });

  if (mentionUser && mentionUser._id.toString() !== user._id.toString()) {
    await Mention.create({
      sourceId: comment._id,
      sourceType: "comment",
      mentionedUser: mentionUser._id,
      byUser: user._id
    });

    await Notification.create({
      referenceId: answer._id,
      type: "mention",
      recipientUser: mentionUser._id,
      message: `${user.username} mentioned you in a comment.`,
      link: `/answer/${answer._id}`
    });
  }
}

console.log(`Created ${NUM_COMMENTS} comments and mentions.`);


    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}


seed();
