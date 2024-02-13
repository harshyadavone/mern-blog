import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {Button, Modal, TextInput} from 'flowbite-react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage'
import {app} from '../firebase'
import { Alert } from 'flowbite-react'
import { Progress, Typography } from "@material-tailwind/react";
import {updateSuccess, updateFailure, updateStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess} from '../redux/user/userSlice';
import {useDispatch} from 'react-redux'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from 'react-router-dom'


export default function DashProfile() {
    const {currentUser, error, loading} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if(imageFile){
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        setImageFileUploading(true);
        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(2));
            },
            (error) => {
                setImageFileUploadError(
                    "Could not upload image.(file must be less than 2mb)"
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null); 
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                    setImageFileUploading(false);
                });
            }
        )
    };

    const handleChange = (e)=>{
      setFormData({...formData, [e.target.id]: e.target.value})
    };

    const handleSubmit = async (e)=>{
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);  
      if(Object.keys(formData).length === 0){
        setUpdateUserError("No data to update");
        return;
      }
      if(imageFileUploading){
        setUpdateUserError("Please wait while image is being uploaded");
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }) 
        const data = await res.json();
        if(!res.ok){
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        } else {
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's profile updated successfully")
          
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message);
      }
    }

    const handleDeleteUser = async ()=> {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch (`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE'
        });
        const data = await res.json();

        if(!res.ok){
          dispatch(deleteUserFailure(error.data))
        } else {
          dispatch(deleteUserSuccess(data))
        }
       } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }

    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST'
        });
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);  
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    return (
      <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
          <div className="relative w-32 h-32 self-center cursor-pointer shadow-sm overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt='user'
              className='rounded-full w-full h-full object-cover transform transition-all duration-300 hover:scale-110'
            />
          </div>
          {imageFileUploadProgress && (
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between gap-4">
                <Typography color="blue-gray" variant="h6">
                  Upload Progress
                </Typography>
                <Typography color="blue-gray" variant="h6">
                  {`${imageFileUploadProgress}%`}
                </Typography>
              </div>
              <Progress value={parseFloat(imageFileUploadProgress)} color='blue' size='sm' />
            </div>
          )}
          {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
          <TextInput id='username' type='text' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />
          <TextInput id='email' type='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
          <TextInput id='password' type='password' placeholder='Password' onChange={handleChange} />
          <Button type='submit' gradientDuoTone={"purpleToBlue"} disabled={loading || imageFileUploading}>{loading ? "Loading..." : "Update"}</Button>
          {currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create a Post</Button>
            </Link>
          )}
        </form>
        <div className='text-red-500 flex justify-between mt-5 '>
          <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
          <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
        </div>
        {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
        {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
        {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteUser}>Yes, delete it</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
}