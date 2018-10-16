import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import GoogleDriveGallery from './GoogleDriveGallery';

import './App.css';

import { photoFolders, consts } from './data';

const Gallery = (folderId, pattern = null) => () => (
  <GoogleDriveGallery
    googleApiKey={consts.GOOGLE_API_KEY}
    folderId={folderId}
    pattern={pattern}
  />
);

const Home = () => (
  <div>
    <ReactMarkdown source={'# Это заголовок\n\nА это - обычный **текст**.'}/>
  </div>
);

const Photo = () => (
  <div>
    <ReactMarkdown source={'# Photo'}/>
    <ul>
      {Object.entries(photoFolders).map(
        ([url, {name, args}]) => <li key={url}><Link to={url}>{name}</Link></li>
      )}
    </ul>
  </div>
);

class App extends Component {

  render() {
    return (
       <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/photo">Photo</Link>
          </li>
        </ul>
        
        <Route exact path="/" component={Home} />
        <Route path="/photo" component={Photo} />
        {
          Object.entries(photoFolders).map(
            ([route, {name, args}]) => 
              <Route
                exact
                path={`/photo/${route}`}
                component={Gallery(...args)}
                key={route}
              />
          )
        }
      </div>
    );
  }
}

export default App;
