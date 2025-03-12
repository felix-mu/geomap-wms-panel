import { FieldConfig, formattedValueToString, getValueFormat, GrafanaTheme2, ThresholdsMode } from '@grafana/data';
import { VizLegendItem } from '@grafana/ui';

export function getThresholdItems(fieldConfig: FieldConfig, theme: GrafanaTheme2): VizLegendItem[] {
  const items: VizLegendItem[] = [];
  const thresholds = fieldConfig.thresholds;
  if (!thresholds || !thresholds.steps.length) {
    return items;
  }

  // const steps = thresholds.steps;
  // const disp = getValueFormat(thresholds.mode === ThresholdsMode.Percentage ? 'percent' : fieldConfig.unit ?? '');

  // const fmt = (v: number) => formattedValueToString(disp(v));

  // for (let i = 1; i <= steps.length; i++) {
  //   const step = steps[i - 1];
  //   items.push({
  //     label: i === 1 ? `< ${fmt(step.value)}` : `${fmt(step.value)}+`,
  //     color: theme.visualization.getColorByName(step.color),
  //     yAxis: 1,
  //   });
  // }

  // Taken from https://github.com/grafana/grafana/blob/main/public/app/core/components/TimelineChart/utils.ts#L488
  // Do not use the infinity sign
  const steps = thresholds.steps;
  const getDisplay = getValueFormat(
    thresholds.mode === ThresholdsMode.Percentage ? 'percent' : (fieldConfig.unit ?? '')
  );

  // `undefined` value for decimals will use `auto`
  const format = (value: number) => formattedValueToString(getDisplay(value, fieldConfig.decimals ?? undefined));

  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    let value = step.value;
    let pre = '';
    let suf = '';

    if (value === -Infinity && i < steps.length - 1) {
      value = steps[i + 1].value;
      pre = '< ';
    } else {
      suf = '+';
    }

    items.push({
      label: `${pre}${format(value)}${suf}`,
      color: theme.visualization.getColorByName(step.color),
      yAxis: 1,
    });
  }


  return items;
}
