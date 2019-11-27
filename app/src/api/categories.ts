import request from '@/utils/request';
import { IInternshipTypeEntity } from '../declarations';

export const defaultCategoryData: IInternshipTypeEntity = {
  label: '',
};

export const getCategories = (params?: any) =>
  request({
    url: '/internshipTypes',
    method: 'get',
    params,
  });
