import pluginActions from '@engine/actions/plugin-actions';
import { startServer } from '@engine/net/server';
import PluginLoader from '@engine/plugin/plugin-loader';

(async () => {
    const pluginLoader = new PluginLoader();
    await pluginLoader.loadPlugins();

    await startServer(
        'RS-Reborn server',
        '0.0.0.0',
        43594,
        1,
        43595,
        80,
        [289, 319, 357, 414],
    );

    console.log(pluginActions.button);
    const { hook, handler } = pluginActions.button[0];
    handler(hook, null);
})();
