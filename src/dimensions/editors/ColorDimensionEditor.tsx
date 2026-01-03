import { css } from '@emotion/css';
import React, { FC, useCallback } from 'react';

import { GrafanaTheme2, StandardEditorProps,SelectableValue } from '@grafana/data';
import { Combobox, ColorPicker, useStyles2, ComboboxOption } from '@grafana/ui';
import { useFieldDisplayNames, useSelectOptions } from './utils';

import { ColorDimensionConfig } from '../types';

const fixedColorOption: SelectableValue<string> = {
  label: 'Fixed color',
  value: '_____fixed_____',
};

export const ColorDimensionEditor: FC<StandardEditorProps<ColorDimensionConfig, any, any>> = (props) => {
  const { value, context, onChange } = props;

  const defaultColor = 'dark-green';

  const styles = useStyles2(getStyles);
  const fieldName = value?.field;
  const isFixed = Boolean(!fieldName);
  const names = useFieldDisplayNames(context.data);
  const selectOptions = useSelectOptions(names, fieldName, fixedColorOption);

  const onSelectChange = useCallback(
    (selection: ComboboxOption<string>) => {
      const field = selection.value;
      if (field && field !== fixedColorOption.value) {
        onChange({
          ...value,
          field,
        });
      } else {
        const fixed = value?.fixed ?? defaultColor;
        onChange({
          ...value,
          field: undefined,
          fixed,
        });
      }
    },
    [onChange, value]
  );

  const onColorChange = useCallback(
    (c: string) => {
      onChange({
        field: undefined,
        fixed: c ?? defaultColor,
      });
    },
    [onChange]
  );

  const selectedOption = isFixed ? fixedColorOption : selectOptions.find((v) => v.value === fieldName);
  return (
    <>
      <div className={styles.container}>
        <Combobox
          value={selectedOption as ComboboxOption<string>}
          options={selectOptions as Array<ComboboxOption<string>>}
          onChange={onSelectChange}
        />
        {isFixed && (
          <div className={styles.picker}>
            <ColorPicker color={value?.fixed ?? defaultColor} onChange={onColorChange} enableNamedColors={true} />
          </div>
        )}
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
  `,
  picker: css`
    padding-left: 8px;
  `,
});
