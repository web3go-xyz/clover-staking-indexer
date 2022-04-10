import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
  EraPayout,
  Reward,
  Slash,
  OldSlashingReportDiscarded,
  StakingElection,
  SolutionStored,
  Bonded,
  Unbonded,
  Withdrawn,
  Kicked,
  IDGenerator,
} from "../types/models";

const generaterID = "GENERATOR";

const getID = async () => {
  let generator = await IDGenerator.get(generaterID);
  if (generator == null) {
    generator = new IDGenerator(generaterID);
    generator.aID = BigInt(0).valueOf();
    await generator.save();
    logger.info(`first aID is : ${generator.aID}`);
    return generator.aID;
  } else {
    generator.aID = generator.aID + BigInt(1).valueOf();
    await generator.save();
    logger.info(`new aID is : ${generator.aID}`);
    return generator.aID;
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

  let newRecord: EraPayout = await EraPayout.create({
    id: blockNum.toString() + "-" + getID().toString(),
    eraIndex: Number(eraIndex),
    validatorPayoutBalance: validatorPayout,
    remainder: remainder,
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

  let newRecord: Reward = await Reward.create({
    id: blockNum.toString() + "-" + getID().toString(),
    account: account,
    amount: balance,
    blocknumber: BigInt(blockNum.toNumber()),
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

  let newRecord: Slash = await Slash.create({
    id: blockNum.toString() + "-" + getID().toString(),
    validatorAccount: account,
    amount: balance,
    blocknumber: BigInt(blockNum.toNumber()),
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

  let newRecord: OldSlashingReportDiscarded =
    await OldSlashingReportDiscarded.create({
      id: blockNum.toString() + "-" + getID().toString(),
      sessionIndex: sessionIndex,
      blocknumber: BigInt(blockNum.toNumber()),
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
    id: blockNum.toString() + "-" + getID().toString(),
    electionCompute: electionCompute,
    blocknumber: BigInt(blockNum.toNumber()),
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleSolutionStored = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [electionCompute] = event.data.toJSON() as [string];
  logger.info(`New SolutionStored created at block: ${blockNum}`);

  let newRecord: SolutionStored = await SolutionStored.create({
    id: blockNum.toString() + "-" + getID().toString(),
    electionCompute: electionCompute,
    blocknumber: BigInt(blockNum.toNumber()),
    timestamp: createdAt,
  });
  await newRecord.save();
};

export const handleBonded = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  const [accountId, balance] = event.data.toJSON() as [string, string];
  logger.info(`New Bonded created at block: ${blockNum}`);

  let newRecord: Bonded = await Bonded.create({
    id: blockNum.toString() + "-" + getID().toString(),
    account: accountId,
    amount: balance,
    blocknumber: BigInt(blockNum.toNumber()),
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

  let newRecord: Unbonded = await Unbonded.create({
    id: blockNum.toString() + "-" + getID().toString(),
    account: accountId,
    amount: balance,
    blocknumber: BigInt(blockNum.toNumber()),
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

  let newRecord: Withdrawn = await Withdrawn.create({
    id: blockNum.toString() + "-" + getID().toString(),
    account: accountId,
    withdrawUnbondingAmount: balance,
    blocknumber: BigInt(blockNum.toNumber()),
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

  let newRecord: Kicked = await Kicked.create({
    id: blockNum.toString() + "-" + getID().toString(),
    nominatorAccount: nominatorAccountId,
    validatorAccount: validatorAccountId,
    blocknumber: BigInt(blockNum.toNumber()),
    timestamp: createdAt,
  });
  await newRecord.save();
};
