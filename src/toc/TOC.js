/* @flow */
import React, {Component} from 'react';
import esriRequest from 'esri/request';

/**
* Custom Flow Types for the Table of Contents Widget
*/
type ArcGISView = {
  map: {
    findLayerById(layerId: string):any,
    layers: {
      items: Array<ArcGISLayer>
    }
  }
};

type ArcGISLayer = {
  id: string,
  url: string,
  title: string,
  visible: boolean
};

type LegendProps = {
  items: Array<LegendItem>,
  scale: number // View Scale
};

type LegendInfo = {
  imageData: string,
  label: string
};

type LegendItem = {
  layerName: string,
  legend: Array<LegendInfo>,
  minScale: number,
  maxScale: number,
  layerId: string
};

type TOCProps = {
  view: ArcGISView
};

type TOCState = {
  loaded: boolean,
  legends: {[key:string]:LegendProps}
};

/**
* Stylesheet for the Table of Contents Widget
*/
const styles = {
  toc: {
    flexDirection: 'column',
    display: 'flex'
  },
  layer: {
    flexDirection: 'column',
    padding: '0.5em',
    display: 'flex'
  },
  layerLabel: {
    paddingLeft: '1em'
  }
};

/**
* Legend Widget and Helper Components
*/
const LegendRow = function LegendRow (props: LegendInfo) {
  return (
    <div className='toc__legend-item-row'>
      <img src={`data:image/png;base64,${props.imageData}`} />
      <label>{props.label}</label>
    </div>
  );
};

const Legend = function Legend (props: LegendProps) {
  const {items, scale} = props;
  //- remove any non-visible layers due to scale
  let legendItems = items.filter((legendItem: LegendItem) => {
    return legendItem.minScale < scale && scale < legendItem.maxScale;
  });
  // Generate the legend item
  return (
    <div className='toc__legend'>
      {legendItems.map((legendItem: LegendItem) => {
        const {legend} = legendItem;
        const rows = legend ? legend.map((info) => <LegendRow {...info} />) : null;
        return (
          <div className='toc__legend-item'>
            <div className='toc__legend-item-title'>{legendItem.layerName}</div>
            {rows}
          </div>
        );
      })}
    </div>
  );
};

/**
* Table of Contents Widget
*/
export default class TOC extends Component {

  displayName:string = 'TableOfContents';
  state: TOCState;
  props: TOCProps;

  state: TOCState = {
    loaded: false,
    legends: {}
  };

  constructor (props: TOCProps) {
    super(props);
    /**
    * We are passing in an empty object on the first render,
    * we want to wait until the view is Esri's view and it's ready
    */
    if (props.view.ready) {
      this.initialize();
    }
  }

  componentDidUpdate() {
    const {view} = this.props;
    // If we are not initialized already, then initialize now
    if (!this.state.loaded && view.ready) {
      this.initialize();
    }
  }

  initialize:Function = () => {
    const layers:Array<ArcGISLayer> = this.getLayers();
    window.view = this.props.view;
    // Attach listeners

    // Get Legends for visible layers, the rest will be loaded when the layer is first activated
    layers.forEach((layer) => {
      if (layer.legendEnabled && layer.visible) {
        this.getLegend(layer);
      }
    });

    this.setState({ loaded: true });
  };

  getLayers:Function = () => {
    const {view} = this.props;
    return view.map && view.map.layers && view.map.layers.items || [];
  };

  getLegend:Function = (arcgisLayer: ArcGISLayer) => {
    esriRequest(`${arcgisLayer.url}/legend`, { query: { f: 'json' }}).then((info) => {
      let items: Array<LegendItem> = info.data && info.data.layers;
      // Update the legends cache
      if (items && items.length) {
        const {legends} = this.state;
        legends[arcgisLayer.id] = { items };
        this.setState({ legends });
      }
    });
  };

  /**
  * TOC Events
  */
  toggle:Function = ({currentTarget}:any) => {
    const layerId = currentTarget.getAttribute('data-layer-id');
    const {view} = this.props;

    //- Update the layer
    if (view.map && layerId) {
      const layer = view.map.findLayerById(layerId);
      layer.visible = !layer.visible;
      this.forceUpdate();
      //- Get the legend info for this layer if we have not already done so
      const {legends} = this.state;
      if (!legends[layer.id]) {
        this.getLegend(layer);
      }
    }
  };

  /**
  * Rendering Functions
  */
  renderLayers:Function = (layer: ArcGISLayer) => {
    const {legends} = this.state;
    const {view} = this.props;
    let legend;

    if (legends[layer.id]) {
      legend = <Legend scale={view.scale} {...legends[layer.id]} />;
    }

    return (
      <div key={layer.id} className={`toc__layer${layer.visible ? ' active' : ''}`} style={styles.layer}>
        <div className='toc__layer-control'>
          <input type='checkbox'
            onChange={this.toggle}
            id={`toc__${layer.id}`}
            checked={layer.visible}
            data-layer-id={layer.id} />
          <label htmlFor={`toc__${layer.id}`} className='toc__layer-label' style={styles.layerLabel}>
            {layer.title}
          </label>
        </div>
        {legend}
      </div>
    );
  };

  render () {
    const layers:Array<ArcGISLayer> = this.getLayers();

    return (
      <div className='toc' style={styles.toc}>
        {layers.map(this.renderLayers)}
      </div>
    );
  }
}
