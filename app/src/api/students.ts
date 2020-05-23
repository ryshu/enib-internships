import request from '@/utils/request';
import { IStudentEntity, PaginateList } from '../declarations';

export const defaultStudentData: IStudentEntity = {
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  semester: 'S1',
};

export const getStudents = (params: any) =>
  (request({
    url: '/students',
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IStudentEntity>>;

export const getStudent = (id: number) =>
  (request({
    url: `/students/${id}`,
    method: 'get',
  }) as any) as Promise<IStudentEntity>;

export const createStudent = (data: IStudentEntity) =>
  (request({
    url: '/students',
    method: 'post',
    data,
  }) as any) as Promise<IStudentEntity>;

export const updateStudent = (id: number, data: Partial<IStudentEntity>) =>
  (request({
    url: `/students/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<IStudentEntity>;

export const deleteStudent = (id: number) =>
  (request({
    url: `/students/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;

export const getCampaignStudents = (id: number, params: any) =>
  (request({
    url: `/campaigns/${id}/students`,
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IStudentEntity>>;
