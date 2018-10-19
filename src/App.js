import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import GoogleDriveGallery from './GoogleDriveGallery';
import { Markdown } from './Markdown';

import './App.css';

import { photoFolders, consts, articles } from './data';
import { homeText, aboutText } from './data';


const MarkdownPage = (text) => () => (
  <Markdown source={text} />
);

const Gallery = withRouter(({history, folderId, pattern = null}) => (
  <GoogleDriveGallery
    googleApiKey={consts.GOOGLE_API_KEY}
    folderId={folderId}
    pattern={pattern}
    onClose={() => history.push('/photo')}
  />
));

const NavigationLink = withRouter(
  ({location, match, history, staticContext, ...props}) => (
    location.pathname.startsWith(props.to) ?
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

const Text = withRouter(
  ({location, match, history, staticContext, ...rest}) => (
    <Markdown source={articles[match.params.text]} />
));

const Photo = withRouter(
  ({location, match, history, staticContext, ...rest}) => (
    <section>
      <ul>
        {Object.entries(photoFolders).map(
          ([route, {name, props}]) => 
            <li key={route}>
              <Link to={`/photo/${route}`}>{name}</Link>
              {match.params.gallery === route ? <Gallery {...props} /> : null}
            </li>
        )}
      </ul>
    </section>
));

const App = () => (
  <div>
  <Header />
  <article id='app'>
    <Route exact path='/' component={MarkdownPage(homeText)} />
    <Route exact path='/about' component={MarkdownPage(aboutText)} />
    <Route path='/texts/:text' component={Text} />
    <Switch>
      <Route path='/photo/:gallery' component={Photo} />
      <Route path='/photo' component={Photo} />
    </Switch>
  </article>
  </div>
);

export default App;
