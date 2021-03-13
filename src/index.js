require('babel-polyfill');
const RingCentral = require('@rc-ex/core').default;
const AuthorizeUriExtension = require('@rc-ex/authorize-uri').default;
const localforage = require('localforage');
const DebugExtension = require('@rc-ex/debug').default;

const rc = new RingCentral({
  clientId: 'c8YTIvc5SPiUAaTZwUodZg',
  server: 'https://platform.ringcentral.com',
});

const redirectUri = window.location.origin + window.location.pathname;

const login = () => {
  const authorizeUriExtension = new AuthorizeUriExtension();
  rc.installExtension(authorizeUriExtension);
  authorizeUri = authorizeUriExtension.buildUri({
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
  });
  const codeVerifier = authorizeUriExtension.codeVerifier;
  localforage.setItem('code_verifier', codeVerifier);
  document.writeln(`<a href="${authorizeUri}">Login</a>`);
}

const authorize = async code => {
  await rc.authorize({
    code,
    redirect_uri: redirectUri,
    code_verifier: (await localforage.getItem('code_verifier')),
  });
};

const showGreetings = async () => {
  // @rc-ex/debug
  const debugExtension = new DebugExtension();
  await rc.installExtension(debugExtension);

  const extInfo = await rc.restapi().account().extension().get();
  alert(`Hello ${extInfo.name}!`);
};

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const code = getParameterByName('code');
if(code == null) { // need to login
  login();
} else { // already logged in
  (async () => {
    await authorize(code);
    await showGreetings();
  })();
}
