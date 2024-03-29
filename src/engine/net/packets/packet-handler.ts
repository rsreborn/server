import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../../world/player';
import { Coord, getLocalCoord, getMapCoord } from '../../world';
import inboundPackets from './inbound-packets';
import outboundPackets from './outbound-packets';
import INBOUND_PACKET_SIZES from './inbound-packet-sizes';
import { InboundPacket, OutboundPacket, PacketQueueType, PacketSize } from './packets';
import { HintType } from './outbound-packets/encoders/show-hint-icon-packet';
import { ChatSettings } from './outbound-packets/encoders/update-chat-settings-packet';

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

    const knownPacket = INBOUND_PACKET_SIZES[String(buildNumber)]?.[String(opcode)] !== undefined;
    if (!knownPacket) {
        logger.warn(`Unknown packet ${ opcode } encountered!`);
        return false;
    }

    return true;
};

export const handleOutboundPacket = <T = any>(
    player: Player,
    packetName: string,
    data?: T,
): void => {
    if (player.client == null) {
        return;
    }
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
    if (player.client == null) {
        return;
    }
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

export const sendPlayerDetails = (player: Player): void => {
    handleOutboundPacket(player, 'playerDetails');
}

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

export const sendWindowPane = (player: Player, windowId: number): void => {
    handleOutboundPacket(player, 'windowPane', {
        windowId,
    }); 
};

export const sendWidget = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'widget', {
        widgetId,
    }); 
};

export const sendWalkableWidget = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'walkableWidget', {
        widgetId,
    }); 
};

export const sendClearItemContainer = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'clearItemContainer', {
        widgetId,
    }); 
};

export const sendChatboxWidgetOnly = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'chatboxWidgetOnly', {
        widgetId,
    }); 
};

export const sendChatboxWidget = (player: Player, widgetId: number): void => {
    handleOutboundPacket(player, 'chatboxWidget', {
        widgetId,
    }); 
};

export const sendHintIcon = (player: Player, hintType: HintType, entityIndex: number, position?: Coord): void => {
    handleOutboundPacket(player, 'showHintIcon', {
        hintType,
        entityIndex,
        position,
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

export const sendWidgetStringColor = (player: Player, widgetId: number, widgetColor: number): void => {
    handleOutboundPacket(player, 'widgetStringDisabledColor', {
        widgetId,
        widgetColor,
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

export const sendUpdateActiveSidebar = (player: Player, sidebarId: number): void => {
    handleOutboundPacket(player, 'updateActiveSidebar', {
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

export const sendResetButtonState = (player: Player): void => {
    handleOutboundPacket(player, 'resetButtonState', {});
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

export const sendWidgetItem = (player: Player, widgetId: number, itemId: number, itemZoom: number): void => {
    handleOutboundPacket(player, 'widgetItem', {
        widgetId,
        itemId,
        itemZoom
    });
};

export const sendHideWidgetComponent = (player: Player, widgetId: number, shouldHideComponent: boolean): void => {
    handleOutboundPacket(player, 'hideWidgetComponent', {
        widgetId,
        shouldHideComponent,
    });
};

export const sendUpdateChatSettings = (player: Player, publicChatValue: ChatSettings, privateChatValue: ChatSettings, tradeChatValue: ChatSettings): void => {
    handleOutboundPacket(player, 'updateChatSettings', {
        publicChatValue,
        privateChatValue,
        tradeChatValue,
    });
};

export const sendGameScreenAndSidebarWidget = (player: Player, widgetId: number, sidebarWidgetId: number): void => {
    handleOutboundPacket(player, 'gameScreenAndSidebar', {
        widgetId,
        sidebarWidgetId,
    });
};

export const sendEnterAmount = (player: Player): void => {
    handleOutboundPacket(player, 'enterAmount', { });
}

export const sendResetCamera = (player: Player): void => {
    handleOutboundPacket(player, 'resetCamera', { });
}

// Todo: figure out the params for this packet.
export const sendUpdateCamera = (player: Player): void => {
    handleOutboundPacket(player, 'updateCamera', {

    });
}

export const sendUpdateCoords = (player: Player, xCoord, yCoord): void => {
    handleOutboundPacket(player, 'updateCoords', {
        xCoord,
        yCoord,
    });
}

export const sendUpdatePlayerOption = (player: Player, optionNumber: number, optionText: string, shouldDisplayAsTopOfList: boolean): void => {
    handleOutboundPacket(player, 'updatePlayerOption', {
        optionNumber,
        optionText,
        shouldDisplayAsTopOfList,
    });
}

export const sendConfig = (player: Player, configId: number, configValue: number): void => {
    if (configValue < 128) {
        handleOutboundPacket(player, 'configLow', {
            configId,
            configValue,
        });
    } else {
        handleOutboundPacket(player, 'configHigh', {
            configId,
            configValue,
        });
    }
}

export const sendUpdateWidgetPosition = (player: Player, widgetId: number, xOffset: number, yOffset: number): void => {
    handleOutboundPacket(player, 'updateWidgetPosition', {
        widgetId,
        xOffset,
        yOffset,
    });
}

export const sendMultiwayIcon = (player: Player, showMultiwayIcon: boolean): void => {
    handleOutboundPacket(player, 'showMultiwayIcon', {
        showMultiwayIcon
     });
}

export const sendUpdateRunEnergy = (player: Player, runEnergy: number): void => {
    handleOutboundPacket(player, 'updateRunEnergy', {
        runEnergy
     });
}

export const sendUpdateWeight = (player: Player, weight: number): void => {
    handleOutboundPacket(player, 'updateWeight', {
        weight
     });
}



export const sendUpdateScrollbarPosition = (player: Player, widgetId: number, pixelsToMove: number): void => {
    handleOutboundPacket(player, 'updateScrollbarPosition', {
        widgetId,
        pixelsToMove
     });
}

export const sendAddGroundItem = (player: Player, position: Coord, itemId: number, itemAmount: number, positionOffset?: number): void => {
    handleOutboundPacket(player, 'addGroundItem', {
        position,
        itemId,
        itemAmount,
        positionOffset,
     });
}

export const sendRemoveGroundItem = (player: Player, position: Coord, itemId: number, positionOffset?: number): void => {
    handleOutboundPacket(player, 'removeGroundItem', {
        position,
        itemId,
        positionOffset,
     });
}

export const sendAddObject = (player: Player, position: Coord, objectId: number, objectType: number, objectOrientation: number, positionOffset?: number): void => {
    handleOutboundPacket(player, 'addObject', {
        position,
        objectId,
        objectType,
        objectOrientation,
        positionOffset,
     });
}

export const sendRemoveObject = (player: Player, position: Coord, objectType: number, objectOrientation: number, positionOffset?: number): void => {
    handleOutboundPacket(player, 'removeObject', {
        position,
        objectType,
        objectOrientation,
        positionOffset,
     });
}

export const sendAnimateObject = (player: Player, position: Coord, animationId: number, objectType: number, objectOrientation: number, positionOffset?: number): void => {
    handleOutboundPacket(player, 'animateObject', {
        position,
        animationId,
        objectType,
        objectOrientation,
        positionOffset,
     });
}

export const sendStationaryGraphic = (player: Player, position: Coord, graphicId: number, height: number, delay: number, offset?: number): void => {
    handleOutboundPacket(player, 'stationaryGraphic', {
        position,
        graphicId,
        height,
        delay,
        offset,
    });
}

export const sendProjectile = (player: Player): void => {
    handleOutboundPacket(player, 'projectile', {

    });
}

export const sendTestPacket = (player: Player): void => {
    handleOutboundPacket(player, 'justTesting', {

    });
}
