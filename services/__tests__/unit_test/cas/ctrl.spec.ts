import httpStatus from 'http-status-codes';

import { getProfile } from '../../../src/api/cas/ctrl';
import { APIError } from '../../../src/utils/error';

describe('getProfile', () => {
    it('getProfile_noSession_nextError', () => {
        const MOCK_SEND = jest.fn();
        const MOCK_NEXT = jest.fn();

        const RES: any = { send: MOCK_SEND };
        const REQ: any = {};
        getProfile(REQ, RES, MOCK_NEXT);

        expect(MOCK_NEXT).toHaveBeenCalledTimes(1);
        expect(MOCK_SEND).toHaveBeenCalledTimes(0);
        expect(MOCK_NEXT).toHaveBeenCalledWith(
            new APIError('Missing cas user info in given session', httpStatus.BAD_REQUEST, 11103),
        );
    });

    it('getProfile_noSessionInfo_nextError', () => {
        const MOCK_SEND = jest.fn();
        const MOCK_NEXT = jest.fn();

        const RES: any = { send: MOCK_SEND };
        const REQ: any = {
            session: {},
        };
        getProfile(REQ, RES, MOCK_NEXT);

        expect(MOCK_NEXT).toHaveBeenCalledTimes(1);
        expect(MOCK_SEND).toHaveBeenCalledTimes(0);
        expect(MOCK_NEXT).toHaveBeenCalledWith(
            new APIError('Missing cas user info in given session', httpStatus.BAD_REQUEST, 11103),
        );
    });

    it('getProfile_noSessionInfoRole_addStudentRole', () => {
        const MOCK_SEND = jest.fn();
        const MOCK_NEXT = jest.fn();

        const RES: any = { send: MOCK_SEND };
        const REQ: any = {
            session: {
                info: {
                    test: 't',
                },
            },
        };
        getProfile(REQ, RES, MOCK_NEXT);

        expect(MOCK_SEND).toHaveBeenCalledTimes(1);
        expect(MOCK_NEXT).toHaveBeenCalledTimes(0);
        expect(MOCK_SEND.mock.calls[0][0]).toEqual({
            test: 't',
            role: 'student',
        });
    });

    it('getProfile_SessionWithRole_Same', () => {
        const MOCK_SEND = jest.fn();
        const MOCK_NEXT = jest.fn();

        const RES: any = { send: MOCK_SEND };
        const REQ: any = {
            session: {
                info: {
                    test: 't',
                    role: 'other',
                },
            },
        };
        getProfile(REQ, RES, MOCK_NEXT);

        expect(MOCK_SEND).toHaveBeenCalledTimes(1);
        expect(MOCK_NEXT).toHaveBeenCalledTimes(0);
        expect(MOCK_SEND.mock.calls[0][0]).toEqual({
            test: 't',
            role: 'other',
        });
    });
});
