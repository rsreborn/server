import { handleButtonAction, pluginActions } from '@engine/actions';
import { loadOutboundPackets } from '@engine/net/packets';
import { startServer } from '@engine/net/server';
import { PluginLoader } from '@engine/plugin';
import widgets from '@engine/widgets';

(async () => {
    const pluginLoader = new PluginLoader();
    await pluginLoader.loadPlugins();

    await loadOutboundPackets();

    await startServer(
        'RS-Reborn server',
        '0.0.0.0',
        43594,
        1,
        43595,
        80,
        [254, 289, 319, 357, 410, 414, 498],
    );

    await widgets.load();

    handleButtonAction({ player: null, widget: 'rs:logout', button: 0 });
})();
