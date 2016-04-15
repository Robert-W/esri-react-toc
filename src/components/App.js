import React, {Component} from 'react';
import MapView from 'esri/views/MapView';
import EsriTOC from 'toc/EsriTOC';
import Map from 'esri/Map';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.view = {};
    this.state = {
      viewReady: false
    };
  }

  componentDidMount() {

    const map = new Map({
      basemap: 'streets'
    });

    const promise = new MapView({
      container: this.refs.viewContainer,
      center: [15, 65],
      map: map,
      zoom: 4
    });

    promise.then((view) => {
      this.view = view;
      this.setState({ viewReady: true });
    });

  }

  render () {
    return (
      <div className='root'>
        <header className='app-header'>
          <h1>Esri TOC Example</h1>
        </header>
        <section ref='viewContainer' className='view-container'>
          <div className='toc-container'>
            <EsriTOC view={this.view} />
          </div>
        </section>
      </div>
    );
  }
}
