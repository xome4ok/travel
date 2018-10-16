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
  <section>
    <ReactMarkdown source={'# Это заголовок\n\nА это - обычный **текст**.'}/>
  </section>
);

const Photo = () => (
  <section>
    <ReactMarkdown source={'# Фото'}/>
    <ul>
      {Object.entries(photoFolders).map(
        ([route, {name, args}]) => <li key={route}><Link to={`/photo/${route}`}>{name}</Link></li>
      )}
    </ul>
  </section>
);

const Header = () => (
  <div className='app-header'>
  <ul>
    <li>
      <Link to="/">Домой</Link>
    </li>
    <li>
      <Link to="/photo">Фото</Link>
    </li>
  </ul>
  </div>
);

class App extends Component {

  render() {
    return (
       <article id='app'>
        <Header />
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
      </article>
    );
  }
}

export default App;
