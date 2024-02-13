import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import {useDispatch, useSelector} from 'react-redux'
import { SignInfailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import Oauth from '../components/Oauth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {error:errorMessage, loading} = useSelector(state => state.user)
  const dispatch = useDispatch() 
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };
  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!formData.email || !formData.password) return dispatch(SignInfailure('Please fill all the fields'))
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(SignInfailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(SignInfailure(error.message))
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left side */}
        <div className='flex-1'>
        <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Harsh's</span>
             Blog
        </Link>
        <p className='text-sm mt-5'> 
          This is a demo project for blogging. you can signin with your email and password 
          or login with google
        </p>
        </div>
        {/* Right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' />
              <TextInput 
              type='email' 
              placeholder='jondoe@me.com' 
              id = 'email'
              onChange={handleChange}
              
              />
            </div>
            <div>
              <Label value='Password' />
              <TextInput 
              type='password'  
              placeholder='********' 
              id = 'password'
              onChange={handleChange}
                          
              />
            </div>
            <Button type='submit' gradientDuoTone='purpleToBlue' disabled={loading}>{
              loading ? (
                <>
                <Spinner
                  size={'sm'}
                />
                <span className='pl-3'> Loading...</span>
                </>
              ) : 'Sign In'
            }</Button>
            <Oauth />
          </form>
          <div>
            <p className='text-sm mt-5'> 
              Don't have an account? <Link to="/sign-up" className='text-blue-500 ml-0.5'>Signup</Link>
            </p>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color={'failure'}>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
