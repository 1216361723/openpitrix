import React from 'react';
import { WorkspaceLayout, WorkspaceListLayout } from '@ks-console/shared';
import edgewizeRoute from '../containers/edgewize/routes';
import BindLabels from '../containers/BindLabels';
import StoreManage from '../containers/StoreManage';
import AppDetails from '../containers/AppDetail/routes';

export default [
  ...edgewizeRoute,
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
