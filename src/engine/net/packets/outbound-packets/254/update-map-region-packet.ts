import { Packet} from '../../packet';
import {  OutboundPacket2 } from '../../packets';
import { UpdateMapRegion } from '../impl/update-map-region';

export default class UpdateMapRegionPacket implements OutboundPacket2<UpdateMapRegion> {

    name: "update-map-region";
    encoder(player, opcode, data) {
        const packet = new Packet(209);
        packet.put(data.mapCoords.x, 'short');
        packet.put(data.mapCoords.y, 'short');
        return packet;
    };
}
