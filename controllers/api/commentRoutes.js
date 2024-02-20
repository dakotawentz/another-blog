// Imports
const router = require("express").Router();
const { Comments, Posts, User } = require("../../models");

// READ all Comments
router.get("/", async (req, res) => {
  try {
    const commentData = await Comments.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Posts,
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(commentData);
  } catch (err) {
    console.error('Error retrieving comments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CREATE Comment
router.post("/", async (req, res) => {
  try {
    console.log("Creating a comment");
    const comment = await Comments.create({
      comment_body: req.body.comment_body,
      post_id: req.body.post_id,
      user_id: req.session.user_id || req.body.user_id,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE Comment
router.put("/:id", async (req, res) => {
  try {
    const [updatedCount] = await Comments.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedCount === 0) {
      res.status(404).json({ error: "No comment found with that id!" });
      return;
    }
    
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Comment
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await Comments.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedCount === 0) {
      res.status(404).json({ error: "No comment found with that id!" });
      return;
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Exports
module.exports = router;
