import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'global',
  name: 'apps-manage',
  title: 'APP_STORE_MANAGEMENT',
  icon: 'openpitrix',
  order: 2,
  desc: 'APP_STORE_MANAGEMENT_DESC',
  ksModule: 'openpitrix',
  authKey: 'manage-app',
  authAction: 'manage',
};

const globalApps = {
  parent: 'topbar',
  name: 'jsjk-apps',
  title: '江苏交控应用商店',
  icon: 'cluster',
  order: 0,
  desc: '边缘计算',
  skipAuth: true,
};

const workspaceAppManage = {
  parent: 'workspace.apps',
  name: 'app-templates',
  title: 'APP_TEMPLATE_PL',
  icon: 'appcenter',
  order: 0,
  authKey: 'app-templates',
};

const extensionConfig = {
  routes,
  menus: [menu, globalApps, workspaceAppManage],
  locales,
};

globals.context.registerExtension(extensionConfig);
