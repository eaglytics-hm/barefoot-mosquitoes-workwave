import { protos, adapt, managedwriter } from '@google-cloud/bigquery-storage';

import { getLogger } from './logging.service';

const logger = getLogger(__filename);
const writeClient = new managedwriter.WriterClient();

type StreamWriteOptions = {
    datasetId: string;
    tableId: string;
};

export const streamWrite = async (rows: any[], { datasetId, tableId }: StreamWriteOptions) => {
    if (rows.length === 0) {
        logger.debug(`Empty rows for ${tableId}`);
        return;
    }

    const projectId = await writeClient.getClient().getProjectId();
    const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
    const writeStream = await writeClient.getWriteStream({
        streamId: `${destinationTable}/streams/_default`,
        view: protos.google.cloud.bigquery.storage.v1.WriteStreamView.FULL,
    });

    const protoDescriptor = adapt.convertStorageSchemaToProto2Descriptor(
        { fields: writeStream.tableSchema!.fields! },
        'root',
        adapt.withChangeType(),
    );
    const connection = await writeClient.createStreamConnection({
        streamId: managedwriter.DefaultStream,
        destinationTable,
    });
    const writer = new managedwriter.JSONWriter({ connection, protoDescriptor });

    const [appendError, pendingWrite] = (() => {
        try {
            const results = writer.appendRows(rows);
            return [null, results] as const;
        } catch (error) {
            logger.error('Format Error', { error, rows });
            return [error, null] as const;
        }
    })();

    if (appendError && !pendingWrite) {
        writer.close();
        throw appendError;
    }

    const results = await pendingWrite!.getResult().catch((error) => {
        logger.error('Writing Error', error);
    });
    writer.close();
    if (results?.error) {
        throw new Error(results.error?.message ?? 'Writing Error');
    }
    logger.debug(`Wrote to ${tableId}`, { rows });
    return results;
};
