import { css } from '@emotion/react';
import { GrafanaTheme2 } from '@grafana/data';

import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import "bootstrap-icons/font/bootstrap-icons.css";
// Load directly when plugin
import 'static/css/fontmaki2.css';
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

  return css({
    '.ol-scale-line': {
      background: theme.colors.border.weak, // rgba(0,60,136,0.3);
    },
    '.ol-scale-line-inner': {
      border: `1px solid ${theme.colors.text.primary}`, // #eee;
      borderTop: 0, // 0px;
      color: theme.colors.text.primary, //  #eee;
    },
    '.ol-control': {
      backgroundColor: theme.colors.background.primary, // rgba(255,255,255,0.4);
    },
    '.ol-control:hover': {
      backgroundColor: theme.colors.background.secondary, // rgba(255,255,255,0.6);
    },
    '.ol-control button': {
      color: theme.colors.secondary.text, // white;
      backgroundColor: theme.colors.secondary.main, // rgba(0,60,136,0.5);
    },
    '.ol-control button:hover': {
      color: theme.colors.secondary.text,
      backgroundColor: theme.colors.secondary.shade, // rgba(0,60,136,0.5);
    },
    '.ol-control button:focus': {
      color: theme.colors.secondary.text,
      backgroundColor: theme.colors.secondary.main, // rgba(0,60,136,0.5);
    },
    '.ol-attribution ul': {
      color: theme.colors.text.primary, //  #000;
      textShadow: 'none',
    },
    '.ol-attribution:not(.ol-collapsed)': {
      backgroundColor: theme.colors.background.secondary, // rgba(255,255,255,0.8);
    },
    '.ol-control.layer-switcher': {
      top: "0.5em",
      right: "0.5em",
      // textAlign: "right"
      textAlign: "left"
    },
    '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click': {
      paddingRight: "0.5em"
    },
    '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > button': {
      right: 0,
      borderLeft: 0,
    },
    '.ol-control.layer-switcher.shown.layer-switcher-activation-mode-click > .panel': {
      display: 'block',
    },
    '.ol-control.layer-switcher.layer-switcher-activation-mode-click > .panel': {
      display: 'none',
    },
    '.ol-control.layer-switcher button': {
      right: 0,
      borderLeft: 0,
        /* content: url('./img/icons/layers.svg'); */
  /* background-image: url('./img/icons/layers.svg');
  background-repeat: no-repeat; */
  /* https://icons.getbootstrap.com/#usage */
    },
    '.ol-control.layer-switcher li.layer': {
      listStyle: 'none',
    },
    '.layer-switcher li label': {
      paddingLeft: "0.5em",
      /* padding-right: 1.2em; */
      display: "inline-block",
      marginTop: "1px",
    },
    '.data-layer-add': {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    '.data-layer-remove': {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 10,
      marginTop: 10,
    },
    '.ol-custom-overviewmap': {
    /* left: 0.5em; */
    /* bottom: 0.5em; */
    right: "0.5em",
    bottom: "20%",
    padding: "1px"
  },
  '.ol-custom-overviewmap.ol-uncollapsible': {
    bottom: 0,
    left: 0,
    borderRadius: "0 2px 0 0"
  },
  '.ol-custom-overviewmap .ol-overviewmap-map, .ol-custom-overviewmap button': {
    display: "block",
    borderRadius: "4px"
  },
  '.ol-custom-overviewmap .ol-overviewmap-map': {
    border: "1px solid #7b98bc",
    height: "150px",
    margin: "1px",
    width: "150px"
  },
  '.ol-custom-overviewmap:not(.ol-collapsed) button': {
    bottom: "6px",
    left: "6px",
    position: "absolute",
    background: theme.colors.background.secondary
  },
  '.ol-custom-overviewmap:not(.ol-collapsed) button:hover div': {
    color: theme.colors.secondary.text,
    backgroundColor: theme.colors.secondary.shade, // rgba(0,60,136,0.5);
  },
  '.ol-custom-overviewmap.ol-collapsed .ol-overviewmap-map, .ol-custom-overviewmap.ol-uncollapsible button': {
    display: "none"
  },
  '.ol-custom-overviewmap:not(.ol-collapsed)': {
    background: theme.colors.background.secondary
  },
  '.ol-custom-overviewmap .ol-overviewmap-box': {
    border: "2px solid red"
  },
  '.ol-custom-overviewmap .ol-overviewmap-box:hover': {
    cursor: "move"
  }
  });
}
