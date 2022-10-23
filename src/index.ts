import { startServer } from './net/server';

(async () => {
    await startServer(
        '319 Server',
        '0.0.0.0',
        43594,
        1,
        43595,
        80,
    );
})();
