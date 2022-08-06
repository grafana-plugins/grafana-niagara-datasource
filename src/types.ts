import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface NiagaraQuery extends DataQuery {
  base: string;
  query: string;
}

export const defaultQuery: Partial<NiagaraQuery> = {
  base: 'station:|slot:/',
  query: 'bql:select * from control:NumericPoint',
};

/**
 * These are options configured for each DataSource instance
 */
export interface NiagaraDataSourceOptions extends DataSourceJsonData {}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface NiagaraSecureJsonData {}
