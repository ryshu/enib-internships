import request from '@/utils/request';

export const getProfile = () =>
  request({
    url: '/cas/profile',
    method: 'get',
  });
