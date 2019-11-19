import Internships from '../../models/Internships';

import { INTERNSHIP_MODE } from '../../statistics/base';

const InternshipModePriority = [
    INTERNSHIP_MODE.VALIDATED,
    INTERNSHIP_MODE.ATTRIBUTED,
    INTERNSHIP_MODE.AVAILABLE,
    INTERNSHIP_MODE.WAITING,
    INTERNSHIP_MODE.SUGGESTED,
];

/**
 * @summary Method used to handle update internships status
 * @async
 * @param {Internships} internship Internship to update
 * @param {INTERNSHIP_MODE | undefined} expected Expected mode, could be undefined
 */
export async function updateInternshipStatus(internship: Internships, expected?: INTERNSHIP_MODE) {
    function _checkMode(i: Internships, mode: INTERNSHIP_MODE) {
        switch (mode) {
            case INTERNSHIP_MODE.ATTRIBUTED:
                return _checkId(i.validatedCampaign);
            case INTERNSHIP_MODE.AVAILABLE:
                return i.isPublish;

            case INTERNSHIP_MODE.SUGGESTED:
                return i.isProposition;

            case INTERNSHIP_MODE.VALIDATED:
                return i.isValidated;

            case INTERNSHIP_MODE.WAITING:
                return !i.isProposition && !i.isPublish;
            default:
                return false;
        }
    }

    async function _applyMode(i: Internships, mode: INTERNSHIP_MODE) {
        switch (mode) {
            case INTERNSHIP_MODE.ATTRIBUTED:
                i.set('state', INTERNSHIP_MODE.ATTRIBUTED);
                await i.save();
                break;
            case INTERNSHIP_MODE.AVAILABLE:
                i.set('state', INTERNSHIP_MODE.AVAILABLE);
                await i.save();
                break;

            case INTERNSHIP_MODE.SUGGESTED:
                i.set('state', INTERNSHIP_MODE.SUGGESTED);
                await i.save();
                break;

            case INTERNSHIP_MODE.VALIDATED:
                i.set('state', INTERNSHIP_MODE.VALIDATED);
                await i.save();
                break;

            case INTERNSHIP_MODE.WAITING:
                i.set('state', INTERNSHIP_MODE.WAITING);
                await i.save();
                break;
            default:
                break;
        }
    }

    if (expected && _checkMode(internship, expected)) {
        await _applyMode(internship, expected);
        return;
    }

    for (const mode of InternshipModePriority.filter((m) => m !== expected)) {
        if (_checkMode(internship, mode)) {
            await _applyMode(internship, mode);
            return;
        }
    }
}

function _checkId(tmp: any): boolean {
    return tmp && tmp.id ? !Number.isNaN(Number(tmp.id)) : !Number.isNaN(Number(tmp));
}
