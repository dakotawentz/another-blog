const sequelize = require("../config/connection");
const { User, Posts, Comments } = require("../models");

const userData = require("./userData.json");
const postData = require("./postData.json");
const commentData = require("./commentData.json");


// Seeds database with user data, post data, and comment data
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const postDataItem of postData) {
    await Posts.create({
      ...postDataItem,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  const comments = await Comments.bulkCreate(commentData);

  process.exit(0);
};

// Function call to seed database
seedDatabase();