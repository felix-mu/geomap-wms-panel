import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

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
    .ol-scale-line {
    background: ${theme.colors.border.weak}; /* rgba(0,60,136,0.3); */
  }

  .ol-scale-line-inner {
    border: 1px solid ${theme.colors.text.primary}; /* #eee; */
    border-top: 0;
    color: ${theme.colors.text.primary}; /* #eee; */
  }

  .ol-control {
    background-color: ${theme.colors.background.primary}; /* rgba(255,255,255,0.4); */
  }

  .ol-control:hover {
    background-color: ${theme.colors.background.secondary}; /* rgba(255,255,255,0.6); */
  }

  .ol-control button {
    color: ${theme.colors.secondary.text}; /* white; */
    background-color: ${theme.colors.secondary.main}; /* rgba(0,60,136,0.5); */
  }

  .ol-control button:hover {
    color: ${theme.colors.secondary.text};
    background-color: ${theme.colors.secondary.shade}; /* rgba(0,60,136,0.5); */
  }

  .ol-control button:focus {
    color: ${theme.colors.secondary.text};
    background-color: ${theme.colors.secondary.main}; /* rgba(0,60,136,0.5); */
  }

  .ol-attribution ul {
    color: ${theme.colors.text.primary}; /* #000; */
    text-shadow: none;
  }

  .ol-attribution:not(.ol-collapsed) {
    background-color: ${theme.colors.background.secondary}; /* rgba(255,255,255,0.8); */
  }

  .ol-control.layer-switcher {
    top: 0.5em;
    right: 0.5em;
    text-align: left;
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
    /* content: url('./img/icons/layers.svg'); */
    /* background-image: url('./img/icons/layers.svg');
      background-repeat: no-repeat; */
    /* https://icons.getbootstrap.com/#usage */
  }

  .ol-control.layer-switcher li.layer {
    list-style: none;
  }

  .layer-switcher li label {
    padding-left: 0.5em;
    display: inline-block;
    margin-top: 1px;
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
