import { Core } from '@blaze-cardano/sdk';

function toUnixTime(config: Core.SlotConfig, slot: Core.Slot): number {
  const { zeroSlot, slotLength, zeroTime } = config;
  const deltaSlot = slot - zeroSlot;
  const halfSlotLength = Math.floor(0.5 * slotLength);
  const msAfterZeroSlot = deltaSlot * slotLength + halfSlotLength;
  return zeroTime + msAfterZeroSlot;
}

function unixToSlot(config: Core.SlotConfig, unixTime: number): Core.Slot {
  const { zeroSlot, slotLength, zeroTime } = config;
  const timePassed = unixTime - zeroTime;
  const slotsPassed = Math.floor(timePassed / slotLength);
  return Core.Slot(zeroSlot + slotsPassed);
}



export { unixToSlot, toUnixTime}