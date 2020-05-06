import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from '@salte-auth/auth0';
import { Popup } from '@salte-auth/popup';

const auth = new SalteAuth({
  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0',
    })
  ],

  handlers: [
    new Popup({
      default: true,
    })
  ]
});

export function App() {
  const [tokens, setTokens] = useState(auth.config.providers.reduce((output, provider) => ({
    ...output,
    [provider.name]: provider.idToken || provider.accessToken || provider.code
  }), {}));

  useEffect(() => {
    const onAuth = (error, { provider }) => {
      if (error) console.error(error);
      else {
        const { idToken, accessToken, code } = auth.provider(provider);

        setTokens({
          ...tokens,
          [provider]: idToken || accessToken || code || null
        });
      }
    };

    auth.on('login', onAuth);
    auth.on('logout', onAuth);
  }, []);

  return (
    <>
      <h1>User Info</h1>
      {Object.entries(tokens).map(([provider, token]) => (
        <div key={provider}>
          <h2>{provider}</h2>
          <button
            disabled={!token.expired}
            onClick={() => auth.login(provider)}
          >
              Login
          </button>
          <button
            disabled={token.expired}
            onClick={() => auth.logout(provider)}
          >
              Logout
          </button>
          <code>{JSON.stringify(token.user, null, 2)}</code>
        </div>
      ))}
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById('app'));
