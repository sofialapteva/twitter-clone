const express = require('express');
const router = express.Router();
const Post = require('../models/post')

//основная страница со всеми постами
router.get('/', async (req, res) => {
  let posts = await Post.find().sort({ createdAt: -1 }).populate('userId');
  res.render('index', { posts });
});

router.get('/account', async (req, res) => {
  const posts = await Post.find({ userId: req.session?.userId }).sort({ createdAt: -1 }).populate('userId');
  res.render('account', { posts });
})

router.post('/create', async (req, res) => {
  if (req.session?.userId) {
    try {
      let regExp = /(https:\/\/cdn\.filestackcontent\.com\/)(\w*)/i;
      let newPost = new Post({
        img: (req.body.img).toString().replace(regExp, '$1resize=w:200,h:100,fit:crop/$2'),
        twit: req.body.twit,
        userId: req.session.userId,
        createdAt: req.body.createdAt || new Date(),
        likes: req.body.likes || 0
      });
      await newPost.save();
      res.end()
    } catch (e) {
      res.status(500)
      res.end()
    }
  } else {
    res.redirect('/')
  }
});

router.route('/edit/:id').get(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (req.session?.userId == post.userId) {
    res.render('edit', { post })
  } else {
    res.redirect('/')
  }
}).post(async (req, res) => {
  if (req.session?.userId) {
    try {
      await Post.findOneAndUpdate({ _id: req.params.id }, {
        img: req.body.prevImg,
        twit: req.body.twit,
      });
      res.redirect('/account')
    } catch (e) {
      res.status(500)
      res.end()
    }
  } else {
    res.redirect('/')
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
})

router.route('/:id').get(async (req, res) => {
  //незарегистрированный пользователь не может ставить кряйки
  if (req.session?.userId) {
    let post = await Post.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } });
    res.json({ likes: post.likes + 1 })
  }
}).delete(async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json('/')
})

module.exports = router
