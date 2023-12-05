import React, { useState, useEffect } from 'react';
import treeTest from './tree_test.webp'
import './App.css';
import Login from './Login';
import WebPlayer from './WebPlayback';

function App() {
  const [token, setToken] = useState('');
  useEffect(() => {
    async function getToken() {
      const res = await fetch('/auth/token');
      const json = await res.json();
      setToken(json.access_token);
    }
    getToken();
  }, []);
  return (
    <>
      { (token === '') ? <Login /> : <WebPlayer token={token} />}
    </>
  );
}

export default App;
