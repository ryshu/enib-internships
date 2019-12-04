"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Documentation
function checkPartialBusiness(check) {
    return (!!check &&
        !!check.name &&
        !!check.postalCode &&
        !!check.city &&
        !!check.country &&
        !!check.address);
}
exports.checkPartialBusiness = checkPartialBusiness;
function checkPartialCampaign(check) {
    return (!!check && !!check.name && !!check.description && !!check.semester && !!check.maxProposition);
}
exports.checkPartialCampaign = checkPartialCampaign;
function checkPartialFile(check) {
    return !!check && !!check.name && !!check.path && !!check.type;
}
exports.checkPartialFile = checkPartialFile;
function checkPartialInternship(check) {
    return !!check && !!check.subject && !!check.description && !!check.country;
}
exports.checkPartialInternship = checkPartialInternship;
function checkPartialInternshipType(check) {
    return !!check && !!check.label;
}
exports.checkPartialInternshipType = checkPartialInternshipType;
function checkPartialProposition(check) {
    return !!check && !!check.comment;
}
exports.checkPartialProposition = checkPartialProposition;
function checkPartialMentor(check) {
    return !!check && !!check.firstName && !!check.lastName && !!check.email;
}
exports.checkPartialMentor = checkPartialMentor;
function checkPartialStudent(check) {
    return !!check && !!check.firstName && !!check.lastName && !!check.email && !!check.semester;
}
exports.checkPartialStudent = checkPartialStudent;
//# sourceMappingURL=check.js.map