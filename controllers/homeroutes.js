const router = require('express').Router();
const { Comments, Posts, User } = require('../models');
const withAuth = require('../utils/auth');

// Get all Posts posts and join with user data and comments
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Posts.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Comments,
          attributes: ['id', 'comment_body', 'post_id'],
          include: [{ model: User, attributes: ['username'] }],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Route to view a single post
router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Posts.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comments, include: [{ model: User, attributes: ['username'] }] },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('posts', {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

// Route to view user profile
router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Posts }, { model: Comments }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      user,
      logged_in: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Route to render form for creating a new post
router.get('/create', withAuth, async (req, res) => {
  try {
    res.render('create', {
      logged_in: req.session.logged_in,
      userId: req.session.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to render create form' });
  }
});

// Route to render form for editing an existing post
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Posts.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comments, include: [{ model: User, attributes: ['username'] }] },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('edit', {
      post,
      logged_in: req.session.logged_in,
      userId: req.session.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to render edit form' });
  }
});

// Login route
router.get('/login', (req, res) => {
  // Redirect to profile if already logged in
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

module.exports = router;
