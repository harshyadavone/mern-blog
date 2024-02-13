import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { useSelector } from 'react-redux';
import {Textarea} from 'flowbite-react' 

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getUser();
  }, [comment]);

  // const handleEdit = () => {
  //   setIsEditing(true);
  // };

  // const handleSaveEdit = () => {
  //   // Logic to save edited content
  //   setIsEditing(false);
  // };

  // const handleCancelEdit = () => {
  //   setIsEditing(false);
  //   // Reset edited content if needed
  //   setEditedContent(comment.content);
  // };


  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        })  
      });
      if(res.ok){
        onEdit(comment, editedContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        {user && user.profilePicture ? (
          <img className='w-10 h-10 rounded-full object-cover bg-gray-200' src={user.profilePicture} alt={user.username} />
        ) : (
          <div className='w-10 h-10 rounded-full bg-gray-200'></div>
        )}
      </div>
      <div className='flex-1'>
        <div className="flex items-center mb-1">
          <span className="inline-flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-gray-100">
            <span>
              {user ? `@${user.username}` : `Anonymous User`}
            </span>
          </span>

          <div className="ml-2">
            {comment && (
              <span className="text-gray-500 text-xs">
                {moment(comment.createdAt).fromNow()}
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-col">
            <Textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 mb-2"
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
              }}
            />
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-blue-600 mr-2"
                onClick={()=>setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="text-gray-500 hover:text-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className='text-gray-800 dark:text-gray-300 pb-2 overflow-hidden line-clamp-3 leading-normal'>
            {comment.content}
          </p>
        )}

        <div className="flex items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type='button'
            className="text-gray-500 hover:text-blue-600"
            onClick={() => onLike(comment._id)}
          >
            {comment.likes.includes(currentUser?._id) ? (
              <FcLike className='' />
            ) : <FcLikePlaceholder className='' />}
          </button>
          <p className='text-gray-500'>
            {comment.numberOfLikes === 0 ? "0 likes" : `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? "like" : "likes"}`}
          </p>
          {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
            <>
            <button
              type='button'
              className="text-gray-400 hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >Edit</button>
            <button
              type='button'
              className="text-gray-400 hover:text-red-600"
              onClick={() => onDelete(comment._id)}
            >Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
