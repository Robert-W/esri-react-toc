/* @flow */
import {Layer, MapImageLayer} from './Layer';
import React, {Component} from 'react';
import type {
  WidgetState,
  WidgetProps,
  ArcGISLayer
} from './Types';

/**
* Stylesheet for the Table of Contents Widget
*/
const styles = {
  toc: {
    flexDirection: 'column',
    display: 'flex'
  }
};

/**
* Table of Contents Widget
*/
export default class TOC extends Component {

  displayName:string = 'TableOfContents';
  state: WidgetState;
  props: WidgetProps;

  state: WidgetState = {
    loaded: false,
    scale: 0
  };

  constructor (props: WidgetProps) {
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
    window.view = view;
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
    return layer.sublayers && layer.sublayers.length ?
      <MapImageLayer {...other} scale={view.scale} layer={layer} initialChecked={layer.visible} /> :
      <Layer {...other} scale={view.scale} layer={layer} initialChecked={layer.visible} />;
  };

  render () {
    const layers:Array<ArcGISLayer> = this.getLayers();
    const {inlineStyle} = this.props;

    return (
      <div className='toc' style={inlineStyle ? styles.toc : undefined}>
        {layers.map(this.renderTOCLayers)}
      </div>
    );
  }
}
