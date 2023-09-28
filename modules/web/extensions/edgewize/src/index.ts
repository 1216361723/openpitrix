import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'topbar',
  name: 'edgewize',
  title: 'edgewize-io',
  icon: 'cluster',
  order: 0,
  desc: '边缘计算',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);
