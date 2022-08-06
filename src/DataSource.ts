import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import _ from 'lodash';
import defaults from 'lodash/defaults';
import { defaultQuery, NiagaraDataSourceOptions, NiagaraQuery } from './types';

export class DataSource extends DataSourceApi<NiagaraQuery, NiagaraDataSourceOptions> {
  baseUrl: string;

  constructor(instanceSettings: DataSourceInstanceSettings<NiagaraDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
  }

  async query(options: DataQueryRequest<NiagaraQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(async (target) => {
      const query = defaults(target, defaultQuery);
      const ord = [query.base || 'station:|slot:/', query.query].join('|');
      const res = await this.request('/grafana/query', `ord=${ord}`);
      const columns = res.data.result.columns;
      const rows = res.data.result.rows;
      const typeMap: Record<string, FieldType> = {
        'baja:String': FieldType.string,
        'baja:Double': FieldType.number,
        'baja:Boolean': FieldType.boolean,
        'baja:AbsTime': FieldType.time,
      };
      const fields = columns.map((col: any) => ({
        name: col.displayName,
        type: typeMap[col.type] ?? FieldType.other,
        values: rows.map((row: any) => row[col.name]),
      }));
      return new MutableDataFrame({
        refId: query.refId,
        fields,
      });
    });
    return Promise.all(promises).then((data) => ({ data }));
  }

  async request(url: string, params?: string) {
    return getBackendSrv().datasourceRequest({
      url: `${this.baseUrl}${url}${params?.length ? `?${params}` : ''}`,
    });
  }

  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';
    try {
      const response = await this.request('/grafana/');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err: any) {
      if (_.isString(err)) {
        return {
          status: 'error',
          message: err,
        };
      } else {
        let message = '';
        message += err.statusText ? err.statusText : defaultErrorMessage;
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }

        return {
          status: 'error',
          message,
        };
      }
    }
  }
}
