import React, { Component } from 'react';
import Lightbox from 'react-images';

import './GoogleDriveGallery.css';


export default class GoogleDriveGallery extends Component {
  
  state = {
    imagesList: [],
    currentImage: 0,
    error: false,
    loading: false,
    isOpen: true,
  }

  imageListAsImageGalleryItems(imagesList) {
    return imagesList.map(
      ({id, name}) => {
        return {
          src: `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${this.props.googleApiKey}`,
          caption: name,
        };
      }
    )
  }

  async getImagesList(folderId, googleApiKey, pattern=null, pageSize=1000) {
    try {
      this.setState({loading: true});
      const query = `'${folderId}'+in+parents+and+mimeType+contains+'image/'` + (pattern ? `+and+name+contains+'${pattern}'` : '')
      const QUERY_URL = `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=${pageSize}&key=${googleApiKey}`;
      const images = [];
      let nextPageToken = true;
      while (nextPageToken) {
        const response = await fetch(QUERY_URL);
        const json = await response.json();
        images.push(...json['files'].map(({id, name}) => {return {id, name};}));
        nextPageToken = json['nextPageToken'];
      }
      this.setState(
        {
          imagesList: this.imageListAsImageGalleryItems(images),
          loading: false
        }
      );
    } catch (error) {
      console.error(error);
      this.setState({error: true, loading: false});
    }
  }

  async componentDidMount() {
    const { folderId, googleApiKey, pattern } = this.props;
    await this.getImagesList(folderId, googleApiKey, pattern);
  }

  gotoPrevious () {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoNext () {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  render() {
    return (
      this.state.loading ?
         
        <div className='loading'>Loading...</div> :
         
      this.state.error ?

        <div className='error'>Error loading gallery!</div> :

      <Lightbox
        images={this.state.imagesList}
        isOpen={this.state.isOpen}
        onClose={() => this.setState({isOpen: false})}
        onClickPrev={() => this.gotoPrevious()}
        onClickNext={() => this.gotoNext()}
        imageCountSeparator='/'
        currentImage={this.state.currentImage}
      />
    );
  }
}