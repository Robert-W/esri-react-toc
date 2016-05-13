# esri-react-toc
TOC widget for Esri's 4.0 Javascript API.

#### Under Active Development

### Features - More Coming Soon
* Toggle layers on or off
* Tested with `MapImageLayer`, `FeatureLayer`, `ImageryLayer`. May support more but has not yet been tested.
* Shows legend when layer is visible under the label.
  * Legends respect scale dependencies and update automatically.

### Props - More coming soon
Name|Type|Default|Description
---|---|---|---|
`view`|`esri/views/MapView`, `esri/views/SceneView`|`{}`|Instance of an ArcGIS MapView. View must contain either a `Map` or a `WebMap`.
`noStyle`|`boolean`|`false`|If false, this uses some very basic inline styles for structure.  You can omit these and add your own via the provided css classes.
`layerDidUpdate`|`function`|`none`|Optional callback to pass in to be invoked when a layer turns on or off.  The sole argument the function receives is the Esri `Layer` object that changed.

### Usage - Coming Soon

### Contributing
Code is written in ES6 with Flow.  All contributions must pass `npm test`, which is `flow check` and `eslint` on the `src/toc/TOC.js` file.
