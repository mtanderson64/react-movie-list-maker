import { signInWithGoogle } from "../services/firebase";

function GoogleAuthButton({ user }) {
  return (
    <>
      {user ? (
        <button onClick={signInWithGoogle}>
          {user.email}
        </button>
        
      ) : (
        <button onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
    </>
  );
}

export default GoogleAuthButton;