import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table } from 'flowbite-react'
import {Link } from 'react-router-dom'

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?limit=15');
                const data = await res.json();

                if (res.ok) {
                    setUsers(data.userWithourPassword);
                    setLastMonthUsers(data.lastMonthUsers);
                    setTotalUsers(data.totalUsers);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setLastMonthPosts(data.lastMonthPosts);
                    setTotalPosts(data.totalPosts);
                    setFeaturedPosts(data.featuredPosts);
                }
            } catch (error) {
                console.log(error.message)
            }

        }
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setLastMonthComments(data.lastMonthComments);
                    setTotalComments(data.totalComments);
                }
            } catch (error) {
                console.log(error.message)
            }

        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser])

    return (
        <div className='p-3 md:mx-auto'>
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 mx-auto justify-center max-w-screen-lg">
    {/* Recent Users */}
    <div className="flex flex-col p-4 shadow-md rounded-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
            <h1 className='text-lg font-semibold'>Recent Users</h1>
            <Button>
                <Link to={'/dashboard?tab=users'}>
                    See All
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {users && users.map((user)=>(
                <div key={user._id} className="flex items-center bg-white dark:bg-gray-900 rounded-md p-2">
                    <img 
                        src={user.profilePicture}
                        alt='user'
                        className='h-10 w-10 rounded-full object-cover bg-gray-500' 
                    />
                    <span className="text-sm font-medium ml-2">{user.username}</span>
                </div>
            ))}
        </div>
    </div>

    {/* Recent Comments */}
    <div className="flex flex-col p-4 shadow-md rounded-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
            <h1 className='text-lg font-semibold'>Recent Comments</h1>
            <Button>
                <Link to={'/dashboard?tab=comments'}>
                    See All
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {comments && comments.map((comment)=>(
                <div key={comment._id} className="bg-white dark:bg-gray-900 rounded-md p-4">
                    <p className='text-sm text-gray-700 dark:text-gray-300 line-clamp-2'>{comment.content}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Likes: {comment.numberOfLikes}</span>
                </div>
            ))}
        </div>
    </div>

{/* Recent Posts */}
<div className="p-4 shadow-md rounded-md dark:bg-gray-800 w-full">
    <div className="flex justify-between items-center mb-4">
        <h1 className='text-lg font-semibold'>Recent Posts</h1>
        <Button>
            <Link to={'/dashboard?tab=posts'}>
                See All
            </Link>
        </Button>
    </div>
    <div className="grid grid-cols-2 gap-4">
        {posts && posts.map((post)=>(
            <div key={post._id} className="bg-white dark:bg-gray-900 rounded-md p-4 flex flex-col">
                <img 
                    src={post.image}
                    alt='user'
                    className='h-36 w-full rounded-md object-cover bg-gray-500 mb-2' 
                />
                <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">{post.title}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{post.category}</span>
            </div>
        ))}
    </div>
</div>
<div className="p-4 shadow-md rounded-md dark:bg-gray-800 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-lg font-semibold'>Featured Posts</h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {featuredPosts.map((post) => (
                        <div key={post._id} className="bg-white dark:bg-gray-900 rounded-md p-4 flex flex-col">
                            <img
                                src={post.image}
                                alt='user'
                                className='h-36 w-full rounded-md object-cover bg-gray-500 mb-2'
                            />
                            <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">{post.title}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.category}</span>
                        </div>
                    ))}
                </div>
            </div>

</div>
</div>
    )
}
