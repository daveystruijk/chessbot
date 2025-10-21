const kFactor = 15;

export const calculateRanking = ({
  playerA,
  playerB,
  winner,
}: {
  playerA: number;
  playerB: number;
  winner: 'playerA' | 'playerB' | 'draw';
}): { playerA: number; playerB: number } => {
  const expectation = 1 / (1 + Math.pow(10, (playerB - playerA) / 400));

  const result = {
    playerA: 1,
    draw: 0.5,
    playerB: 0,
  }[winner];

  return {
    playerA: playerA + kFactor * (result - expectation),
    playerB: playerB + kFactor * (expectation - result),
  };
};
