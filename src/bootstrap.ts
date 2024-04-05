import { getLogger } from './logging.service';
import { Invoice } from './webhook/invoice/invoice';

const logger = getLogger(__filename);

Invoice.bootstrap()
    .then(() => {
        logger.info('Bootstrap successfully');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Bootstrap failed', { error });
        process.exit(1);
    });
