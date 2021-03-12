const RingCentral = require('@rc-ex/core').default;
const AuthorizeUriExtension = require('@rc-ex/authorize-uri').default;
const localforage = require('localforage');

const rc = new RingCentral({
  clientId: 'c8YTIvc5SPiUAaTZwUodZg',
  server: 'https://platform.ringcentral.com',
});

const redirectUri = window.location.origin + window.location.pathname;

const authorize = async code => {
  await rc.authorize({
    code,
    redirect_uri: redirectUri,
    code_verifier: (await localforage.getItem('code_verifier')),
  });
};

const showGreetings = async () => {
  alert('Hello guest!');
};

const urlSearchParams = new URLSearchParams(
  new URL(window.location.href).search
);
const code = urlSearchParams.get('code');
if(code == null) { // need to login
  const authorizeUriExtension = new AuthorizeUriExtension();
  rc.installExtension(authorizeUriExtension);
  authorizeUri = authorizeUriExtension.buildUri({
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
  });
  const codeVerifier = authorizeUriExtension.codeVerifier;
  localforage.setItem('code_verifier', codeVerifier);
  document.writeln(`<a href="${authorizeUri}">Login</a>`);
} else { // already logged in
  (async () => {
    await authorize(code);
    await showGreetings();
  })();
}
