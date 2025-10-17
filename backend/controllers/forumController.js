const ForumPost = require('../models/ForumPost');

exports.getPosts = async (req, res) => {
  try {
    const { course } = req.query;
    const filter = course ? { course } : {};
    const posts = await ForumPost.find(filter)
      .populate('author', 'username')
      .populate('replies.author', 'username')
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { course, title, content } = req.body;
    const post = await ForumPost.create({ course, title, content, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: { author: req.user._id, content } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
