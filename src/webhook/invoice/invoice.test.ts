import { Invoice } from './invoice';

it('service', async () => {
    try {
        const [fileSave, writeRow] = await Invoice.service({
            TenantId: '338802',
            EntityId: 781150,
            EntityType: 'Invoice',
            Url: '',
        });
        expect(fileSave).toBeDefined();
        expect(writeRow).toBeDefined();
        console.log(fileSave);
        console.log(writeRow);
    } catch (error) {
        console.error(error);
        throw error;
    }
});
