import { paginate } from '../../../../src/api/helpers/pagination.helper';

describe('paginate', () => {
    it('paginate_Page0_EmptyObject', () => {
        expect(paginate({ page: 0, limit: 20 })).toEqual({});
    });

    it('paginate_Limit0_EmptyObject', () => {
        expect(paginate({ page: 13, limit: 0 })).toEqual({});
    });

    it('paginate_PagesAndLimit_FilterObject', () => {
        expect(paginate({ page: 13, limit: 7 })).toEqual({
            limit: 7,
            offset: 84,
        });
    });
});
