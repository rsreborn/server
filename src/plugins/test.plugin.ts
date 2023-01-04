import { ActionHook, Plugin } from '@engine/plugin';

@Plugin({
    id: 'rs:test',
    version: '1.0.0',
    dependencies: [
        'rs:cooking_skill'
    ],
    compatibleBuilds: [
        289, 319, 357, 414
    ]
})
export default class TestPlugin {
    @ActionHook({})
    testHook() {
        console.log('test hook called');
    }
}
