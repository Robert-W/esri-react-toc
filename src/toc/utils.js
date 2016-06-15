import esriRequest from 'esri/request';
import type {
  LegendItem,
  ArcGISLayer
} from './Types';

export function getLegend (layer: ArcGISLayer) {
  return new Promise(function(resolve) {
    // If there is a url, fetch the legend for it now
    if (layer.url) {
      esriRequest(`${layer.url}/legend`, { query: { f: 'json' }}).then((info) => {
        const items: Array<LegendItem> = info.data && info.data.layers;
        resolve(items && items.length ? items : []);
      }, () => {
        // Return an empty array if there was an error getting the legend
        resolve([]);
      });
    }

  });
}
