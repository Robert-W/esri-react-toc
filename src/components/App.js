// import MapImageLayer from 'esri/layers/MapImageLayer';
// import FeatureLayer from 'esri/layers/FeatureLayer';
// import ImageryLayer from 'esri/layers/ImageryLayer';
import MapView from 'esri/views/MapView';
import React, {Component} from 'react';
import WebMap from 'esri/WebMap';
import TOCWidget from 'toc/TOC';
// import Map from 'esri/Map';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.view = {};
    this.state = {
      viewReady: false
    };
  }

  componentDidMount() {

    // Create some layers
    // const sampleFeatureLayer = new FeatureLayer({
    //   url: 'http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0'
    // });
    //
    // const sampleImageryLayer = new ImageryLayer({
    //   url: 'http://gis-treecover.wri.org/arcgis/rest/services/ForestCover_lossyear/ImageServer'
    // });
    //
    // const sampleMapImageLayer = new MapImageLayer({
    //   url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
    //   sublayers: [{
    //       id: 0,
    //       visible: true
    //   }]
    // });
    //
    // // Create a map
    // const map = new Map({
    //   basemap: 'streets-navigation-vector',
    //   layers: [sampleFeatureLayer, sampleMapImageLayer, sampleImageryLayer]
    // });

    // Create a Webmap
    const webmap = new WebMap({
      portalItem: { id: '6978b0738db34f948403cbfaf617f011' }
    });

    // Finally, create the map view
    const promise = new MapView({
      container: this.refs.viewContainer,
      center: [-82, 39],
      map: webmap,
      zoom: 4
    });

    // Force a re-render, so the TOC gets the view object
    // If the view is loaded before you create the TOC, you don't need this
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
            <TOCWidget view={this.view} />
          </div>
        </section>
      </div>
    );
  }
}
