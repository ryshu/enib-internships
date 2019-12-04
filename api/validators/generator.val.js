"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../../utils/type");
const internship_1 = require("../../internship");
function addressVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}country`]: {
            in: ['body'],
            isString: { errorMessage: 'Country must be of type string' },
            exists: { errorMessage: 'Country must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}city`]: {
            in: ['body'],
            isString: { errorMessage: 'City must be of type string' },
            exists: { errorMessage: 'City must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}postalCode`]: {
            in: ['body'],
            isString: { errorMessage: 'Postal code must be of type string' },
            optional: true,
            trim: true,
            escape: true,
        },
        [`${path}address`]: {
            in: ['body'],
            isString: { errorMessage: 'Address must be of type string' },
            optional: true,
            trim: true,
            escape: true,
        },
        [`${path}additional`]: {
            in: ['body'],
            isString: { errorMessage: 'Additional must be of type string' },
            optional: true,
            trim: true,
            escape: true,
        },
    };
}
exports.addressVal = addressVal;
function businessVal(base) {
    const path = base ? `${base}.` : '';
    return Object.assign({ [`${path}name`]: {
            in: ['body'],
            isString: { errorMessage: 'Name must be of type string' },
            exists: { errorMessage: 'Name must be defined' },
            trim: true,
            escape: true,
        } }, addressVal(base));
}
exports.businessVal = businessVal;
function campaignVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}name`]: {
            in: ['body'],
            isString: { errorMessage: 'Name must be of type string' },
            exists: { errorMessage: 'Name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}description`]: {
            in: ['body'],
            isString: { errorMessage: 'Description must be of type string' },
            exists: { errorMessage: 'Description must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}semester`]: {
            in: ['body'],
            isString: { errorMessage: 'Semester must be of type string' },
            exists: { errorMessage: 'Semester must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}maxProposition`]: {
            in: ['body'],
            isInt: { errorMessage: 'maxProposition must be an integer >= 0', options: { min: 0 } },
            optional: true,
            toInt: true,
        },
        [`${path}isPublish`]: {
            in: ['body'],
            isBoolean: { errorMessage: 'Publish must be of type boolean' },
            optional: true,
            toBoolean: true,
        },
        [`${path}startAt`]: {
            in: ['body'],
            isInt: { errorMessage: 'Start At must be of type timestamp', options: { min: 0 } },
            optional: true,
            toInt: true,
        },
        [`${path}endAt`]: {
            in: ['body'],
            isInt: { errorMessage: 'End At must be of type timestamp', options: { min: 0 } },
            optional: true,
            toInt: true,
        },
    };
}
exports.campaignVal = campaignVal;
function categoryVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}label`]: {
            in: ['body'],
            isString: { errorMessage: 'Label must be of type string' },
            exists: { errorMessage: 'Label must be defined' },
            trim: true,
            escape: true,
        },
    };
}
exports.categoryVal = categoryVal;
function fileVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}name`]: {
            in: ['body'],
            isString: { errorMessage: 'Name must be of type string' },
            exists: { errorMessage: 'Name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}type`]: {
            in: ['body'],
            isString: { errorMessage: 'Type must be of type string' },
            exists: { errorMessage: 'Type must be defined' },
            trim: true,
            escape: true,
        },
    };
}
exports.fileVal = fileVal;
function internshipVal(base) {
    const path = base ? `${base}.` : '';
    return Object.assign(Object.assign({ [`${path}subject`]: {
            in: ['body'],
            isString: { errorMessage: 'Subject must be of type string' },
            exists: { errorMessage: 'Subject must be defined' },
            trim: true,
            escape: true,
        }, [`${path}description`]: {
            in: ['body'],
            isString: { errorMessage: 'Description must be of type string' },
            exists: { errorMessage: 'Description must be defined' },
            trim: true,
            escape: true,
        } }, addressVal(base)), { [`${path}isInternshipAbroad`]: {
            in: ['body'],
            isBoolean: { errorMessage: 'Internship abroad must be of type boolean' },
            optional: true,
            toBoolean: true,
        }, [`${path}state`]: {
            in: ['body'],
            isString: { errorMessage: 'Internship state must be of type string' },
            isIn: {
                options: [internship_1.InternshipsMode],
                errorMessage: `State should be included in [${internship_1.InternshipsMode.join(', ')}]`,
            },
            optional: true,
            trim: true,
            escape: true,
        }, [`${path}result`]: {
            in: ['body'],
            isString: { errorMessage: 'Internship abroad must be of type string' },
            isIn: {
                options: [internship_1.InternshipsResult],
                errorMessage: `Result should be included in [${internship_1.InternshipsResult.join(', ')}]`,
            },
            optional: true,
            trim: true,
            escape: true,
        }, [`${path}publishAt`]: {
            in: ['body'],
            isInt: { errorMessage: 'Publish at must be a timestamp', options: { min: 0 } },
            optional: true,
            toInt: true,
        }, [`${path}startAt`]: {
            in: ['body'],
            isInt: { errorMessage: 'Start at must be a timestamp', options: { min: 0 } },
            optional: true,
            toInt: true,
        }, [`${path}endAt`]: {
            in: ['body'],
            isInt: { errorMessage: 'End at must be a timestamp', options: { min: 0 } },
            optional: true,
            toInt: true,
        } });
}
exports.internshipVal = internshipVal;
function studentVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}firstName`]: {
            in: ['body'],
            isString: { errorMessage: 'First name must be of type string' },
            exists: { errorMessage: 'First name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}lastName`]: {
            in: ['body'],
            isString: { errorMessage: 'Last name must be of type string' },
            exists: { errorMessage: 'Last name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}email`]: {
            in: ['body'],
            isString: { errorMessage: 'Email must be of type string' },
            isEmail: { errorMessage: 'Email must complain to email struct' },
            exists: { errorMessage: 'Email must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}semester`]: {
            in: ['body'],
            isString: { errorMessage: 'Semester must be of type string' },
            exists: { errorMessage: 'Semester must be defined' },
            trim: true,
            escape: true,
        },
    };
}
exports.studentVal = studentVal;
function propositionsVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}comment`]: {
            in: ['body'],
            isString: { errorMessage: 'Comment must be of type string' },
            exists: { errorMessage: 'Comment must be defined' },
            trim: true,
            escape: true,
        },
    };
}
exports.propositionsVal = propositionsVal;
function mentorVal(base) {
    const path = base ? `${base}.` : '';
    return {
        [`${path}firstName`]: {
            in: ['body'],
            isString: { errorMessage: 'First name must be of type string' },
            exists: { errorMessage: 'First name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}lastName`]: {
            in: ['body'],
            isString: { errorMessage: 'Last name must be of type string' },
            exists: { errorMessage: 'Last name must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}email`]: {
            in: ['body'],
            isString: { errorMessage: 'Email must be of type string' },
            isEmail: { errorMessage: 'Email must complain to email struct' },
            exists: { errorMessage: 'Email must be defined' },
            trim: true,
            escape: true,
        },
        [`${path}role`]: {
            in: ['body'],
            isString: { errorMessage: 'Role must be of type string' },
            isIn: {
                options: [type_1.mentorRoles],
                errorMessage: `Role must be in [${type_1.mentorRoles.join(', ')}]`,
            },
            optional: true,
            trim: true,
        },
    };
}
exports.mentorVal = mentorVal;
//# sourceMappingURL=generator.val.js.map