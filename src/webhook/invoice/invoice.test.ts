import { getLogger } from '../../logging.service';
import { Invoice } from './invoice';

const logger = getLogger(__filename);

it('service', async () => {
    const { service } = Invoice;
    return await service({ TenantId: '338802', EntityId: 799572, EntityType: 'Invoice', Url: '' })
        .then((filename) => {
            logger.info(filename);
            expect(filename).toBeDefined();
        })
        .catch((error) => {
            logger.error(error);
            throw error;
        });
});
