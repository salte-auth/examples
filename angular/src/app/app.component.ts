import { Component, OnInit } from '@angular/core';
import { SalteAuth, Provider, OpenIDProvider, OAuth2Provider } from '@salte-auth/salte-auth';
import { Popup } from '@salte-auth/popup';
import { Auth0 } from '@salte-auth/auth0';

function getToken(provider: Provider) {
  if (provider instanceof OpenIDProvider) {
    return provider.idToken || null;
  } else if (provider instanceof OAuth2Provider) {
    return provider.accessToken || provider.code || null;
  }

  return null;
}

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

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tokens = auth.config.providers.reduce((output, provider) => ({
    ...output,
    [provider.name]: getToken(provider)
  }), {});

  ngOnInit() {
    console.log(this.tokens);

    const onAuth = (error, { provider }) => {
      if (error) console.error(error);
      else this.tokens[provider] = getToken(auth.provider(provider));
    };

    auth.on('login', onAuth);
    auth.on('logout', onAuth);
  }

  login(provider) {
    auth.login(provider);
  }

  logout(provider) {
    auth.logout(provider);
  }

  json(value) {
    return JSON.stringify(value, null, 2);
  }
}
