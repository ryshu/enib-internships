import Layout from '../../layout/index.vue';

const campaignsRouter = {
  path: '/campaigns',
  component: Layout,
  redirect: '/campaigns/dashboard',
  name: 'campaigns.title',
  hidden: true,
  meta: {
    title: 'campaigns.title',
    icon: 'el-icon-box',
    isCampaign: true,
    roles: ['admin', 'default'],
  },
  children: [
    {
      path: 'dashboard/:id(\\w+)',
      component: () => import('@/views/campaigns/dashboard.vue'),
      name: `campaigns.dashboard`,
      meta: {
        title: 'campaigns.dashboard',
        noCache: true,
        roles: ['default', 'admin'],
      },
    },
    {
      path: 'internships/:id(\\w+)',
      component: () => import('@/views/campaigns/internships.vue'),
      name: `campaigns.internships`,
      meta: {
        title: 'campaigns.internships',
        noCache: true,
        roles: ['default', 'admin'],
      },
    },
    {
      path: 'students/:id(\\w+)',
      component: () => import('@/views/campaigns/students.vue'),
      name: `campaigns.students`,
      meta: {
        title: 'campaigns.students',
        noCache: true,
        roles: ['default', 'admin'],
      },
    },
    {
      path: 'mentors/:id(\\w+)',
      component: () => import('@/views/campaigns/admin/mentors.vue'),
      name: `campaigns.mentors`,
      meta: { title: 'campaigns.mentors', noCache: true, roles: ['admin'] },
    },
    {
      path: 'propositions/:id(\\w+)',
      component: () => import('@/views/campaigns/propositions.vue'),
      name: `campaigns.propositions`,
      meta: {
        title: 'campaigns.propositions',
        noCache: true,
        roles: ['default', 'admin'],
      },
    },
    {
      path: 'settings/:id(\\w+)',
      component: () => import('@/views/campaigns/settings.vue'),
      name: `campaigns.settings`,
      meta: { title: 'campaigns.settings', noCache: true, roles: ['admin'] },
    },
    {
      path: 'new',
      component: () => import('@/views/campaigns/new.vue'),
      name: `campaigns.new`,
      meta: { title: 'campaigns.new', noCache: true, roles: ['admin'] },
    },
  ],
};
export default campaignsRouter;
