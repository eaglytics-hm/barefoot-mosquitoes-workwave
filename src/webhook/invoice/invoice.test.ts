import { getLogger } from '../../logging.service';
import { InvoiceCreditMemo } from './invoice';

it('service', async () => {
    const { service } = InvoiceCreditMemo;
    try {
        const [fileSave, writeRow] = await service({
            TenantId: '338802',
            EntityId: 766971,
            EntityType: 'Invoice',
            Url: '',
        });
        console.log(fileSave);
        expect(fileSave).toBeDefined();
    } catch {
        console.error(error);
        throw error;
    }
});
