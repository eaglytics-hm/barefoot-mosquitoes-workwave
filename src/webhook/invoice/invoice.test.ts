import { readFileSync } from 'node:fs';

import { getLogger } from '../../logging.service';
import { Invoice } from './invoice';
import { chunk } from 'lodash';

const logger = getLogger(__filename);

it('service', async () => {
    const { service } = Invoice;
    try {
        const filename = await service({ TenantId: '338802', EntityId: 1124398, EntityType: 'Invoice', Url: '' });
        expect(filename).toBeDefined();
    } catch (error) {
        logger.error(error);
        throw error;
        
    }
});

it('backfill', async () => {
    const { service } = Invoice;
    const data = JSON.parse(readFileSync('./2024-07-22-2.json', { encoding: 'utf-8' }));
    const rows = data.map((row: any) => row.jsonPayload.body).filter((row: any) => !!row.TenantId);
    const rowGroups = chunk(rows, 1000);
    for (const group of rowGroups) {
        await Promise.allSettled(group.map(<any>service));
        console.log(group.length, rows.length);
    }
});
