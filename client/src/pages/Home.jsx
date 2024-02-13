import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import CallToActionTwo from '../components/CallToActionTwo'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    const fetchPosts = async ()=>{
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts)
    }
    fetchPosts();
  }, [])
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-sm sm:text-md'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering and programming langauge</p>
        <Link to='/search' className='text-sm sm:text-md text-teal-500 font-bold hover:underline'>View All</Link>
      </div>
      <div className="f">
        <CallToActionTwo/>
      </div>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-lg mt-5'>Recent Article</h1>
        <div className="flex flex-wrap gap-5 m-5 mt-5 justify-center">
          {
            posts && 
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
        <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
          View All Posts 
        </Link>
      </div>
    </div>
  );
}