import { startServer } from './net/server';

(async () => {
    await startServer(
        'RS-Reborn server',
        '0.0.0.0',
        43594,
        1,
        43595,
        80,
    );
})();
