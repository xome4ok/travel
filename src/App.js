import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import GoogleDriveGallery from './GoogleDriveGallery';
import Markdown from './Markdown';

import './App.css';

import { photoFolders, consts } from './data';
import { homeText, aboutText } from './data';


const Gallery = (folderId, pattern = null) => () => (
  <GoogleDriveGallery
    googleApiKey={consts.GOOGLE_API_KEY}
    folderId={folderId}
    pattern={pattern}
  />
);

const Home = () => (
  <section>
    <Markdown source={homeText}/>
  </section>
);

const Photo = () => (
  <section>
    <ul>
      {Object.entries(photoFolders).map(
        ([route, {name, args}]) => <li key={route}><Link to={`/photo/${route}`}>{name}</Link></li>
      )}
    </ul>
  </section>
);

const NavigationLink = withRouter(
  ({location, match, history, staticContext, ...props}) => (
    location.pathname === props.to ?
      <Link className='active' {...props}/>:
      <Link {...props}/>
  )
);

const Header = () => (
  <header id='app-header'>
    <nav id='nav' className='nav'>
      <div className='tight'>
      <button
        href='#'
        className='icon'
        onClick={() => {
          const nav = document.getElementById('nav');
          nav.className = nav.className === 'nav' ? 'nav responsive' : 'nav';
        }}
      >
        <FontAwesomeIcon icon={faBars}/>
      </button>
      <h1>
        <Link to='/'>xome4ok/travel</Link>
        <div className='navlinks'>
          <NavigationLink to='/photo'>photo</NavigationLink>
          <NavigationLink to='/text'>text</NavigationLink>
          <NavigationLink to='/about'>about</NavigationLink>
        </div>
      </h1>
      </div>
      <div className='right-header-block'>
        <a href='https://github.com/xome4ok/travel' className='link-icon'><FontAwesomeIcon icon={faGithub}/></a>
      </div>
    </nav>
    <hr/>
  </header>
);

const About = () => (
  <section>
    <Markdown source={aboutText}/>
  </section>  
);

const App = () => (
  <div>
  <Header />
  <article id='app'>
    <Route exact path='/' component={Home} />
    <Route path='/photo' component={Photo} />
    <Route path='/about' component={About} />
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
  </div>
);

export default App;
