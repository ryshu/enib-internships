import { IBusinessEntity } from '../../declarations';
import { checkPartialBusiness } from '../../utils/check';

export function fullCopyBusiness(data: Partial<IBusinessEntity>): IBusinessEntity | undefined {
    if (checkPartialBusiness(data)) {
        return {
            name: data.name,
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            address: data.address,
            additional: data.additional,
        };
    } else {
        return undefined;
    }
}
