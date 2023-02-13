import type { App } from 'vue'
import fileRoutes from '~pages'
import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router'

fileRoutes.push({
	path: '/',
	meta: {
		layout: 'file'
	},
	component: () => import('~/pages/file.vue')
},
// 保留未简化的路径
// {
// 	path: '/:storageKey/:fullpath(.*)*',
// 	meta: {
// 		layout: 'file'
// 	},
// 	props: true,
// 	component: () => import('~/pages/file.vue')
// }
{
  path: '/:storageKey/:fullpath(.*)*',
  meta: {
    layout: 'file_simple'
  },
  props: true,
  component: () => import('~/pages/file_simple.vue')
}
);

let routes = setupLayouts(fileRoutes);
// admin
routes.push({
  path: '/admin',
  redirect: '/admin/site-setting'
});

// onlyOffice 预览
routes.push({
	path: '/only-office-preview-page',
	redirect: '/only-office-preview/OfficeViewer'
});

export const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

export default (app: App) => app.use(router)
