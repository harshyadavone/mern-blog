import { errorHandler } from "../utils/error.js";
import Post from '../models/post.model.js';


export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post ({
        ...req.body, slug, userId : req.user.id
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}


export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const featuredPosts = await Post.find({ featured: true })
    .sort({ updatedAt: sortDirection })
    .limit(limit);


    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
      featuredPosts,
    });
  } catch (error) {
    next(error);
  }
};



export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(405, 'You are not allowed to delete this post'));
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post has been deleted' });
    } catch (error) {
        return next(error);
    }
};


export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update the post'));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        }
      },
      { new: true } // To return the updated document
    );

    // Check if the post was found and updated
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the updated post in the response
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};


export const setFeaturedPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const isFeatured = req.body.featured; // Assuming the request body contains a 'featured' property

    // Update the 'featured' property of the post in the database
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { featured: isFeatured },
      { new: true }
    );

    // Check if the post was found and updated
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the updated post in the response
    res.status(200).json(updatedPost);
  } catch (error) {
    // Handle errors
    next(error);
  }
};