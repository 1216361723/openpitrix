import { request } from '@ks-console/shared';

export function editWorkspaceLabels(workspace: string, cluster: string) {
  const url = `/kapis/infra.edgewize.io/v1alpha1/edgeworkspaces/${workspace}/clusters/${cluster}`;
  return request.post(url);
}

export function getClustersRole(cluster: string) {
  const url = `/kapis/clusters/${cluster}/iam.kubesphere.io/v1alpha2/clustermembers/admin/clusterroles`;
  return request.get(url);
}
