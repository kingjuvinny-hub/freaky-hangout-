import { Turn, Player, GameAward, GameAwardType } from "../types";

// Fisher-Yates shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};


export const generateAwards = (history: Turn[], players: Player[]): GameAward[] => {
    if (history.length === 0 || players.length === 0) return [];
    
    const awards: GameAward[] = [];
    const playerStats: { [id: string]: { completed: number; forfeited: number; doubleDowns: number } } = {};

    players.forEach(p => {
        playerStats[p.id] = { completed: 0, forfeited: 0, doubleDowns: 0 };
    });

    history.forEach(turn => {
        if (!playerStats[turn.player.id]) return;
        if (turn.completed) {
            playerStats[turn.player.id].completed++;
        } else {
            playerStats[turn.player.id].forfeited++;
        }
        if (turn.isDoubleDown) {
            playerStats[turn.player.id].doubleDowns++;
        }
    });

    // Daredevil Award
    const maxCompleted = Math.max(...Object.values(playerStats).map(s => s.completed));
    if (maxCompleted > 0) {
        const daredevils = players.filter(p => playerStats[p.id].completed === maxCompleted);
        if (daredevils.length === 1) {
            awards.push({ type: GameAwardType.DAREDEVIL, player: daredevils[0], description: `Completed the most dares (${maxCompleted})!` });
        }
    }

    // Most Cautious Award
    const maxForfeited = Math.max(...Object.values(playerStats).map(s => s.forfeited));
    if (maxForfeited > 0) {
        const cautiousPlayers = players.filter(p => playerStats[p.id].forfeited === maxForfeited);
        if (cautiousPlayers.length === 1) {
            awards.push({ type: GameAwardType.MOST_CAUTIOUS, player: cautiousPlayers[0], description: `Forfeited the most dares (${maxForfeited})!` });
        }
    }
    
    // High Roller Award
    const maxDoubleDowns = Math.max(...Object.values(playerStats).map(s => s.doubleDowns));
    if (maxDoubleDowns > 0) {
        const highRollers = players.filter(p => playerStats[p.id].doubleDowns === maxDoubleDowns);
        if (highRollers.length === 1) {
            awards.push({ type: GameAwardType.HIGH_ROLLER, player: highRollers[0], description: `Took the biggest risks with ${maxDoubleDowns} Double Downs!` });
        }
    }

    return awards;
};