import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './ConfigEditor';
import { DataSource } from './DataSource';
import { QueryEditor } from './QueryEditor';
import { NiagaraDataSourceOptions, NiagaraQuery } from './types';

export const plugin = new DataSourcePlugin<DataSource, NiagaraQuery, NiagaraDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
