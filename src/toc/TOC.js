/* @flow */
import React, {Component} from 'react';
import esriRequest from 'esri/request';

/**
* Custom Flow Types for the Table of Contents Widget
*/
// TOC
type TOCProps = {
  view: ArcGISView,

  // don't add inline styles
  noStyle?: boolean,
  // Function for users to get notified of layer updates, it will pass
  // back a reference to the layer that updated
  layerDidUpdate?: Function
};
// TOC
type TOCState = {
  loaded: boolean,
  scale: number
};
// TOCLayer
type TOCLayerProps = {
  scale: number,
  noStyle: boolean,
  layer: ArcGISLayer,
  initialChecked: boolean,
  layerDidUpdate?: Function
};
// TOCLayer
type TOCLayerState = {
  checked: boolean,
  legendItems?: Array<LegendItem>
};
// Legend
type LegendProps = {
  items: Array<LegendItem>,
  scale: number, // View Scale
  noStyle?: boolean
};
// Legend
type LegendRowProps = {
  imageData: string,
  label: string,
  noStyle?: boolean
};
// Legend
type LegendItem = {
  layerName: string,
  legend: Array<LegendRowProps>,
  minScale: number,
  maxScale: number,
  layerId: string
};
// Esri View properties I need
type ArcGISView = {
  map: {
    findLayerById(layerId: string):any,
    layers: {
      items: Array<ArcGISLayer>
    }
  },
  ready: boolean,
  scale: number,
  watch(property:string, callback:Function):any
};
// Esri Layer properties I need
type ArcGISLayer = {
  id: string,
  url: string,
  title: string,
  visible: boolean
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
  },
  legendTitle: {
    padding: '0.5em 0',
    fontWeight: 'bold'
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center'
  },
  legendRowLabel: {
    paddingLeft: '0.5em'
  }
};

/**
* Legend Row for the Legend Component
*/
const LegendRow = function LegendRow (props: LegendRowProps) {
  return (
    <div className='toc__legend-item__row' style={props.noStyle ? undefined : styles.legendRow}>
      <img src={`data:image/png;base64,${props.imageData}`} />
      <label className='toc__legend-item__row-label' style={props.noStyle ? undefined : styles.legendRowLabel}>
        {props.label}
      </label>
    </div>
  );
};

/**
* Legend to display
*/
const Legend = function Legend (props: LegendProps) {
  const {items, scale, noStyle} = props;
  //- remove any non-visible layers due to scale
  let legendItems = items.filter((legendItem: LegendItem) => {
    return (legendItem.minScale > scale || legendItem.minScale === 0) && scale > legendItem.maxScale;
  });
  // Generate the legend item
  return (
    <div className='toc__legend'>
      {legendItems.map((legendItem: LegendItem) => {
        const {legend} = legendItem;
        const rows = legend ? legend.map((info) => <LegendRow {...info} noStyle={noStyle} />) : null;
        return (
          <div className='toc__legend-item'>
            <div className='toc__legend-item-title' style={noStyle ? undefined : styles.legendTitle}>
              {legendItem.layerName}
            </div>
            {rows}
          </div>
        );
      })}
    </div>
  );
};

/**
* Table of Contents Layer Component
*/
class TOCLayer extends Component {

  displayName: 'TOCLayer';
  props: TOCLayerProps;
  state: TOCLayerState;

  constructor (props) {
    super(props);

    this.state = {
      checked: props.initialChecked,
      legendItems: undefined
    };

    if (props.initialChecked) {
      this.getLegend(props.layer);
    }
  }

  getLegend:Function = (arcgisLayer: ArcGISLayer) => {
    esriRequest(`${arcgisLayer.url}/legend`, { query: { f: 'json' }}).then((info) => {
      let items: Array<LegendItem> = info.data && info.data.layers;
      if (items && items.length) {
        this.setState({ legendItems: items });
      }
    });
  };

  toggle = () => {
    const {legendItems} = this.state;
    const {layer, layerDidUpdate} = this.props;
    this.setState({ checked: !layer.visible });
    // Update the Map
    layer.visible = !layer.visible;
    // Get the legend if we havent already done so
    if (!legendItems) {
      this.getLegend(layer);
    }

    if (layerDidUpdate) {
      layerDidUpdate(layer);
    }
  };

  render () {
    const {checked, legendItems} = this.state;
    const {layer, scale, noStyle} = this.props;
    let legend;

    if (legendItems && layer.visible) {
      legend = <Legend noStyle={noStyle} scale={scale} items={legendItems} />;
    }

    return (
      <div
        key={layer.id}
        className={`toc__layer${checked ? 'active' : ''}`}
        style={noStyle ? undefined : styles.layer} >
        <div className='toc__layer-control'>
          <input
            id={`toc__${layer.id}`}
            onChange={this.toggle}
            checked={checked}
            type='checkbox' />
          <label
            htmlFor={`toc__${layer.id}`}
            className='toc__layer-label'
            style={noStyle ? undefined : styles.layerLabel} >
            {layer.title}
          </label>
        </div>
        {legend}
      </div>
    );
  }

}


/**
* Table of Contents Widget
*/
export default class TOC extends Component {

  displayName:string = 'TableOfContents';
  state: TOCState;
  props: TOCProps;

  state: TOCState = {
    loaded: false,
    scale: 0
  };

  // static defaultProps = {
  //   noStyle: false
  // };

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
    const {scale} = this.state;
    const {view} = this.props;

    // Attach listeners
    // TODO, See if there is a more efficient way to listen to scale changes
    // this fires quite a bit on zoom
    view.watch('scale', () => {
      if (view.scale !== scale) {
        this.setState({ scale: view.scale });
      }
    });

    // Update state
    this.setState({
      loaded: true,
      scale: view.scale
    });
  };

  getLayers:Function = () => {
    const {view} = this.props;
    return view.map && view.map.layers && view.map.layers.items || [];
  };

  /**
  * TOC Events
  */

  /**
  * Rendering Functions
  */
  renderTOCLayers:Function = (layer: ArcGISLayer) => {
    const {view, ...other} = this.props;
    return <TOCLayer {...other} scale={view.scale} layer={layer} initialChecked={layer.visible} />;
  };

  render () {
    const layers:Array<ArcGISLayer> = this.getLayers();
    const {noStyle} = this.props;

    return (
      <div className='toc' style={noStyle ? undefined : styles.toc}>
        {layers.map(this.renderTOCLayers)}
      </div>
    );
  }
}
