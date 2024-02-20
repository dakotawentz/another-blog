// Imports
const router = require("express").Router();
const { Posts, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET route to retrieve all posts
router.get('/posts', async (req, res) => {
  console.log('Retrieving all posts');
  try {
    const posts = await Posts.findAll({
      include: [
        User, Comment
      ]
    });
    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new blog post
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Posts.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route to edit an existing blog post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Posts.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (postData[0] === 0) {
      res.status(404).json({ error: "No blog post found with this id!" });
      return;
    }

    res.status(200).json({ message: "Blog post updated successfully" });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an existing blog post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deletedRows = await Posts.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedRows === 0) {
      res.status(404).json({ error: "No blog post found with this id!" });
      return;
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Exports
module.exports = router;
