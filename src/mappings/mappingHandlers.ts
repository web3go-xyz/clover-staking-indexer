import { SubstrateEvent } from "@subql/types";
import { SubstrateBlock } from "@subql/types";
import {
  handleEraPayout,
  handleReward,
  handleSlash,
  handleOldSlashingReportDiscarded,
  handleStakingElection,
  handleBonded,
  handleWithdrawn,
  handleUnbonded,
  handleKicked,
} from "../handlers/parachain-handler";

const eventsMapping = {
  "staking/EraPayout": handleEraPayout,
  "staking/Reward": handleReward,
  "staking/Slash": handleSlash,
  "staking/OldSlashingReportDiscarded": handleOldSlashingReportDiscarded, //先记录下来，暂时不考虑
  "staking/StakingElection": handleStakingElection,
  // "staking/SolutionStored": handleSolutionStored,
  "staking/Bonded": handleBonded,
  "staking/Unbonded": handleUnbonded,
  "staking/Withdrawn": handleWithdrawn,
  "staking/Kicked": handleKicked,
  // "grandpa/NewAuthorities": handleNewAuthorities,
};

export async function handleBlock(block: SubstrateBlock): Promise<void> {

}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const {
    event: { method, section },
    block: {
      block: { header },
    },
    idx,
    extrinsic,
  } = event;

  const eventType = `${section}/${method}`;
  const { method: extMethod, section: extSection } =
    extrinsic?.extrinsic.method || {};
  logger.info("===eventType=" + eventType);
  const handler = eventsMapping[eventType];
  if (handler) {
    logger.info(
      `
      Event ${eventType} at ${idx} received, block: ${header.number.toNumber()}, extrinsic: ${extSection}/${extMethod}:
      -------------
        ${JSON.stringify(event.toJSON(), null, 2)} ${JSON.stringify(
        event.toHuman(),
        null,
        2
      )}
      =============
      `
    );
    await handler(event);
  }
}
