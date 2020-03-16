import { useState } from 'react';

export default props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={event => {
            alert('Sign up!');
            event.preventDefault();
          }}
        >
          <input id="email" type="email" placeholder="Email address" />
          <input id="password" type="password" placeholder="Password" />
          <input
            id="passwordconfirmation"
            type="password"
            placeholder="Enter password again"
          />
          <button>Sign up</button>
        </form>
        <p>
          Already have an account?{' '}
          <a href="#" onClick={() => props.showLogin()}>
            Log in
          </a>
        </p>
      </div>
    </>
  );
};
