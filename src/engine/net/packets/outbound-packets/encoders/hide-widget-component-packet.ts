import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    shouldHideComponent: boolean;
}

export const hideWidgetComponentPacket: OutboundPacket<WidgetData> = {
    name: 'hideWidgetComponent',
    opcodes: {
        254: 227,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(227);
            packet.put(data.widgetId, 'short');
            packet.put(Number(data.shouldHideComponent));
            return packet;
        }
    },
};
