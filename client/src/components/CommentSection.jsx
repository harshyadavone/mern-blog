import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {Alert, Button, Modal, Textarea } from 'flowbite-react'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const navigate = useNavigate();


    const handleSubmit = async (e) => { 
        e.preventDefault();
        if (comment.length > 200) {
          return;
        }
        try {
          const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: comment,
              postId,
              userId: currentUser._id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setComment('');
            setCommentError(null);
            setComments([data, ...comments]);
          }
        } catch (error) {
            setCommentError(error.message);
        }
      };
      

      useEffect(() => {
        const getComments = async () => {
          try {
            const res = await fetch(`/api/comment/getPostComments/${postId}`);
            if(res.ok){
              const data = await res.json();
              setComments(data);
            }
          
          } catch (error) {
            console.log(error.message)
          }
        }
        getComments();
      }, [postId])


      const handleLike = async (commentId) => {
        try {
          if (!currentUser) {
            navigate('/sign-in');
            return;
          }
          
          const res = await fetch(`/api/comment/likeComment/${commentId}`, {
            method: "PUT"
          });
      
          if (res.ok) {
            const data = await res.json();
            // Update state immutably
            setComments(comments.map(comment => 
              comment._id === commentId 
                ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length } 
                : comment
            ));
          } else {
            // Handle non-200 response status
            console.error('Failed to like comment');
          }
        } catch (error) {
          console.error('Error liking comment:', error.message);
        }
      };
      
      const handleEdit = (comment, editedContent) => {
        setComments(comments.map((c) => {
          if (c._id === comment._id) {
            return { ...c, content: editedContent };
          }
          return c; 
        }))
      }

      const handleDelete = async (commentId) => {
        setShowModal(false)
       try {
        if(!currentUser){
          navigate('/sign-in');
          return;
        }
        const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
          method : "DELETE"
        });
        if(res.ok){
          const data = await res.json();
          setComments(comments.filter((comment)=> comment._id !== commentId))
        };
       } catch (error) {
        console.log(error.message)
       } 
      }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {
            currentUser ?
            (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as: </p>
                    <img className="w-5 h-5 object-cover rounded-full" src={currentUser.profilePicture} alt="profile" />
                    <Link
                    to={`/dashboard?tab=profile`}
                    className="text-blue-600 hover:underline"> 
                    <span className="font-semibold">@</span>
                    <span className="font-semibold text-blue-600">{currentUser.username}</span></Link>
                </div>
            ): 
            ( 
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be signed in to comment 
                    <Link to={'/sign-in'} className='text-blue-600 hover:underline'>Sign in </Link>
                </div>
            )}
            {
                currentUser && (
                    <form onSubmit={handleSubmit} className='border border-teal-400 p-3 rounded-md'>
                        <Textarea
                        placeholder='Write a comment'
                        rows={1}
                        maxLength='200'
                        onChange={(e)=>setComment(e.target.value)}
                        value={comment}
                        />
                        <div className="flex justify-between items-center mt-5">
                            <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                            <Button gradientDuoTone={"purpleToBlue"} type='submit'>
                                Submit
                            </Button>
                        </div>
                        {commentError && <Alert color='failure' className='mt-5'>{commentError}</Alert>}
                    </form>

                )}
                {
                  comments.length === 0 ? (
                    <p className='text-sm my-5'>No comments yet!</p>
                  ) : (
                    <>
                      <div className="text-sm my-5 flex items-center gap-4">
                      <div className="flex items-center">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Comments:</p>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2">
                      <p className="text-gray-800 dark:text-gray-200">{comments.length}</p>
                      </div>
                    </div>
                      {
                        comments.map((comment)=>(
                          <Comment key={comment._id}  comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId)=>{
                              setShowModal(true)
                              setCommentToDelete(commentId)
                          }}/> 
                        ))
                      }
                    </>
                  )
                }
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                <div className="text-center">
                <HiOutlineExclamationCircle className='h-12 w-12 text-yellow-400 dark:text-yellow-200 mb-4 mx-auto' />
                <h3 className='mb-4 text-gray-800 dark:text-gray-300 text-lg font-bold'>Attention Needed</h3>
                <p className='mb-6 text-gray-600 dark:text-gray-400'>Please confirm your action.</p>
                <div className="flex justify-center gap-4">
                <Button color='green' onClick={() => handleDelete(commentToDelete)}>Confirm</Button>
                <Button color='red' onClick={() => setShowModal(false)}>Cancel</Button>
                </div>
                </div>
              </Modal.Body>
              </Modal>

    </div>
  )
}
