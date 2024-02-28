import React from 'react';
import { WorkspaceLayout, WorkspaceListLayout } from '@ks-console/shared';

import BindLabels from '../containers/BindLabels';
import StoreManage from '../containers/StoreManage';
import AppDetails from '../containers/AppDetail/routes';

export default [
  {
    path: '/',
    element: <WorkspaceLayout />,
    children: [
      {
        path: 'workspaces/:workspace',
        element: <WorkspaceListLayout />,
        children: [
          {
            path: 'edge-templates',
            element: <StoreManage />,
          },
          {
            path: 'edge-setting',
            element: <BindLabels />,
          },
        ],
      },
      ...AppDetails('/workspaces/:workspace/edge-templates'),
    ],
  },
];
