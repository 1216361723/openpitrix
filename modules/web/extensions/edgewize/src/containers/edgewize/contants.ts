export const navs = [
  {
    name: '/v2/edgewize/clusters/:cluster/',
    children: [
      { name: 'node-groups', title: 'NODE_GROUP_PL', icon: 'nodes' },
      {
        name: 'nodes',
        title: 'EDGE_NODE_PL',
        icon: 'nodes',
        children: [
          { name: 'nodes', title: 'NODE_ADMINISTRATION_PL' },
          { name: 'fota', title: 'NODE_ACCESS_PL' },
        ],
      },
      { name: 'projects', title: 'PROJECT_PL', icon: 'project' },
      {
        name: 'app-workloads',
        title: 'EDGE_APPLICATION_WORKLOAD_PL',
        icon: 'appcenter',
        children: [
          {
            name: 'deployments',
            title: 'WORKLOAD_PL',
            tabs: [
              { name: 'deployments', title: 'DEPLOYMENT_PL' },
              { name: 'statefulsets', title: 'STATEFULSET_PL' },
              { name: 'daemonsets', title: 'DAEMONSET_PL' },
            ],
          },
          {
            name: 'jobs',
            title: 'JOB_PL',
            tabs: [
              { name: 'jobs', title: 'JOB_PL' },
              { name: 'cronjobs', title: 'CRONJOB_PL' },
            ],
          },
          { name: 'pods', title: 'POD_PL' },
          { name: 'services', title: 'SERVICE_PL' },
        ],
      },
      {
        name: 'config',
        title: 'CONFIGURATION',
        icon: 'hammer',
        children: [
          { name: 'secrets', title: 'SECRET_PL' },
          { name: 'configmaps', title: 'CONFIGMAP_PL' },
        ],
      },
      {
        name: 'network',
        title: 'NETWORK',
        icon: 'earth',
        children: [{ name: 'edgeippool', title: 'POD_IP_POOL_PL' }],
      },
      {
        name: 'monitoring-alerting',
        title: 'EDGE_MONITORING_AND_ALERTING',
        icon: 'monitor',
        children: [
          {
            name: 'resource-usage',
            title: 'RESOURCE_USAGE',
            icon: 'linechart',
            authKey: 'monitoring',
          },
          {
            name: 'alerts',
            title: 'ALERTING_MESSAGE_PL',
            icon: 'loudspeaker',
            authKey: 'monitoring',
          },
          {
            name: 'rule-group',
            title: 'ALERT_RULE_GROUP_PL',
            icon: 'linechart',
            authKey: 'monitoring',
          },
        ],
      },
      {
        name: 'settings',
        title: 'EDGE_CLUSTER_SETTINGS_PL',
        icon: 'cogwheel',
        children: [
          { name: 'base-info', title: 'BASIC_INFORMATION' },
          { name: 'roles', title: 'EDGE_CLUSTER_ROLE' },
          { name: 'members', title: 'EDGE_CLUSTER_MEMBER' },
        ],
      },
    ],
  },
];
