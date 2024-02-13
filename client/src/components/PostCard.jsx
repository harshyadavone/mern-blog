import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative flex-shrink-0 w-80 bg-white shadow-lg dark:bg-gray-800 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl ">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-48 transition-opacity duration-300 hover:opacity-90"
        />
      </Link>
      <div className="p-4">
        <header className="mb-4">
          <time dateTime={post.date} className="block text-xs text-gray-500 dark:text-gray-400 transition-opacity duration-300 hover:opacity-75">
            {formattedDate}
          </time>
          <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            <Link to={`/post/${post.slug}`} className="transition-opacity duration-300 hover:opacity-75">
              {post.title}
            </Link>
          </h2>
        </header>
        <section>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2 transition-opacity duration-300 hover:opacity-75">
            {post.excerpt}
          </p>
        </section>
        <footer className="mt-4 flex justify-between items-center">
          <Link
            to={`/post/${post.slug}`}
            className="inline-block px-4 py-2 text-sm font-medium text-blue-500 border-b-2 border-transparent hover:border-blue-500 transition-colors duration-300"
          >
            Read More
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PostCard;
