import {
    ICampaignEntity,
    IFileEntity,
    IBusinessEntity,
    IInternshipEntity,
    IInternshipTypeEntity,
    IMentoringPropositionEntity,
    IMentorEntity,
    IStudentEntity,
} from '../declarations';

export function isInt(t: number): t is number {
    return !!t && !Number.isNaN(Number(t));
}

export function checkPartialBusiness(check: Partial<IBusinessEntity>): check is IBusinessEntity {
    return (
        !!check &&
        !!check.name &&
        !!check.postalCode &&
        !!check.city &&
        !!check.country &&
        !!check.address
    );
}

export function checkPartialCampaign(check: Partial<ICampaignEntity>): check is ICampaignEntity {
    return (
        !!check && !!check.name && !!check.description && !!check.semester && !!check.maxProposition
    );
}

export function checkPartialFile(check: Partial<IFileEntity>): check is IFileEntity {
    return !!check && !!check.name && !!check.path && !!check.type;
}

export function checkPartialInternship(
    check: Partial<IInternshipEntity>,
): check is IInternshipEntity {
    return (
        !!check &&
        !!check.subject &&
        !!check.description &&
        !!check.country &&
        !!check.city &&
        !!check.postalCode &&
        !!check.address &&
        !!check.state
    );
}

export function checkPartialInternshipType(
    check: Partial<IInternshipTypeEntity>,
): check is IInternshipTypeEntity {
    return !!check && !!check.label;
}

export function checkPartialProposition(
    check: Partial<IMentoringPropositionEntity>,
): check is IMentoringPropositionEntity {
    return !!check && !!check.comment;
}

export function checkPartialMentor(check: Partial<IMentorEntity>): check is IMentorEntity {
    return !!check && !!check.firstName && !!check.lastName && !!check.email;
}

export function checkPartialStudent(check: Partial<IStudentEntity>): check is IStudentEntity {
    return !!check && !!check.firstName && !!check.lastName && !!check.email && !!check.semester;
}
