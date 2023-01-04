import { startServer } from '@engine/net/server';
import TestPlugin from './plugins/test.plugin';

(async () => {
    await startServer(
        'RS-Reborn server',
        '0.0.0.0',
        43594,
        1,
        43595,
        80,
        [289, 319, 357, 414],
    );

    const testPlugin = new TestPlugin();
    console.log((testPlugin as any).metadata);
    // testPlugin.testHook();
})();
