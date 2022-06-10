import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
  EraPayout,
  StakingElection,
  IdGenerator,
  CloverActionHistory,
} from "../types/models";

import {
  CloverActiontype,
  formatSymbol,
} from "../constants";

const generaterID = "GENERATOR";

const getID = async () => {
  let generator = await IdGenerator.get(generaterID);
  if (generator == null) {
    generator = new IdGenerator(generaterID);
    const id = BigInt(0).valueOf()
    generator.aID = id;
    await generator.save();
    logger.info(`first aID is : ${id}`);
    return id;
  } else {
    const id = generator.aID + BigInt(1).valueOf();
    generator.aID = id;
    await generator.save();
    logger.info(`new aID is : ${id}`);
    return id;
  }
};

export const handleEraPayout = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`New Round created: ${JSON.stringify(event)}`);
  const [eraIndex, validatorPayout, remainder] = event.data.toJSON() as [
    string,
    string,
    string
  ];

  // const {event: {data: [blockNumber,roundindex,collators,balance]}} = substrateEvent;
  logger.info(`New EraPayout created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: EraPayout = await EraPayout.create({
    id: blockNum.toString() + "-" + id.toString(),
    eraIndex: Number(eraIndex),
    validatorPayoutBalance: formatSymbol(Number(BigInt(validatorPayout).toString(10))),
    remainder: formatSymbol(Number(BigInt(remainder).toString(10))),
    blocknumber: BigInt(blockNum.toNumber()),
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleReward = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [account, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Reward created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: account + blockNum.toString() + "-" + id.toString(),
    account: account,
    amount: formatSymbol(Number(BigInt(balance).toString(10))),
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.REWARD,
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleSlash = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [account, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Slash created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: account + blockNum.toString() + "-" + id.toString(),
    account: account,
    amount: formatSymbol(Number(BigInt(balance).toString(10))), //One validator (and its nominators) has been slashed by the given amount
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.SLASH,
    isValidator: 1, 
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleOldSlashingReportDiscarded = async (
  substrateEvent: SubstrateEvent
) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [sessionIndex] = event.data.toJSON() as [string];
  logger.info(`New OldSlashingReportDiscarded created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory =
    await CloverActionHistory.create({
      id: blockNum.toString() + "-" + id.toString(),
      sessionIndex: parseInt(sessionIndex),
      blocknumber: BigInt(blockNum.toNumber()),
      actionType: CloverActiontype.OLD_SLASHING_REPORT_DISCARDED,
      timestamp: createdAt,
    });
  await newRecord.save();
};

export const handleStakingElection = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [electionCompute] = event.data.toJSON() as [string];
  logger.info(`New StakingElection created at block: ${blockNum}`);

  let newRecord: StakingElection = await StakingElection.create({
    id: blockNum.toString(),
    electionCompute: electionCompute,
    blocknumber: BigInt(blockNum.toNumber()),
    timestamp: createdAt,
  });
  await newRecord.save();
};

// export const handleSolutionStored = async (substrateEvent: SubstrateEvent) => {
//   const { event, block } = substrateEvent;
//   const { timestamp: createdAt, block: rawBlock } = block;
//   const { number: blockNum } = rawBlock.header;

//   const [electionCompute] = event.data.toJSON() as [string];
//   logger.info(`New SolutionStored created at block: ${blockNum}`);

//   let newRecord: SolutionStored = await SolutionStored.create({
//     id: blockNum.toString() + "-" + getID().toString(),
//     electionCompute: electionCompute,
//     blocknumber: BigInt(blockNum.toNumber()),
//     timestamp: createdAt,
//   });
//   await newRecord.save();
// };

export const handleBonded = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [accountId, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Bonded created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: accountId + blockNum.toString() + "-" + id.toString(),
    account: accountId,
    amount: formatSymbol(Number(BigInt(balance).toString(10))),
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.BONDED,
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleUnbonded = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [accountId, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Unbonded created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: accountId + blockNum.toString() + "-" + id.toString(),
    account: accountId,
    amount: formatSymbol(Number(BigInt(balance).toString(10))),
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.UNBONDED,
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleWithdrawn = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [accountId, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Withdrawn created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: accountId + blockNum.toString() + "-" + id.toString(),
    account: accountId,
    amount: formatSymbol(Number(BigInt(balance).toString(10))),
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.WITHDRAWN,
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleKicked = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [nominatorAccountId, validatorAccountId] = event.data.toJSON() as [
    string,
    string
  ];
  logger.info(`New Kicked created at block: ${blockNum}`);

  let id = await getID();
  let newRecord: CloverActionHistory = await CloverActionHistory.create({
    id: nominatorAccountId + blockNum.toString() + "-" + id.toString(),
    account: nominatorAccountId,
    validatorAccount: validatorAccountId,
    blocknumber: BigInt(blockNum.toNumber()),
    actionType: CloverActiontype.KICKED,
    isValidator: 0, 
    isKicked: 1,
    timestamp: createdAt,
  });
  await newRecord.save();
};
