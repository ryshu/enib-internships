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
      meta: { title: 'internships.list' },
    },
    {
      path: 'propositions',
      component: () => import('@/views/internships/admin/propositions.vue'),
      name: 'internships.propositions',
      meta: { title: 'internships.propositions', roles: ['admin'] },
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
