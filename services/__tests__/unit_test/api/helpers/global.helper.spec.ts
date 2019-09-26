import httpStatus from 'http-status-codes';

import { APIError } from '../../../../src/utils/error';

import {
    checkContent,
    checkArrayContent,
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
} from '../../../../src/api/helpers/global.helper';

describe('checkContent', () => {
    it('checkContent_content_true', () => {
        const mockNext = jest.fn();

        const RESULT = checkContent('content', mockNext);
        expect(RESULT).toBe(true);
        expect(mockNext.mock.calls.length).toBe(0);
    });

    it('checkContent_noContent_false+next', () => {
        const mockNext = jest.fn();

        const RESULT = checkContent(null, mockNext);
        expect(RESULT).toBe(false);
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toEqual(
            new APIError(
                httpStatus.getStatusText(httpStatus.NO_CONTENT),
                httpStatus.NO_CONTENT,
                11104,
            ),
        );
    });
});

describe('checkArrayContent', () => {
    it('checkArrayContent_content_true', () => {
        const mockNext = jest.fn();

        const RESULT = checkArrayContent(['content'], mockNext);
        expect(RESULT).toBe(true);
        expect(mockNext.mock.calls.length).toBe(0);
    });

    it('checkArrayContent_noContent_false+next', () => {
        const mockNext = jest.fn();

        const RESULT = checkArrayContent([], mockNext);
        expect(RESULT).toBe(false);
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toEqual(
            new APIError(
                httpStatus.getStatusText(httpStatus.NO_CONTENT),
                httpStatus.NO_CONTENT,
                11104,
            ),
        );
    });
});

describe('UNPROCESSABLE_ENTITY', () => {
    it('UNPROCESSABLE_ENTITY_APIError', () => {
        const mockNext = jest.fn();
        const APIerr = new APIError(
            httpStatus.getStatusText(httpStatus.NO_CONTENT),
            httpStatus.NO_CONTENT,
            11104,
        );

        UNPROCESSABLE_ENTITY(mockNext, APIerr);
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toEqual(APIerr);
    });

    it('UNPROCESSABLE_ENTITY_Other', () => {
        const mockNext = jest.fn();
        const APIerr = new APIError(
            httpStatus.getStatusText(httpStatus.UNPROCESSABLE_ENTITY),
            httpStatus.UNPROCESSABLE_ENTITY,
            10101,
        );

        UNPROCESSABLE_ENTITY(mockNext, 'APIerr');
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toEqual(APIerr);
    });
});

describe('BAD_REQUEST_VALIDATOR', () => {
    it('BAD_REQUEST_VALIDATOR_MockedExpressValidatorError', () => {
        const mockNext = jest.fn();
        const err = {
            array() {
                return 'ERROR';
            },
        };

        BAD_REQUEST_VALIDATOR(mockNext, err);
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toMatchSnapshot();
    });
});
