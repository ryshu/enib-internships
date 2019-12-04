"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInt(t) {
    return !Number.isNaN(Number(t));
}
exports.isInt = isInt;
function checkPartialBusiness(check) {
    return !!check.name && !!check.postalCode && !!check.city && !!check.country && !!check.address;
}
exports.checkPartialBusiness = checkPartialBusiness;
function checkPartialCampaign(check) {
    return (check.name &&
        check.description &&
        check.semester &&
        check.maxProposition &&
        check.startAt !== undefined &&
        isInt(check.startAt) &&
        isInt(check.endAt) &&
        !!check.category);
}
exports.checkPartialCampaign = checkPartialCampaign;
function checkPartialFile(check) {
    return !!check.name && !!check.path && !!check.type;
}
exports.checkPartialFile = checkPartialFile;
function checkPartialInternship(check) {
    return (!!check.subject &&
        !!check.description &&
        !!check.country &&
        !!check.city &&
        !!check.postalCode &&
        !!check.address &&
        !!check.state);
}
exports.checkPartialInternship = checkPartialInternship;
function checkPartialInternshipType(check) {
    return !!check.label;
}
exports.checkPartialInternshipType = checkPartialInternshipType;
function checkPartialProposition(check) {
    return !!check.comment;
}
exports.checkPartialProposition = checkPartialProposition;
function checkPartialMentor(check) {
    return !!check.firstName && !!check.lastName && !!check.email;
}
exports.checkPartialMentor = checkPartialMentor;
function checkPartialStudent(check) {
    return !!check.firstName && !!check.lastName && !!check.email && !!check.semester;
}
exports.checkPartialStudent = checkPartialStudent;
//# sourceMappingURL=check.js.map