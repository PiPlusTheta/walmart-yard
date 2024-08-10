import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const LoginSignup = () => {
  const navigate = useNavigate();

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    role: '',
    email: '',
    emailVerified: false,
    phoneNumber: '',
    password: '',
    displayName: '',
    disabled: false
  });

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        role: signUpData.role,
        email: signUpData.email,
        emailVerified: false,
        phoneNumber: signUpData.phoneNumber,
        displayName: signUpData.displayName,
        disabled: false
      });

      console.log('User signed up successfully');
      alert('Sign up successful! Please log in.');
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert('Sign up failed: ' + error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, signInData.email, signInData.password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/warehouse');
        }
      } else {
        console.error('User document not found');
        alert('User data not found. Please contact support.');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" name="displayName" placeholder="Name" onChange={handleSignUpChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleSignUpChange} required />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleSignUpChange} required />
          <select name="role" onChange={handleSignUpChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
          <span>or use your email password</span>
          <input type="email" name="email" placeholder="Email" onChange={handleSignInChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleSignInChange} required />
          <a href="#">Forgot Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
        }

        body {
          background-color: #f6f5f7;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-family: 'Montserrat', sans-serif;
          height: 100vh;
          margin: -20px 0 50px;
        }

        .container {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          position: relative;
          overflow: hidden;
          width: 1000px;
          max-width: 100%;
          min-height: 480px;
          display: flex;
        }

        .form-container {
          position: relative;
          top: 0;
          width: 50%;
          height: 100%;
          padding: 30px;
        }

        .sign-up {
          background-color: #f6f5f7;
        }

        .sign-in {
          background-color: #ffffff;
        }

        form {
          background-color: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 50px;
          height: 100%;
          text-align: center;
        }

        h1 {
          font-weight: bold;
          margin: 0;
          margin-bottom: 15px;
        }

        .social-icons {
          margin: 20px 0;
        }

        .social-icons a {
          border: 1px solid #ccc;
          border-radius: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 5px;
          height: 40px;
          width: 40px;
          text-decoration: none;
          color: #333;
        }

        span {
          font-size: 12px;
          margin-bottom: 15px;
        }

        input, select {
          background-color: #eee;
          border: none;
          padding: 12px 15px;
          margin: 8px 0;
          width: 100%;
          font-size: 13px;
        }

        button {
          border-radius: 20px;
          border: 1px solid #512da8;
          background-color: #512da8;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: bold;
          padding: 12px 45px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in;
          margin-top: 15px;
          cursor: pointer;
        }

        button:active {
          transform: scale(0.95);
        }

        button:focus {
          outline: none;
        }

        a {
          color: #333;
          font-size: 14px;
          text-decoration: none;
          margin: 15px 0;
        }
      `}</style>
    </div>
  );
};

export default LoginSignup;