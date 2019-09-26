import { APIError } from '../../../src/utils/error';

describe('Create API Error', () => {
    it('APIError_StringAndCode_CorrectAPIError', () => {
        const ERROR: APIError = new APIError('test error', 500, 0);

        expect(ERROR).toBeDefined();
        expect(ERROR).toBeInstanceOf(APIError);
        expect(ERROR.code).toBe(0);
        expect(ERROR.status).toBe(500);
        expect(ERROR.name).toBe('test error');
        expect(ERROR.message).toBe('test error');
        expect(ERROR.stack).toBeDefined();
        expect(ERROR.toJSON()).toEqual({
            code: 0,
            errors: null,
            name: 'test error',
            status: 500,
        });
    });

    it('APIError_StringAndCodeAndErrors_CorrectAPIError', () => {
        const ERROR: APIError = new APIError('test error', 500, 0);
        ERROR.setErrors('test');

        expect(ERROR).toBeDefined();
        expect(ERROR).toBeInstanceOf(APIError);
        expect(ERROR.code).toBe(0);
        expect(ERROR.status).toBe(500);
        expect(ERROR.name).toBe('test error');
        expect(ERROR.message).toBe('test error');
        expect(ERROR.errors).toBe('test');
        expect(ERROR.stack).toBeDefined();
        expect(ERROR.toJSON()).toEqual({
            code: 0,
            errors: 'test',
            name: 'test error',
            status: 500,
        });
    });
});
