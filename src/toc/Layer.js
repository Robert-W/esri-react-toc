import React, {Component} from 'react';
import {getLegend} from './utils';
import Legend from './Legend';
import type {
  Sublayer,
  LayerProps,
  LayerState
} from './Types';

const styles = {
  layer: {
    flexDirection: 'column',
    padding: '0.5em',
    display: 'flex'
  },
  layerLabel: {
    paddingLeft: '1em'
  }
};

const getActiveClassName = function getActiveClassName (base, checked):string {
  return `${base}${checked ? ' active' : ''}`;
};

// Needs return type
const getActiveSublayers = function getActiveSublayers (sublayers):Array<Sublayer> {
  return sublayers.filter(sublayer => sublayer.visible).map(sublayer => sublayer.id);
};

const isVisibleAtScale = function isVisibleAtScale (sublayer, scale):boolean {
  return (sublayer.minScale > scale || sublayer.minScale === 0) && scale > sublayer.maxScale;
};

const activeLayersReducer = function activeLayersReducer (activeLayers, layer) {
  const layers = activeLayers.slice();
  const index = layers.indexOf(layer.id);
  if (index > -1) {
    layers.splice(index, 1);
  } else {
    layers.push(layer.id);
  }
  return layers;
};

export class MapImageLayer extends Component {
  displayName: String = 'MapImageLayer';
  props: LayerProps;
  state: LayerState;

  constructor (props) {
    super(props);

    const {initialChecked, layer} = this.props;
    this.state = {
      checked: initialChecked,
      legendItems: undefined,
      activeLayers: [],
      loaded: false
    };

    if (!layer.loaded) {
      layer.on('layerview-create', () => {
        this.setState({ activeLayers: getActiveSublayers(layer.sublayers), loaded: true });
      });
    } else {
      this.setState({ activeLayers: getActiveSublayers(layer.sublayers), loaded: true });
    }

    if (initialChecked) {
      getLegend(layer).then((items) => { this.setState({ legendItems: items }); });
    }
  }

  toggle = ({target}) => {
    const {layer} = this.props;
    const {activeLayers} = this.state;
    const sublayer = layer.sublayers[target.getAttribute('data-layer')];
    // Toggle layer and update state
    if (sublayer) {
      sublayer.visible = !sublayer.visible;
      this.setState({ activeLayers: activeLayersReducer(activeLayers, sublayer) });
    }
  };

  toggleAll = ({target}) => {
    const {layer} = this.props;
    const {checked} = target;
    // Turn them all on or off, update state and then update the layers
    const activeLayers = checked ? layer.sublayers.map((sublayer) => sublayer.id) : [];
    this.setState({ activeLayers, checked });

    layer.visible = checked;
    layer.sublayers.forEach((sublayer) => { sublayer.visible = checked; });
  };

  render () {
    const {checked, legendItems, loaded, activeLayers} = this.state;
    const {layer, scale, inlineStyle} = this.props;
    const {sublayers} = layer;
    let layers;

    // JSON for the sublayers is different based on the layers loaded status,
    // wait til the layer is loaded to render otherwise certain props will be missing
    if (sublayers && loaded) {
      layers = sublayers.filter((sublayer) => isVisibleAtScale(sublayer, scale)).map((sublayer) => {
        const active = activeLayers.indexOf(sublayer.id) > -1;
        const id = `${layer.id}-${sublayer.id}`;
        let legend, legendItem;

        if (legendItems && sublayer.visible) {
          legendItem = legendItems.filter(item => item.layerId === sublayer.id);
          legend = <Legend inlineStyle={inlineStyle} scale={scale} items={legendItem} noTitle={true} />;
        }

        return (
          <div className='toc__sublayer'>
            <input data-layer={sublayer.id} id={id} onChange={this.toggle} checked={active} type='checkbox' />
            <label htmlFor={id} className='toc__layer-label' style={inlineStyle ? styles.layerLabel : null}>
              {sublayer.title}
            </label>
            {legend}
          </div>
        );
      });
    }

    return (
      <div
        key={layer.id}
        style={inlineStyle ? styles.layer : null}
        className={getActiveClassName('toc__map-image-layer', checked)}>
        <input id={layer.id} onChange={this.toggleAll} checked={checked} type='checkbox' />
        <label htmlFor={layer.id} className='toc__layer-label' style={inlineStyle ? styles.layerLabel : null}>
          {layer.title}
        </label>
        {layers}
      </div>
    );
  }

}

export class Layer extends Component {
  displayName: String = 'Layer';
  props: LayerProps;
  state: LayerState;

  constructor (props) {
    super(props);

    const {layer, initialChecked} = this.props;
    this.state = {
      checked: initialChecked,
      legendItems: undefined,
      loaded: false
    };

    if (!layer.loaded && layer.on) {
      layer.on('layerview-create', () => { this.setState({ sublayers: layer.allSublayers }); });
    }

    if (initialChecked) {
      getLegend(layer).then((items) => { this.setState({ legendItems: items }); });
    }
  }

  toggle = () => {
    const {legendItems} = this.state;
    const {layer, layerDidUpdate} = this.props;
    this.setState({ checked: !layer.visible });
    // Update the Map
    layer.visible = !layer.visible;
    // Get the legend if we havent already done so
    if (!legendItems) {
      getLegend(layer);
    }

    if (layerDidUpdate) {
      layerDidUpdate(layer);
    }
  };

  render () {
    const {checked, legendItems} = this.state;
    const {layer, scale, inlineStyle} = this.props;
    let legend;

    if (legendItems && layer.visible) {
      legend = <Legend inlineStyle={inlineStyle} scale={scale} items={legendItems} />;
    }

    return (
      <div key={layer.id} style={inlineStyle ? styles.layer : null} className={getActiveClassName('toc__layer', checked)}>
        <div className='toc__layer-control'>
          <input id={`toc__${layer.id}`} onChange={this.toggle} checked={checked} type='checkbox' />
          <label htmlFor={`toc__${layer.id}`} className='toc__layer-label' style={inlineStyle ? styles.layerLabel : null}>
            {layer.title}
          </label>
        </div>
        {legend}
      </div>
    );
  }

}
