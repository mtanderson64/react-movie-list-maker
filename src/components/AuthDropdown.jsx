import { useRef, useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  logout, 
  signInWithEmail, 
  signUpWithEmail 
} from '../services/firebase';
import '../css/AuthDropdown.css'; // Optional styling

function AuthDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open and the click target is NOT inside dropdownRef, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach listener only when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on unmount or when menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      setEmail('');
      setPassword('');
      setIsOpen(false);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      setIsOpen(false);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

// If user is logged in, render profile picture square trigger & user dropdown menu
  if (user) {

    return (
      <div className="auth-dropdown-container" ref={dropdownRef}>
        <button 
          onClick={toggleDropdown} 
          className="auth-btn profile-square-btn"
          aria-label="User Profile"
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '6px',
            overflow: 'hidden',
            border: '2px solid #323790',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#222'
          }}
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Profile'} 
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ color: '#fff', fontWeight: 'bold' }}>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </button>

        {isOpen && (
          <div 
            className="auth-dropdown-menu profile-dropdown-menu"
            style={{
              position: 'absolute',
              right: 0,
              marginTop: '8px',
              minWidth: '150px'
            }}
          >
            {(user.displayName || user.email) && (
              <p className="user-profile-name" style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {user.displayName || user.email}
              </p>
            )}
            <button 
              onClick={() => {
                setIsOpen(false);
                logout();
              }} 
              className="auth-btn logout-btn"
              style={{ width: '100%' }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-dropdown-container" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="auth-btn login-trigger-btn">
        Login
      </button>

      {isOpen && (
        <div className="auth-dropdown-menu">
          <h3>{isSignUp ? 'Create Account' : 'Sign In'}</h3>
          
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleEmailAuth} className="email-auth-form">
            <input
              type="email"
              placeholder="Email address"
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
            <button type="submit" className="submit-btn">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button onClick={handleGoogleSignIn} className="google-btn">
            Sign in with Google
          </button>

          <p className="toggle-signup-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
              {isSignUp ? 'Log In' : 'Sign Up'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default AuthDropdown;