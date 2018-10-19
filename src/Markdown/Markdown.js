import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

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
      />
    );
  }
}