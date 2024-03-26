import React from 'react';
import Edgewize from './embed';
import EdgewizeLayout from './layout';
import ListLayout from './ListLayout';

const edgewizeRoute = [
  {
    path: '/v2/edgewize',
    element: <EdgewizeLayout />,
    children: [
      {
        index: true,
        element: <Edgewize />,
      },
      {
        path: 'clusters/:cluster/nodes/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        path: 'clusters/:cluster/edgeippool/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        path: 'clusters/:cluster/roles/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        path: 'clusters/:cluster/projects/:namespace/:type',
        element: <EdgewizeLayout />,
        children: [
          {
            index: true,
            element: <Edgewize />,
          },
          {
            path: '*',
            element: <Edgewize />,
          },
        ],
      },
    ],
  },
  {
    path: '/v2/edgewize',
    element: <EdgewizeLayout />,
    children: [
      {
        index: true,
        path: 'clusters/:cluster/nodes/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        index: true,
        path: 'clusters/:cluster/edgeippool/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        index: true,
        path: 'clusters/:cluster/roles/*',
        exact: true,
        element: <Edgewize />,
      },
      {
        path: 'clusters/:cluster/projects/:namespace/:type',
        element: <EdgewizeLayout />,
        children: [
          {
            index: true,
            element: <Edgewize />,
          },
          {
            path: '*',
            element: <Edgewize />,
          },
        ],
      },
    ],
  },
  {
    path: '/v2/edgewize/clusters/:cluster',
    element: <ListLayout />,
    children: [
      {
        index: true,
        path: 'nodes',
        exact: true,
        element: <Edgewize />,
      },
      {
        index: true,
        path: 'edgeippool',
        exact: true,
        element: <Edgewize />,
      },
      {
        index: true,
        path: 'roles',
        exact: true,
        element: <Edgewize />,
      },
      {
        path: '*',
        element: <Edgewize />,
      },
    ],
  },
  {
    path: '/node-groups',
    element: <EdgewizeLayout />,
    children: [
      {
        index: true,
        element: <Edgewize />,
      },
      {
        path: '*',
        element: <Edgewize />,
      },
    ],
  },
  {
    path: '/workspaces/:workspace/v2/edgewize',
    element: <EdgewizeLayout />,
    children: [
      {
        index: true,
        element: <Edgewize />,
      },
      {
        path: '*',
        element: <Edgewize />,
      },
    ],
  },
  {
    path: 'clusters/:cluster/projects/:namespace/:type/:id',
    element: <EdgewizeLayout />,
    children: [
      {
        index: true,
        element: <Edgewize />,
      },
      {
        path: '*',
        element: <Edgewize />,
      },
    ],
  },
];

export default edgewizeRoute;
