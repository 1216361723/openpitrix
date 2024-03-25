import React, { useState } from 'react';
import { FilterInput, Button } from '@kubed/components';
import { Refresh } from '@kubed/icons';

import {
  formatTime,
  clusterStore,
  InfiniteScroll,
  ClusterTitle,
  FavoriteHistory,
} from '@ks-console/shared';
import type { FormattedCluster } from '@ks-console/shared';

import {
  Toolbar,
  FilterInputWrapper,
  ButtonsWrapper,
  ListWrapper,
  StyledEntity,
  StyledField,
  ListContainer,
} from './styles';

const { useClusterList } = clusterStore;

interface ClusterSelectorModalProps {
  onSelect: (cluster: FormattedCluster) => void;
}

export default function ClusterSelectorModal({ onSelect }: ClusterSelectorModalProps) {
  const [filteredClusterName, setFilteredClusterName] = useState('');
  const params = {
    name: filteredClusterName || undefined,
  };
  const { isLoading, isLast, formattedClusters, reFetch, refresh, nextPage, clear } =
    useClusterList({
      params: {
        ...params,
        labelSelector: 'cluster-role.kubesphere.io/edge',
      },
      mode: 'infinity',
    });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChange = (value: string) => {
    clear();
    reFetch({ name: value });
    setFilteredClusterName(value);
  };

  const clusters = formattedClusters.map((cluster: any) => {
    const { name, nodeCount, kubernetesVersion, provider, createTime } = cluster;
    const fields = [
      {
        value: nodeCount ?? '-',
        label: t('NODE_COUNT'),
      },
      {
        value: kubernetesVersion ?? '-',
        label: t('KUBERNETES_VERSION'),
      },
      {
        value: provider ?? '-',
        label: t('PROVIDER'),
        className: 'field-provider',
      },
      {
        value: createTime ? formatTime(createTime) : '-',
        label: t('CREATION_TIME'),
      },
    ];

    return (
      <StyledEntity key={name} hoverable onClick={() => onSelect(cluster)}>
        <ClusterTitle className="field-main-title" cluster={cluster} />
        {fields.map((props, index) => (
          <StyledField key={index} {...props} />
        ))}
        <FavoriteHistory
          user={globals.user.username}
          item={{
            id: cluster.uid,
            name: cluster.name,
            url: `/clusters/${cluster.name}/overview`,
            type: 'Cluster',
            isHost: cluster.isHost,
          }}
        />
      </StyledEntity>
    );
  });

  return (
    <>
      <Toolbar>
        <FilterInputWrapper>
          <FilterInput
            simpleMode
            placeholder={t('SEARCH_BY_NAME')}
            onChange={value => {
              if (filteredClusterName !== value) {
                handleChange(value);
              }
            }}
            onClear={() => {
              handleChange('');
            }}
          />
        </FilterInputWrapper>
        <ButtonsWrapper>
          <Button
            variant="text"
            onClick={() => {
              // TODO: temp mock
              setIsRefreshing(true);
              refresh();
              window.setTimeout(() => setIsRefreshing(false), 500);
            }}
          >
            <Refresh size={16} />
          </Button>
        </ButtonsWrapper>
      </Toolbar>
      <ListWrapper>
        <ListContainer>
          <InfiniteScroll
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            hasNextPage={!isLast}
            isEmpty={formattedClusters.length === 0}
            classNames={{
              container: 'ks-InfiniteScroll-container',
              content: 'ks-InfiniteScroll-content',
            }}
            onLoadMore={nextPage}
          >
            {clusters}
          </InfiniteScroll>
        </ListContainer>
      </ListWrapper>
    </>
  );
}
