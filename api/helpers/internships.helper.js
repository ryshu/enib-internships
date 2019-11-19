"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const InternshipModePriority = [
    "validated" /* VALIDATED */,
    "attributed" /* ATTRIBUTED */,
    "available" /* AVAILABLE */,
    "waiting" /* WAITING */,
    "suggest" /* SUGGESTED */,
];
/**
 * @summary Method used to handle update internships status
 * @async
 * @param {Internships} internship Internship to update
 * @param {INTERNSHIP_MODE | undefined} expected Expected mode, could be undefined
 */
function updateInternshipStatus(internship, expected) {
    return __awaiter(this, void 0, void 0, function* () {
        function _checkMode(i, mode) {
            switch (mode) {
                case "attributed" /* ATTRIBUTED */:
                    return _checkId(i.validatedCampaign);
                case "available" /* AVAILABLE */:
                    return i.isPublish;
                case "suggest" /* SUGGESTED */:
                    return i.isProposition;
                case "validated" /* VALIDATED */:
                    return i.isValidated;
                case "waiting" /* WAITING */:
                    return !i.isProposition && !i.isPublish;
                default:
                    return false;
            }
        }
        function _applyMode(i, mode) {
            return __awaiter(this, void 0, void 0, function* () {
                switch (mode) {
                    case "attributed" /* ATTRIBUTED */:
                        i.set('state', "attributed" /* ATTRIBUTED */);
                        yield i.save();
                        break;
                    case "available" /* AVAILABLE */:
                        i.set('state', "available" /* AVAILABLE */);
                        yield i.save();
                        break;
                    case "suggest" /* SUGGESTED */:
                        i.set('state', "suggest" /* SUGGESTED */);
                        yield i.save();
                        break;
                    case "validated" /* VALIDATED */:
                        i.set('state', "validated" /* VALIDATED */);
                        yield i.save();
                        break;
                    case "waiting" /* WAITING */:
                        i.set('state', "waiting" /* WAITING */);
                        yield i.save();
                        break;
                    default:
                        break;
                }
            });
        }
        if (expected && _checkMode(internship, expected)) {
            yield _applyMode(internship, expected);
            return;
        }
        for (const mode of InternshipModePriority.filter((m) => m !== expected)) {
            if (_checkMode(internship, mode)) {
                yield _applyMode(internship, mode);
                return;
            }
        }
    });
}
exports.updateInternshipStatus = updateInternshipStatus;
function _checkId(tmp) {
    return tmp && tmp.id ? !Number.isNaN(Number(tmp.id)) : !Number.isNaN(Number(tmp));
}
//# sourceMappingURL=internships.helper.js.map