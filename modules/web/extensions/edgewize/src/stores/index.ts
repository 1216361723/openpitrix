import { request } from '@ks-console/shared';

export function editWorkspaceLabels(workspace: string, cluster: string) {
  const url = `/kapis/infra.edgewize.io/v1alpha1/edgeworkspaces/${workspace}/clusters/${cluster}`;
  return request.post(url);
}
