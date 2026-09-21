import { signInWithGoogle } from "../services/firebase";

function GoogleAuthButton({ user }) {
  return (
    <>
      {user ? (
        <p>Logged in as {user.email}</p>
      ) : (
        <button onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
    </>
  );
}

export default GoogleAuthButton;