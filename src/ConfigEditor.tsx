import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings } from '@grafana/ui';
import React, { FC } from 'react';
import { NiagaraDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<NiagaraDataSourceOptions> {}

export const ConfigEditor: FC<Props> = ({ onOptionsChange, options }) => {
  return (
    <DataSourceHttpSettings defaultUrl="http://localhost:8080" dataSourceConfig={options} onChange={onOptionsChange} />
  );
};
