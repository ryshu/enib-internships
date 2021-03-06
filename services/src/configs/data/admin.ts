import { IMentorEntity } from '../../declarations';

export const admins: IMentorEntity[] = [
    {
        firstName: 'Oscar',
        lastName: 'Marie--Taillefer',
        fullName: 'Oscar MARIE--TAILLEFER',
        email: 'o5mariet@enib.fr',
        role: 'admin',
    },
    {
        firstName: 'Cas',
        lastName: 'DEV',
        fullName: 'Cas DEV',
        email: 'cas.dev@enib.fr',
        role: 'admin',
    },
];

export const adminsEmail = admins.map((a) => a.email);
export const adminsCasUsername = admins.map((a) => a.email.split('@')[0]);
