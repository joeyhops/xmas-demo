const express = require('express');
const dotenv = require('dotenv');
const request = require('request');

const port = 5000;
global.access_token = '';

dotenv.config();

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const genRandomString = (len) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.get('/auth/login', (req, res) => {
  let scope = "streaming \
                user-read-email \
                user-read-private \
                playlist-read-private";

  let state = genRandomString(16);
  let query_params = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/cb",
    state: state
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + query_params.toString());
});

app.get('/auth/cb', (req, res) => {
  let code = req.query.code;
  let auth_options = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/auth/cb",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(auth_options, (err, resp, body) => {
    if (!err && res.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/');
    }
  });
});


app.get('/auth/token', (req, res) => {
  console.log(res);
  res.json({
    access_token: access_token
  });
});

app.listen(port, () => {
  console.log("server listening on port " + port);
});