import { getLogger } from '../../logging.service';
import { TenantEnum } from '../../workwave/tenant.enum';
import { Invoice } from './invoice';

const logger = getLogger(__filename);

it('service', async () => {
    const { service } = Invoice;
    return await service(TenantEnum._338802, { EntityId: 754497, EntityType: 'Invoice', Url: '' })
        .then((filename) => {
            logger.info(filename);
            expect(filename).toBeDefined();
        })
        .catch((error) => {
            logger.error(error);
            throw error;
        });
});
