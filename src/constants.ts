export const CloverActiontype = {
    "REWARD": "Reward",
    "SLASH": "Slash",
    "OLD_SLASHING_REPORT_DISCARDED": "OldSlashingReportDiscarded",
    "BONDED": "Bonded",
    "UNBONDED": "Unbonded",
    "WITHDRAWN": "Withdrawn",
    "KICKED": "Kicked",
};

export const SymbolDecimals = 18;
export function formatSymbol(value: number) {
    return (value / Math.pow(10, SymbolDecimals));
}
// export function getPointReward(blocks: number = 1) {
//     return 20 * blocks;
// }