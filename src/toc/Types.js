/* @flow */

/**
* TOC Types
*/
export type WidgetProps = {
  view: ArcGISView,
  inlineStyle?: boolean, // Use inlinr style
  layerDidUpdate?: Function // Optional Callback
};

export type WidgetState = {
  loaded: boolean,
  scale: number
};

/**
* Layer Types
*/
export type LayerProps = {
  scale: number,
  layer: ArcGISLayer,
  initialChecked: boolean,
  inlineStyle?: boolean,
  layerDidUpdate?: Function
};

export type LayerState = {
  loaded: boolean,
  checked: boolean,
  legendItems?: Array<LegendItem>,
  activeLayers?: Array<string>
};

export type Sublayer = {
  id: number,
  title: string,
  visible: boolean,
  minScale: number,
  maxScale: number
};
/**
* Legend Types
*/
export type LegendProps = {
  scale: number, // View Scale
  items: Array<LegendItem>,
  noTitle?: boolean,
  inlineStyle?: boolean
};

export type LegendRowProps = {
  label: string,
  imageData: string,
  inlineStyle?: boolean
};

export type LegendItem = {
  layerName: string,
  legend: Array<LegendRowProps>,
  minScale: number,
  maxScale: number,
  layerId: string
};

/**
* Esri Types
*/
export type ArcGISView = {
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

export type ArcGISLayer = {
  id: string,
  url: string,
  title: string,
  visible: boolean
};
