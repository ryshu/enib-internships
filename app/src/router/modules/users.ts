import Layout from '../../layout/index.vue';

const usersRouter = {
  path: '/users',
  component: Layout,
  redirect: '/users/students',
  name: 'users.title',
  meta: {
    roles: ['admin'],
    title: 'users.title',
    icon: 'user',
  },
  children: [
    {
      path: 'students',
      component: () => import('@/views/students/index.vue'),
      name: 'users.students',
      meta: { title: 'users.students' },
    },
    {
      path: 'mentors',
      component: () => import('@/views/mentors/index.vue'),
      name: 'users.mentors',
      meta: { title: 'users.mentors' },
    },
  ],
};
export default usersRouter;
