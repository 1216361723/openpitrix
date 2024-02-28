import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'global',
  name: 'v2/edgewize',
  title: 'edgewize-io',
  icon: 'cluster',
  order: 0,
  desc: 'EDGEWIZE_COMPUTING',
  ksModule: 'openpitrix',
  authKey: 'manage-app',
  authAction: 'manage',
};

const workspaceAppManageMenu = {
  parent: 'workspace',
  name: 'edge-management',
  title: 'EDGEWIZE_MANAGEMENT',
  icon: 'appcenter',
  order: 3,
  desc: 'EDGEWIZE_PROJECT_SETTING',
  skipAuth: true,
  children: [
    {
      name: 'edge-templates',
      title: 'EDGEWIZE_TEMPLATE',
      icon: 'appcenter',
      order: 0,
      authKey: 'app-templates',
    },
    {
      name: 'edge-setting',
      title: 'EDGEWIZE_LABELS_SETTING',
      icon: 'appcenter',
      skipAuth: true,
    },
  ],
};

const projectAppManageMenu = {
  parent: 'project.app-workloads',
  name: 'edge-management',
  title: 'EDGEWIZE_MANAGEMENT',
  icon: 'appcenter',
  order: 1,
  desc: 'EDGEWIZE_PROJECT_SETTING',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu, workspaceAppManageMenu, projectAppManageMenu],
  locales,
  isCheckLicense: true,
};

export default extensionConfig;
