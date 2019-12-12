"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
const internship_1 = require("../../internship");
// All available associations label for includes filter
const InternshipAvailableIncludes = [
    'files',
    'student',
    'mentor',
    'availableCampaign',
    'validatedCampaign',
    'propositions',
    'business',
    'category',
];
exports.InternshipsList = Object.assign(Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.countriesValidator), generic_val_1.archivedValidator), { 'types': {
        in: ['query'],
        isArray: { errorMessage: 'Category filter list must be array' },
        optional: true,
        toArray: true,
    }, 'subject': {
        in: ['query'],
        isString: { errorMessage: 'Subject should be of type string' },
        optional: true,
        trim: true,
        escape: true,
    }, 'mode': {
        in: ['query'],
        isArray: { errorMessage: 'Internship mode should be provide under array form' },
        optional: true,
        toArray: true,
    }, 'mode[*]': {
        in: ['query'],
        isString: { errorMessage: 'Mode should be a string' },
        isIn: {
            options: [internship_1.InternshipsMode],
            errorMessage: `Mode should be included in [${internship_1.InternshipsMode.join(', ')}]`,
        },
        optional: true,
        trim: true,
    }, 'isAbroad': {
        in: ['query'],
        isBoolean: { errorMessage: 'Abroad should be of type boolean' },
        optional: true,
        toBoolean: true,
    }, 'mentorId': {
        in: ['query'],
        isInt: { errorMessage: `Mentor identifier must be an integer` },
        optional: true,
        toInt: true,
    }, 'includes': {
        in: ['query'],
        isArray: { errorMessage: 'Internship includes should be provide under array form' },
        optional: true,
        toArray: true,
    }, 'includes[*]': {
        in: ['query'],
        isString: { errorMessage: 'Include should be a string' },
        isIn: {
            options: [InternshipAvailableIncludes],
            errorMessage: `Include should be available in following list: [${InternshipAvailableIncludes.join(', ')}]`,
        },
        optional: true,
        trim: true,
    } });
exports.InternshipCreate = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, generator_val_1.internshipVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.categoryVal('category'))), generic_val_1.replaceAllExistByOptional(generator_val_1.studentVal('student'))), generic_val_1.replaceAllExistByOptional(generator_val_1.fileVal('files[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.mentorVal('mentor'))), generic_val_1.replaceAllExistByOptional(generator_val_1.businessVal('business'))), generic_val_1.replaceAllExistByOptional(generator_val_1.propositionsVal('propositions[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.campaignVal('validatedCampaign'))), generic_val_1.replaceAllExistByOptional(generator_val_1.campaignVal('availableCampaign')));
exports.InternshipUpdate = generic_val_1.replaceAllExistByOptional(exports.InternshipCreate);
exports.InternshipFSM = Object.assign(Object.assign({}, generic_val_1.ID), { state: {
        in: ['body'],
        isString: { errorMessage: 'State should be a string' },
        isIn: {
            options: [internship_1.InternshipsMode],
            errorMessage: `State should be included in [${internship_1.InternshipsMode.join(', ')}]`,
        },
        exists: { errorMessage: 'Should should be defined' },
        trim: true,
    }, campaignId: {
        in: ['body'],
        isInt: { errorMessage: `Campaign identifier must be an integer` },
        optional: true,
        toInt: true,
    }, mentorId: {
        in: ['body'],
        isInt: { errorMessage: `Mentor identifier must be an integer` },
        optional: true,
        toInt: true,
    }, studentId: {
        in: ['body'],
        isInt: { errorMessage: `Student must be an integer` },
        optional: true,
        toInt: true,
    }, result: {
        in: ['body'],
        isString: { errorMessage: 'Result should be a string' },
        isIn: {
            options: [internship_1.InternshipsResult],
            errorMessage: `Result should be included in [${internship_1.InternshipsResult.join(', ')}]`,
        },
        optional: true,
        trim: true,
    }, endAt: {
        in: ['body'],
        isInt: { errorMessage: `End at must be an integer` },
        optional: true,
        toInt: true,
    } });
//# sourceMappingURL=internships.val.js.map