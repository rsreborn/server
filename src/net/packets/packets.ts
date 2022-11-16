import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../../world/player';
import { getLocalCoord, getMapCoord, getRegionId } from '../../world';
import inboundPackets from './inbound-packets';
import outboundPackets from './outbound-packets';
import INBOUND_PACKET_SIZES from './inbound-packet-sizes';

export const enum PacketSize {
    FIXED = 0,
    VAR_BYTE = 1,
    VAR_SHORT = 2,
}

export const enum PacketQueueType {
    PACKET = 'packet',
    SYNC = 'sync',
}

export interface Packet {
    opcode: number | null;
    size: number | null;
    buffer: ByteBuffer;
}

export type PacketOpcodeMap = { [key: number ]: number | number[] };
export type PacketDecoder<T = any> = (opcode: number, data: ByteBuffer) => T;
export type PacketDecoderMap<T = any> = { [key: number]: PacketDecoder<T> };
export type PacketEncoder<T = any> = (player: Player, opcode: number, data: T) => ByteBuffer;
export type PacketEncoderMap<T = any> = { [key: number]: PacketEncoder<T> };
export type PacketSizeMap = { [key: number ]: PacketSize };

export type PacketHandler<T = any> = (
    player: Player,
    data: T,
) => void;

export interface InboundPacket<T = any> {
    name: string;
    handler: PacketHandler<T>;
    opcodes: PacketOpcodeMap;
    decoders: PacketDecoderMap<T>;
}

export interface OutboundPacket<T = any> {
    name: string;
    size?: PacketSize;
    queue?: PacketQueueType;
    sizes?: PacketSizeMap;
    opcodes: PacketOpcodeMap;
    encoders: PacketEncoderMap<T>;
}

export const handleInboundPacket = (
    player: Player,
    opcode: number,
    data: ByteBuffer | null,
): boolean => {
    const buildNumber = player.client.connection.buildNumber;
    let inboundPacket: InboundPacket;

    for (const packet of inboundPackets) {
        const opcodes = packet.opcodes[String(buildNumber)];
        if (!opcodes) {
            continue;
        }

        const packetOpcodes: number[] = Array.isArray(opcodes) ?
            opcodes as number[] : [ opcodes as number ];

        if (packetOpcodes.indexOf(opcode) === -1) {
            continue;
        }

        inboundPacket = packet;
        break;
    }

    if (inboundPacket) {
        const decoder = inboundPacket.decoders[String(buildNumber)];
        const packetData = decoder(opcode, data);
        inboundPacket.handler(player, packetData);
        return true;
    }

    logger.info(`Unhandled packet ${ opcode } received with size of ${ data?.length ?? 0 }.`);

    const knownPacket = INBOUND_PACKET_SIZES[String(buildNumber)][String(opcode)] !== undefined;
    if (!knownPacket) {
        logger.warn(`Unknown packet ${ opcode } encountered!`);
        return false;
    }

    return true;
};

export const handleOutboundPacket = <T = any>(
    player: Player,
    packetName: string,
    data: T,
): void => {
    const outboundPacket: OutboundPacket = outboundPackets.find(p => p.name === packetName);

    if (!outboundPacket) {
        logger.error(`Outbound packet ${packetName} is not registered!`);
        return;
    }

    const buildNumber = player.client.connection.buildNumber;
    const opcode = outboundPacket.opcodes[String(buildNumber)];

    if (opcode === undefined) {
        logger.error(`Outbound packet ${packetName} opcode is not registered for game build ${buildNumber}!`);
        return;
    }

    const encoder = outboundPacket.encoders[String(buildNumber)];

    if (!encoder) {
        logger.error(`Outbound packet ${packetName} encoder is not registered for game build ${buildNumber}!`);
        return;
    }

    let packetSize = PacketSize.FIXED;
    if (outboundPacket.size !== undefined) {
        packetSize = outboundPacket.size;
    } else if (outboundPacket.sizes !== undefined) {
        packetSize = outboundPacket.sizes[String(buildNumber)] ?? PacketSize.FIXED;
    }

    const buffer = encoder(player, opcode, data);
    queuePacket(
        player,
        opcode,
        buffer,
        packetSize,
        outboundPacket.queue ?? PacketQueueType.PACKET
    );
};

