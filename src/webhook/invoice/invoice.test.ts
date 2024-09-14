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
    } catch (error) {
        console.error(error);
        throw error;
    }
});
