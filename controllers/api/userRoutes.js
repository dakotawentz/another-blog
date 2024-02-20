const router = require("express").Router();
const { User } = require("../../models");

// Posts new user data to database
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ error: "Failed to create user. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ error: "Incorrect email or password. Please try again." });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ error: "Incorrect email or password. Please try again." });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(400).json({ error: "Failed to log in. Please try again." });
  }
});

// When user logs out the session is ended
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).json({ message: "Logged out successfully." });
    });
  } else {
    res.status(404).json({ error: "No user to log out." });
  }
});

module.exports = router;
