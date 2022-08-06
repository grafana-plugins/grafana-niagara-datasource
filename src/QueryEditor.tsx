import React, { FC, ChangeEvent } from 'react';
import { Button, InlineField, Input, TextArea, VerticalGroup } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, NiagaraDataSourceOptions, NiagaraQuery } from './types';
import defaults from 'lodash/defaults';

type Props = QueryEditorProps<DataSource, NiagaraQuery, NiagaraDataSourceOptions>;

export const QueryEditor: FC<Props> = function ({ onChange, query, onRunQuery }) {
  const q = defaults(query, defaultQuery);

  function onBaseChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ ...q, base: event.target.value });
  }

  function onOrdChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({ ...q, query: event.target.value });
  }

  return (
    <VerticalGroup>
      <InlineField label="base" grow required>
        <Input placeholder="base ord" value={q.base} onChange={onBaseChange} css />
      </InlineField>
      <InlineField label="query" grow required>
        <TextArea placeholder="query ord" value={q.query} onChange={onOrdChange} css />
      </InlineField>
      <Button onClick={() => onRunQuery()}>Query</Button>
    </VerticalGroup>
  );
};
