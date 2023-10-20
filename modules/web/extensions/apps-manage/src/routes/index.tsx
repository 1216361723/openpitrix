import React from 'react';
import { Navigate } from 'react-router-dom';

import { AuditRecords, InstanceList, AppInformation } from '@ks-console/shared';

import Reviews from '../containers/Reviews';
import StoreManage from '../containers/StoreManage';
import ListLayout from '../containers/Base/ListLayout';
import AppDetailPage from '../containers/AppDetailPage';
import CategoriesManage from '../containers/CategoriesManage';
import RepoManage from '../containers/RepoManage';
import ApplicationManage from '../containers/AppInstanceManage';
import VersionList from '../containers/AppDetailPage/VersionList';

const PATH = '/apps-manage';

export default [
  {
    path: PATH,
    element: <ListLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="store" replace />,
      },
      {
        path: 'store',
        element: <StoreManage />,
      },
      {
        path: 'categories',
        element: <CategoriesManage />,
      },
      {
        path: 'reviews',
        element: <Reviews />,
        children: [
          {
            index: true,
            element: <Navigate to="unprocessed" />,
          },
          {
            path: ':type',
            element: <></>,
          },
        ],
      },
      {
        path: 'repo',
        element: <RepoManage />,
      },
      {
        path: 'app_instance',
        element: <ApplicationManage />,
      },
    ],
  },
  {
    path: '/apps-manage/store/:appName',
    element: <AppDetailPage />,
    children: [
      {
        index: true,
        element: <Navigate to="versions" replace />,
      },
      {
        path: 'versions',
        element: <VersionList />,
      },
      {
        path: 'app-information',
        element: <AppInformation />,
      },
      {
        path: 'audit-records',
        element: <AuditRecords />,
      },
      {
        path: 'app-instances',
        element: <InstanceList />,
      },
    ],
  },
];
