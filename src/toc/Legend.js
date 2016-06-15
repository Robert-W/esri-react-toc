/* @flow */
import React, {Component} from 'react';
import type {
  LegendItem,
  LegendProps,
  LegendRowProps
} from './Types';

const styles = {
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


class LegendRow extends Component {
  displayName:string = 'LegendRow';
  props: LegendRowProps;

  render () {
    const {label, imageData, inlineStyle} = this.props;

    return (
      <div className='toc__legend-item__row' style={inlineStyle ? styles.legendRow : null}>
        <img src={`data:image/png;base64,${imageData}`} />
        <label className='toc__legend-item__row-label' style={inlineStyle ? styles.legendRowLabel : null}>
          {label}
        </label>
      </div>
    );
  }
}


export default class Legend extends Component {
  displayName:string = 'Legend';
  props: LegendProps;

  render () {
    const {items, scale, inlineStyle} = this.props;

    const legendItems = items.filter((legendItem: LegendItem) => {
      return (legendItem.minScale > scale || legendItem.minScale === 0) && scale > legendItem.maxScale;
    });

    return (
      <div className='toc__legend'>
        {legendItems.map((legendItem: LegendItem) => {
          const {legend} = legendItem;
          const rows = legend ? legend.map((info) => <LegendRow {...info} inlineStyle={inlineStyle} />) : null;
          return (
            <div className='toc__legend-item'>
              <div className='toc__legend-item-title' style={inlineStyle ? styles.legendTitle : null}>
                {legendItem.layerName}
              </div>
              {rows}
            </div>
          );
        })}
      </div>
    );
  }
}
