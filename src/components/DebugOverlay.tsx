import React, { useEffect, useState } from 'react';
import { Map } from 'ol';
import { transform } from 'ol/proj';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
// import { config } from '../config';
import tinycolor from 'tinycolor2';
import { Coordinate } from 'ol/coordinate';
import { useStyles2 } from '@grafana/ui';

interface Props {
  map: Map;
}

interface DebugOverlayState {
  zoom?: number;
  center: Coordinate;
}

export function DebugOverlay({ map }: Props) {
  const style = useStyles2(getStyles);
  const [debugOverlayState, setDebugOverlayState] = useState<DebugOverlayState>({ zoom: 0, center: [0, 0] });

  useEffect(() => {
    const updateViewState = () => {
      const view = map.getView();
      setDebugOverlayState({
        zoom: view.getZoom(),
        center: transform(view.getCenter()!, view.getProjection(), 'EPSG:4326'),
      });
    };
    map.on('moveend', updateViewState);
    updateViewState();
  }, [map]);

  return (
      <div className={style.infoWrap}>
        <table>
          <tbody>
            <tr>
              <th>Zoom:</th>
              <td>{debugOverlayState.zoom?.toFixed(1)}</td>
            </tr>
            <tr>
              <th>Center:&nbsp;</th>
              <td>
                {debugOverlayState.center[0].toFixed(5)}, {debugOverlayState.center[1].toFixed(5)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}

// interface State {
//   zoom?: number;
//   center: Coordinate;
// }

// export class DebugOverlay extends PureComponent<Props, State> {
//   style = useStyles2(getStyles);

//   constructor(props: Props) {
//     super(props);
//     this.state = { zoom: 0, center: [0, 0] };
//   }

//   updateViewState = () => {
//     const view = this.props.map.getView();
//     this.setState({
//       zoom: view.getZoom(),
//       center: transform(view.getCenter()!, view.getProjection(), 'EPSG:4326'),
//     });
//   };

//   componentDidMount() {
//     this.props.map.on('moveend', this.updateViewState);
//     this.updateViewState();
//   }

//   render() {
//     const { zoom, center } = this.state;

//     return (
//       <div className={this.style.infoWrap}>
//         <table>
//           <tbody>
//             <tr>
//               <th>Zoom:</th>
//               <td>{zoom?.toFixed(1)}</td>
//             </tr>
//             <tr>
//               <th>Center:&nbsp;</th>
//               <td>
//                 {center[0].toFixed(5)}, {center[1].toFixed(5)}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// }

const getStyles = (theme: GrafanaTheme2) => ({
  infoWrap: css`
    color: ${theme.colors.text};
    background: ${tinycolor(theme.colors.background.primary).setAlpha(0.7).toString()};
    border-radius: 2px;
    padding: 8px;
  `,
});
