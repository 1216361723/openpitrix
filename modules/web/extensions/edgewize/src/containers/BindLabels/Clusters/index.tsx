import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Cluster } from '@kubed/icons';
import { Card, notify, Loading, Button } from '@kubed/components';
import {
  FormattedCluster,
  isMultiCluster,
  workspaceStore,
  clusterStore,
  Panel,
  hasPermission,
} from '@ks-console/shared';
import ClusterCard from './Card';
import BindClusterModal from '../BindCluster';
import { editWorkspaceLabels } from '../../../stores';
import { EmptyWrapper } from './styles';

const { useFetchWorkspaceQuery } = workspaceStore;
const { useQueryWorkspaceClusters } = clusterStore;
function Clusters() {
  const { workspace = '' } = useParams<{ workspace: string }>();
  const enabledActions = hasPermission({
    module: 'edge-workspaces',
    workspace,
    action: 'manage',
  });
  const { data: clusters, isLoading } = useQueryWorkspaceClusters(workspace);

  const edgeClusters = clusters?.filter(
    (item: { provider: string }) => item.provider === 'EdgeWize',
  );
  const [visible, setVisible] = useState(false);
  const [isEdgewize, setIsEdgewize] = useState(false);
  const { data: workspaces } = useFetchWorkspaceQuery({
    workspace,
  });

  async function fetch() {
    // @ts-ignore
    const labels = workspaces?.metadata?.labels?.['cluster-role.kubesphere.io/edge'];
    setIsEdgewize(!!labels);
  }

  useEffect(() => {
    if (workspaces) {
      fetch();
    }
  }, [workspaces]);

  function handleModeChange(val: { cluster: string }) {
    editWorkspaceLabels(workspace as string, val.cluster).then(() => {
      notify.success(t('SETTING_OK'));
      setVisible(false);
    });
  }
  if (!isMultiCluster()) {
    return null;
  }

  if (isLoading) {
    return <Loading className="page-loading" />;
  }
  if (isEmpty(edgeClusters)) {
    return (
      <Card>
        <EmptyWrapper
          image={<Cluster size={48} />}
          title={t('NO_EDGEWIZE_CLUSTER_AVAILABLE')}
          description={t('WORKSPACE_NO_CLUSTER_TIP')}
        />
      </Card>
    );
  }

  return (
    <>
      <Panel loading={isLoading} title={t('EDGEWIZE_CLUSTER_INFO')}>
        <div>
          {enabledActions && (
            <Button disabled={isEdgewize} color="secondary" onClick={() => setVisible(true)}>
              {t('EDGEWIZE_CLUSTER_SETTING')}
            </Button>
          )}
        </div>
        {edgeClusters?.map((cluster: FormattedCluster) => (
          <ClusterCard key={cluster.name} cluster={cluster} />
        ))}
      </Panel>
      <BindClusterModal
        onOk={handleModeChange}
        onCancel={() => setVisible(false)}
        visible={visible}
        data={edgeClusters}
      />
    </>
  );
}

export default Clusters;
