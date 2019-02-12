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

  async getImagesList(folderId, googleApiKey, pattern=null, pageSize=1000, orderBy='name') {
    try {
      this.setState({loading: true});
      const query = `'${folderId}'+in+parents+and+mimeType+contains+'image/'` + (pattern ? `+and+name+contains+'${pattern}'` : '')
      const QUERY_URL = `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=${orderBy}&pageSize=${pageSize}&key=${googleApiKey}`;
      const images = [];
      let nextPageToken = true;
      while (nextPageToken) {
        const NEXT_PAGE_URL = QUERY_URL + (nextPageToken === true || !nextPageToken ? '' : `&pageToken=${nextPageToken}`);
        const response = await fetch(NEXT_PAGE_URL);
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

  close() {
    if ('onClose' in this.props) {
      this.props.onClose();
    }
    this.setState({isOpen: false});
  }

  render() {
    return (
      this.state.loading ?
         
        <span className='loading'> Loading...</span> :
         
      this.state.error ?

        <span className='error'> Error loading gallery!</span> :
      
      <Lightbox
        images={this.state.imagesList}
        isOpen={this.state.isOpen}
        onClose={() => this.close()}
        onClickPrev={() => this.gotoPrevious()}
        onClickNext={() => this.gotoNext()}
        imageCountSeparator='/'
        currentImage={this.state.currentImage}
      />
    );
  }
}