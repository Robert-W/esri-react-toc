define(["react","esri/request"],function(e,t){"use strict";function a(e){return new Promise(function(a){e.url&&t(e.url+"/legend",{query:{f:"json"}}).then(function(e){var t=e.data&&e.data.layers;a(t&&t.length?t:[])},function(){a([])})})}var n="default"in e?e["default"]:e;t="default"in t?t["default"]:t;var l=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},c=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},s=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a},o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},u={legendTitle:{padding:"0.5em 0",fontWeight:"bold"},legendRow:{display:"flex",alignItems:"center"},legendRowLabel:{paddingLeft:"0.5em"}},d=function(e){function t(){var e,a,n,r;l(this,t);for(var i=arguments.length,c=Array(i),s=0;i>s;s++)c[s]=arguments[s];return a=n=o(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),n.displayName="LegendRow",r=a,o(n,r)}return c(t,e),r(t,[{key:"render",value:function(){var e=this.props,t=e.label,a=e.imageData,l=e.inlineStyle;return n.createElement("div",{className:"toc__legend-item__row",style:l?u.legendRow:null},n.createElement("img",{src:"data:image/png;base64,"+a}),n.createElement("label",{className:"toc__legend-item__row-label",style:l?u.legendRowLabel:null},t))}}]),t}(e.Component),y=function(e){function t(){var e,a,n,r;l(this,t);for(var i=arguments.length,c=Array(i),s=0;i>s;s++)c[s]=arguments[s];return a=n=o(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),n.displayName="Legend",r=a,o(n,r)}return c(t,e),r(t,[{key:"render",value:function(){var e=this.props,t=e.items,a=e.scale,l=e.inlineStyle,r=e.noTitle,c=t.filter(function(e){return(e.minScale>a||0===e.minScale)&&a>e.maxScale});return n.createElement("div",{className:"toc__legend"},c.map(function(e){var t=e.legend,a=t?t.map(function(e){return n.createElement(d,i({},e,{inlineStyle:l}))}):null;return n.createElement("div",{className:"toc__legend-item"},r?null:n.createElement("div",{className:"toc__legend-item-title",style:l?u.legendTitle:null},e.layerName),a)}))}}]),t}(e.Component),f={layer:{flexDirection:"column",padding:"0.5em",display:"flex"},layerLabel:{paddingLeft:"1em"}},p=function(e,t){return""+e+(t?" active":"")},m=function(e){return e.filter(function(e){return e.visible}).map(function(e){return e.id})},v=function(e,t){return(e.minScale>t||0===e.minScale)&&t>e.maxScale},h=function(e,t){var a=e.slice(),n=a.indexOf(t.id);return n>-1?a.splice(n,1):a.push(t.id),a},b=function(e){function t(e){l(this,t);var n=o(this,Object.getPrototypeOf(t).call(this,e));g.call(n);var r=n.props,i=r.initialChecked,c=r.layer;return n.state={checked:i,legendItems:void 0,activeLayers:[],loaded:!1},c.loaded?n.setState({activeLayers:m(c.sublayers),loaded:!0}):c.on("layerview-create",function(){n.setState({activeLayers:m(c.sublayers),loaded:!0})}),i&&a(c).then(function(e){n.setState({legendItems:e})}),n}return c(t,e),r(t,[{key:"render",value:function(){var e=this,t=this.state,a=t.checked,l=t.legendItems,r=t.loaded,i=t.activeLayers,c=this.props,s=c.layer,o=c.scale,u=c.inlineStyle,d=s.sublayers,m=void 0;return d&&r&&(m=d.filter(function(e){return v(e,o)}).map(function(t){var a=i.indexOf(t.id)>-1,r=s.id+"-"+t.id,c=void 0,d=void 0;return l&&t.visible&&(d=l.filter(function(e){return e.layerId===t.id}),c=n.createElement(y,{inlineStyle:u,scale:o,items:d,noTitle:!0})),n.createElement("div",{className:"toc__sublayer"},n.createElement("input",{"data-layer":t.id,id:r,onChange:e.toggle,checked:a,type:"checkbox"}),n.createElement("label",{htmlFor:r,className:"toc__layer-label",style:u?f.layerLabel:null},t.title),c)})),n.createElement("div",{key:s.id,style:u?f.layer:null,className:p("toc__map-image-layer",a)},n.createElement("input",{id:s.id,onChange:this.toggleAll,checked:a,type:"checkbox"}),n.createElement("label",{htmlFor:s.id,className:"toc__layer-label",style:u?f.layerLabel:null},s.title),m)}}]),t}(e.Component),g=function(){var e=this;this.displayName="MapImageLayer",this.toggle=function(t){var a=t.target,n=e.props.layer,l=e.state.activeLayers,r=n.sublayers[a.getAttribute("data-layer")];r&&(r.visible=!r.visible,e.setState({activeLayers:h(l,r)}))},this.toggleAll=function(t){var a=t.target,n=e.props.layer,l=a.checked,r=l?n.sublayers.map(function(e){return e.id}):[];e.setState({activeLayers:r,checked:l}),n.visible=l,n.sublayers.forEach(function(e){e.visible=l})}},_=function(e){function t(e){l(this,t);var n=o(this,Object.getPrototypeOf(t).call(this,e));w.call(n);var r=n.props,i=r.layer,c=r.initialChecked;return n.state={checked:c,legendItems:void 0,loaded:!1},!i.loaded&&i.on&&i.on("layerview-create",function(){n.setState({sublayers:i.allSublayers})}),c&&a(i).then(function(e){n.setState({legendItems:e})}),n}return c(t,e),r(t,[{key:"render",value:function(){var e=this.state,t=e.checked,a=e.legendItems,l=this.props,r=l.layer,i=l.scale,c=l.inlineStyle,s=void 0;return a&&r.visible&&(s=n.createElement(y,{inlineStyle:c,scale:i,items:a})),n.createElement("div",{key:r.id,style:c?f.layer:null,className:p("toc__layer",t)},n.createElement("div",{className:"toc__layer-control"},n.createElement("input",{id:"toc__"+r.id,onChange:this.toggle,checked:t,type:"checkbox"}),n.createElement("label",{htmlFor:"toc__"+r.id,className:"toc__layer-label",style:c?f.layerLabel:null},r.title)),s)}}]),t}(e.Component),w=function(){var e=this;this.displayName="Layer",this.toggle=function(){var t=e.state.legendItems,n=e.props,l=n.layer,r=n.layerDidUpdate;e.setState({checked:!l.visible}),l.visible=!l.visible,t||a(l),r&&r(l)}},O={toc:{flexDirection:"column",display:"flex"}},k=function(e){function t(e){l(this,t);var a=o(this,Object.getPrototypeOf(t).call(this,e));return a.displayName="TableOfContents",a.state={loaded:!1,scale:0},a.initialize=function(){var e=a.state.scale,t=a.props.view;window.view=t,t.watch("scale",function(){t.scale!==e&&a.setState({scale:t.scale})}),a.setState({loaded:!0,scale:t.scale})},a.getLayers=function(){var e=a.props.view;return e.map&&e.map.layers&&e.map.layers.items||[]},a.renderTOCLayers=function(e){var t=a.props,l=t.view,r=s(t,["view"]);return e.sublayers&&e.sublayers.length?n.createElement(b,i({},r,{scale:l.scale,layer:e,initialChecked:e.visible})):n.createElement(_,i({},r,{scale:l.scale,layer:e,initialChecked:e.visible}))},e.view.ready&&a.initialize(),a}return c(t,e),r(t,[{key:"componentDidUpdate",value:function(){var e=this.props.view;!this.state.loaded&&e.ready&&this.initialize()}},{key:"render",value:function(){var e=this.getLayers(),t=this.props.inlineStyle;return n.createElement("div",{className:"toc",style:t?O.toc:void 0},e.map(this.renderTOCLayers))}}]),t}(e.Component);return k});