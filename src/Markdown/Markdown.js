import React, { Component } from 'react';

import ReactMarkdown from 'react-markdown/with-html';

import Link from '../Link';

var sidenoteCounter = 0;

const linkRenderer = (props) => (
  <Link to={props.href}>{props.children}</Link>
);

const sidenoteRenderer = (props) => (
  <>
  <label for={`sn-${sidenoteCounter++}`} className="margin-toggle">
  </label>
  <input type='checkbox' id={`sn-${sidenoteCounter++}`} className='margin-toggle'/>
  <span class='marginnote'>{props.children}</span>
  </>
);

export default class Markdown extends Component {
  state = {
    text: undefined,
    loading: false,
    error: false,
  }
  
  async fetchText(file) {
    const data = await fetch(file);
    return await data.text();
  }

  async componentDidMount() {
    this.setState({loading: true});
    try {
      const text = await this.fetchText(this.props.source);
      this.setState({text: text, loading: false});
    } catch (error) {
      console.error(error);
      this.setState({error: true, loading: false});
    }
  }

  render() {
    return (
      this.state.error ?
        <p className='danger'>Error</p> :
      this.state.loading ?
        <p className='loading'>Loading...</p> :
      <ReactMarkdown
        source={this.state.text}
        escapeHtml={false}
        renderers={{link: linkRenderer, inlineCode: sidenoteRenderer}}
      />
    );
  }
}