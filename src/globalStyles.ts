import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'static/css/fontmaki2.css'; // Are handled in the webpack.config file and are copied anyways
import 'static/css/fontmaki.css';

/**
 * Will be loaded *after* the css above
 */
export function getGlobalStyles(theme: GrafanaTheme2) {
  // NOTE: this works with
  //  node_modules/ol/ol.css
  // use !important;
  // This file keeps the rules

  // .ol-box {
  //   border: 2px solid blue;
  // }

  // .ol-scale-step-marker {
  //   background-color: #000000;
  // }
  // .ol-scale-step-text {
  //   color: #000000;
  //   text-shadow: -2px 0 #FFFFFF, 0 2px #FFFFFF, 2px 0 #FFFFFF, 0 -2px #FFFFFF;
  // }
  // .ol-scale-text {
  //   color: #000000;
  //   text-shadow: -2px 0 #FFFFFF, 0 2px #FFFFFF, 2px 0 #FFFFFF, 0 -2px #FFFFFF;
  // }
  // .ol-scale-singlebar {
  //   border: 1px solid black;
  // }
  // .ol-viewport, .ol-unselectable {
  //   -webkit-tap-highlight-color: rgba(0,0,0,0);
  // }

  // .ol-overviewmap .ol-overviewmap-map {
  //   border: 1px solid #7b98bc;
  // }
  // .ol-overviewmap:not(.ol-collapsed) {
  //   background: rgba(255,255,255,0.8);
  // }
  // .ol-overviewmap-box {
  //   border: 2px dotted rgba(0,60,136,0.7);
  // }

  return css`
  position: 'relative'
  height: 100%

.ol-scale-line {
  background:${theme.colors.border.weak};
}

.ol-scale-line-inner {
  border: 1px solid ${theme.colors.text.primary};
  border-top: 0;
  color: ${theme.colors.text.primary};
}

.ol-control {
  background-color: ${theme.colors.background.primary};
}

.ol-control:hover {
  background-color: ${theme.colors.background.secondary};
}

.ol-control button {
  color: ${theme.colors.secondary.text};
  background-color: ${theme.colors.secondary.main};
}

.ol-control button:hover {
  color: ${theme.colors.secondary.text};
  background-color: ${theme.colors.secondary.shade};
}

.ol-control button:focus {
  color: ${theme.colors.secondary.text};
  background-color: theme.colors.secondary.main;
}

.ol-attribution ul {
  color: ${theme.colors.text.primary};
  text-shadow: none;
}

.ol-attribution:not(.ol-collapsed) {
  background-color: ${theme.colors.background.secondary};
}

.ol-control.layer-switcher {
  top: 0.5em;
  right: 0.5em;
  text-align: right;
}

.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click {
  padding-right: 0.5em;
}

.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > button {
  right: 0;
  border-left: 0;
}

.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > .panel {
  display: block;
}

.ol-control.layer-switcher.layer-switcher-activation-mode-click > .panel {
  display: none;
}

.ol-control.layer-switcher button {
  right: 0;
  border-left: 0;
}

.ol-control.layer-switcher li.layer {
  list-style: none;
}

.data-layer-add {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.data-layer-remove {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-top: 10px;
}

`
}

//     return css({
//     '.ol-scale-line': {
//       background: theme.colors.border.weak,
//     },
//     '.ol-scale-line-inner': {
//       border: `1px solid ${theme.colors.text.primary}`,
//       borderTop: 0,
//       color: theme.colors.text.primary,
//     },
//     '.ol-control': {
//       backgroundColor: theme.colors.background.primary,
//     },
//     '.ol-control:hover': {
//       backgroundColor: theme.colors.background.secondary,
//     },
//     '.ol-control button': {
//       color: theme.colors.secondary.text,
//       backgroundColor: theme.colors.secondary.main,
//     },
//     '.ol-control button:hover': {
//       color: theme.colors.secondary.text,
//       backgroundColor: theme.colors.secondary.shade,
//     },
//     '.ol-control button:focus': {
//       color: theme.colors.secondary.text,
//       backgroundColor: theme.colors.secondary.main,
//     },
//     '.ol-attribution ul': {
//       color: theme.colors.text.primary,
//       textShadow: 'none',
//     },
//     '.ol-attribution:not(.ol-collapsed)': {
//       backgroundColor: theme.colors.background.secondary,
//     },
//     '.ol-control.layer-switcher': {
//       top: '0.5em',
//       right: '0.5em',
//       textAlign: 'right',
//     },
//     '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click': {
//       paddingRight: '0.5em',
//     },
//     '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > button': {
//       right: 0,
//       borderLeft: 0,
//     },
//     '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > .panel': {
//       display: 'block',
//     },
//     '.ol-control.layer-switcher.layer-switcher-activation-mode-click > .panel': {
//       display: 'none',
//     },
//     '.ol-control.layer-switcher button': {
//       right: 0,
//       borderLeft: 0,
//     },
//     '.ol-control.layer-switcher li.layer': {
//       listStyle: 'none',
//     },
//     '.data-layer-add': {
//       display: 'flex',
//       justifyContent: 'flex-end',
//       marginBottom: 10,
//     },
//     '.data-layer-remove': {
//       display: 'flex',
//       justifyContent: 'flex-end',
//       marginBottom: 10,
//       marginTop: 10,
//     },
//     // position: 'relative', // very important: for OL absolute controls
//   });
// }
