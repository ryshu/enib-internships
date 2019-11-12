import request from '@/utils/request';
import { IInternshipTypes } from './types';

export const defaultCategoryData: IInternshipTypes = {
  label: '',
};

export const getCategories = (params?: any) =>
  request({
    url: '/internshipTypes',
    method: 'get',
    params,
  });
