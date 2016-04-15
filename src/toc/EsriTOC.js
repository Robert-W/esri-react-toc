import React, {Component, PropTypes} from 'react';

export default class EsriTOC extends Component {

  displayName = 'EsriTOC';

  propTypes = {
    view: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    //- Set default state
    this.state = {
      viewReady: false
    };
    //- Initialize the TOC if the view is present, because we are passing in an empty object on
    //- the first render, we want to wait until the View is Esri's View and not the default object
    if (props.view.ready) {
      this.initializeTOC();
    }
  }

  componentDidUpdate() {
    let {view} = this.props;
    //- If we are not initialized, initialize now
    if (!this.state.viewReady && view.ready) {
      this.initializeTOC();
    }
  }

  initializeTOC = () => {
    //- Read the layers

    //- Attach listeners

    //- Update state
    this.setState({
      viewReady: true
    });
  };

  render () {
    return (
      <div className='esri-toc'>
        Hey
      </div>
    );
  }
}
