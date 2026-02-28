import React, { CSSProperties } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';

export interface OverlayProps {
  topRight1?: React.ReactNode[];
  topRight2?: React.ReactNode[];
  topLeft1?: React.ReactNode[];
  bottomLeft?: React.ReactNode[];
  bottomRight?: React.ReactNode[];
  blStyle?: CSSProperties;
  refTopRight1?: (node: HTMLDivElement | null) => void;
  refTopRight2?: (node: HTMLDivElement | null) => void;
  refTopLeft1?: (node: HTMLDivElement | null) => void;
  refBottomLeft?: (node: HTMLDivElement | null) => void;
  refBottomRight?: (node: HTMLDivElement | null) => void;
}

export const GeomapOverlay = ({ topRight1, topRight2, topLeft1, bottomLeft, bottomRight, blStyle, refTopRight1, refTopRight2, refTopLeft1, refBottomLeft, refBottomRight }: OverlayProps) => {
  const topRight1Exists = (topRight1 && topRight1.length > 0) ?? false;
  const styles = useStyles2(getStyles(topRight1Exists));
  return (
    <div data-testid="geomap overlay" className={styles.overlay}>
      {/* {Boolean(topRight1?.length) && <div className={styles.TR1}>{topRight1}</div>}
      {Boolean(topLeft1?.length) && <div className={styles.TL1}>{topLeft1}</div>}
      {Boolean(topRight2?.length) && <div className={styles.TR2}>{topRight2}</div>}
      {Boolean(bottomRight?.length) && <div className={styles.BR}>{bottomRight}</div>}
      {Boolean(bottomLeft?.length) && (
        <div className={styles.BL} style={blStyle}>
          {bottomLeft}
        </div>
      )} */}
      <div data-testid="geomap overly tr1" className={styles.TR1} ref={refTopRight1}>{topRight1}</div>
      <div data-testid="geomap overly tr2" className={styles.TR2} ref={refTopRight2}>{topRight2}</div>
      <div data-testid="geomap overly tl1" className={styles.TL1} ref={refTopLeft1}>{topLeft1}</div>
      <div data-testid="geomap overly bl" className={styles.BL} ref={refBottomLeft}>{bottomLeft}</div>
      <div data-testid="geomap overly br" className={styles.BR} ref={refBottomRight}>{bottomRight}</div>
    </div>
  );
};

const getStyles = (topRight1Exists: boolean) => (theme: GrafanaTheme2) => ({
  overlay: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 500,
    pointerEvents: 'none'
  }),
  TL1: css({
    left: '0.5em',
    pointerEvents: 'auto',
    position: 'absolute',
    top: '0.5em',
    maxHeight: "45%",
    display: "inline-flex",
    flexDirection: "column",
    height: "auto",
    width: "auto",
    overflowY: "auto",
    alignSelf: "center",
    paddingRight: "5px",
    paddingLeft: "5px",
    scrollbarWidth: "thin",
    scrollbarGutter: "stable"
  }),
  TR1: css({
    right: '0.5em',
    pointerEvents: 'auto',
    position: 'absolute',
    top: '0.5em',
    display: "inline-flex",
    flexDirection: "column",
    height: "auto",
    width: "auto",
    alignSelf: "center"
  }),
  TR2: css({
    position: 'absolute',
    top: topRight1Exists ? '80px' : '8px',
    right: '8px',
    pointerEvents: 'auto',
    display: "inline-flex",
    flexDirection: "column",
    height: "auto",
    width: "auto",
    alignSelf: "center"
  }),
  BL: css({
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    pointerEvents: 'auto',
    maxHeight: "50%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    display: "inline-flex",
    flexDirection: "column",
    height: "auto",
    width: "auto",
    alignSelf: "center"
  }),
  BR: css({
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    pointerEvents: 'auto',
    maxHeight: "50%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    display: "inline-flex",
    flexDirection: "column",
    height: "auto",
    width: "auto",
    alignSelf: "center",
    scrollbarGutter: "stable"
  }),
});
