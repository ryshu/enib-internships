import Layout from '../../layout/index.vue';

const internshipsRouter = {
  path: '/internships',
  component: Layout,
  redirect: '/internships/list',
  name: 'internships.title',
  meta: {
    title: 'internships.title',
    icon: 'list',
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/internships/list.vue'),
      name: 'internships.list',
      meta: { title: 'internships.list', roles: ['student', 'default'] },
    },
    {
      path: 'waiting',
      component: () => import('@/views/internships/admin/waiting.vue'),
      name: 'internships.waiting',
      meta: { title: 'internships.waiting' },
    },
    {
      path: 'published',
      component: () => import('@/views/internships/admin/published.vue'),
      name: 'internships.published',
      meta: { title: 'internships.published', roles: ['admin'] },
    },
    {
      path: 'mentored',
      component: () => import('@/views/internships/mentored.vue'),
      name: 'internships.mentored',
      meta: { title: 'internships.mentored', roles: ['default', 'admin'] },
    },
    {
      path: 'favourites',
      component: () => import('@/views/internships/student/favourites.vue'),
      name: 'internships.favourites',
      meta: { title: 'internships.favourites', roles: ['student'] },
    },
    {
      path: 'suggest',
      component: () => import('@/views/internships/suggest.vue'),
      name: 'internships.suggest',
      meta: { title: 'internships.suggest', roles: ['student', 'default'] },
    },
    {
      path: 'new',
      component: () => import('@/views/internships/suggest.vue'),
      name: 'internships.new',
      meta: { title: 'internships.new', roles: ['admin'] },
    },
  ],
};
export default internshipsRouter;
