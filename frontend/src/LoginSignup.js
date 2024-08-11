import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth, googleProvider, db } from './firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AdvancedLogin = () => {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || null,
        role: "trailer",
        disabled: false
      });

      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || null,
        role: "trailer",
        disabled: false
      }, { merge: true });

      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || null,
        role: "trailer",
        disabled: false
      });

      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      <div className="toggle-container">
        <div className={`toggle ${isActive ? 'active' : ''}`}>
          <div className="toggle-panel toggle-left">
            <h2>Welcome Back!</h2>
            <p>To keep connected with us, please login with your personal info.</p>
            <button className="toggle-button" onClick={handleToggle}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start your journey with us.</p>
            <button className="toggle-button" onClick={handleToggle}>Sign Up</button>
          </div>
        </div>
      </div>
      <div className={`form-container ${isActive ? 'sign-up' : 'sign-in'}`}>
        <form onSubmit={isActive ? handleSignUp : handleSignIn}>
          {isActive && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isActive && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit">{isActive ? 'Sign Up' : 'Sign In'}</button>
          {!isActive && (
            <>
              <button type="button" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
              </button>
              <p onClick={handleForgotPassword} className="forgot-password">
                Forgot Password?
              </p>
            </>
          )}
          {error && <p className="error">{error}</p>}
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
          background-color: #0071ce;
          background: linear-gradient(to right, #0071ce, #004ba0);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          height: 100vh;
        }

        .container {
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .container p {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
        }

        .container span {
          font-size: 12px;
        }

        .container a {
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }

        .container button {
          background-color: #ffbc00;
          color: #0071ce;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
        }

        .container button.hidden {
          background-color: transparent;
          border-color: #fff;
        }

        .container form {
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }

        .container input {
          background-color: #eee;
          border: none;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 13px;
          border-radius: 8px;
          width: 100%;
          outline: none;
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.15s ease-in-out;
        }

        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .container.active .sign-in {
          transform: translateX(100%);
        }

        .container.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.15s;
        }

        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }

        .social-icons {
          margin: 20px 0;
        }

        .social-icons a {
          border: 1px solid #ccc;
          border-radius: 20%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 3px;
          width: 40px;
          height: 40px;
        }

        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.15s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }

        .container.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }

        .toggle {
          background-color: #0071ce;
          height: 100%;
          background: linear-gradient(to right, #004ba0, #0071ce);
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.15s ease-in-out;
        }

        .container.active .toggle {
          transform: translateX(50%);
        }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.1s ease-in-out;
        }

        .toggle-left {
          transform: translateX(-200%);
        }

        .container.active .toggle-left {
          transform: translateX(0);
        }

        .toggle-right {
          right: 0;
          transform: translateX(0);
        }

        .container.active .toggle-right {
          transform: translateX(200%);
        }

        .toggle-button {
          margin-top: 20px;
          background-color: transparent;
          border: 2px solid #fff;
          color: #fff;
          font-size: 16px;
          padding: 10px 30px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .toggle-button:hover {
          background-color: #fff;
          color: #0071ce;
        }

        .error {
          color: red;
          font-size: 12px;
          margin-top: 5px;
        }

        .forgot-password {
          color: #0071ce;
          font-size: 12px;
          margin-top: 10px;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AdvancedLogin;