export const queuePacket = (
    player: Player,
    opcode: number,
    packetData: ByteBuffer,
    packetType: PacketSize = PacketSize.FIXED,
    queueType: PacketQueueType = PacketQueueType.PACKET,
): void => {
    let size = packetData.length;

    if (packetType !== PacketSize.FIXED) {
        size += packetType;
    }

    const packet = new ByteBuffer(size + 1);
    packet.put((opcode + player.client.outCipher.rand()) & 0xff);

    let copyStart = 1;

    if (packetType === PacketSize.VAR_BYTE) {
        packet.put(packetData.length, 'byte');
        copyStart = 2;
    } else if (packetType === PacketSize.VAR_SHORT) {
        packet.put(packetData.length, 'short');
        copyStart = 3;
    }

    packetData.copy(packet, copyStart, 0, size);

    if (queueType === PacketQueueType.PACKET) {
        player.client.outboundPacketQueue.push(packet.toNodeBuffer());
    } else if (queueType === PacketQueueType.SYNC) {
        player.client.outboundSyncQueue.push(packet.toNodeBuffer());
    }
};

export const writePackets = (player: Player): void => {
    const buffer = Buffer.concat([
        ...player.client.outboundPacketQueue,
        ...player.client.outboundSyncQueue,
    ]);

    if (buffer.length !== 0) {
        player.client.connection.socket.write(buffer);
    }

    player.client.outboundPacketQueue = [];
    player.client.outboundSyncQueue = [];
};

export const sendChatboxMessage = (player: Player, message: string): void => {
    handleOutboundPacket(player, 'chatboxMessage', {
        message,
    });
};

export const sendUpdateMapRegionPacket = (player: Player): void => {
    const mapCoords = getMapCoord(player.coords);
    const localCoords = getLocalCoord(player.coords);
    handleOutboundPacket(player, 'updateMapRegion', {
        mapCoords,
        localCoords,
    });
};

export const sendWidget = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'widget', {
        widgetId,
    }); 
};

export const sendChatboxWidget = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'chatboxWidget', {
        widgetId,
    }); 
};

export const sendFullscreenWidget = (player: Player, fullscreenWidgetId: number, widgetId: number) => {
    handleOutboundPacket(player, 'fullscreenWidget', {
        fullscreenWidgetId,
        widgetId,
    }); 
}

export const sendSidebarWidgetWithDisabledTabs = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'sidebarDisabledTabs', {
        widgetId,
    });
};

export const sendAnimateWidget = (player: Player, widgetId: number, animationId: number): void => {
    handleOutboundPacket(player, 'animateWidget', {
        widgetId,
        animationId,
    }); 
};

export const sendWidgetPlayerHead = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'widgetPlayerHead', {
        widgetId,
    });
};

export const sendWidgetNpcHead = (player: Player, widgetId: number, npcId: number): void => {
    handleOutboundPacket(player, 'widgetNpcHead', {
        widgetId,
        npcId,
    });
};

export const sendWidgetString = (player: Player, widgetId: number, message: string): void => {
    handleOutboundPacket(player, 'updateWidgetString', {
        widgetId,
        message,
    });
};

export const sendCloseWidgets = (player: Player): void => {
    handleOutboundPacket(player, 'closeWidgets', {});
};

export const sendSideBarWidget = (player: Player, sidebarId: number, widgetId: number): void => {
    handleOutboundPacket(player, 'sidebarWidget', {
        widgetId,
        sidebarId,
    });
};

export const sendFlashSidebarIcon = (player: Player, sidebarId: number): void => {
    handleOutboundPacket(player, 'flashSideBarIcon', {
        sidebarId,
    });
};

export const sendSystemUpdate = (player: Player, time: number): void => {
    handleOutboundPacket(player, 'systemUpdate', {
        time,
    });
};

export const sendLogout = (player: Player): void => {
    handleOutboundPacket(player, 'logout', {});
};

export const sendWelcomeScreen = (player: Player): void => {
    handleOutboundPacket(player, 'welcomeScreen', {});
};

export const sendFriendsList = (player: Player, friendListStatus: number): void => {
    handleOutboundPacket(player, 'friendsList', {
        friendListStatus,
    });
};

export const sendSkill = (player: Player, skillId: number, skillLevel: number, skillExperience: number): void => {
    handleOutboundPacket(player, 'updateSkill', {
        skillId,
        skillLevel,
        skillExperience,
    });
};
