// Sector-based candidate ranking data.
//
// TODO(backend): replace every function body in this file with real fetch()
// calls once the backend endpoints exist. Suggested contract:
//   GET /api/sectors/:sector/top?limit=5   -> Candidate[]
//   GET /api/sectors/:sector/leaderboard?limit=25 -> Candidate[]
// Until then this returns generated mock data so the UI can be built and
// wired up against a stable shape.

export const SECTORS = [
  'Frontend Development',
  'Backend Development',
  'Data Analysis',
  'Product Design',
  'DevOps',
  'UX Research',
  'Marketing',
];

const NAME_POOL = [
  'Layla Hassan', 'Omar Al-Sabti', 'Farah Nasser', 'Yousif Kareem',
  'Dana Saleh', 'Ali Mahmoud', 'Rana Fadel', 'Zainab Kadhim',
  'Hassan Jabbar', 'Noor Adnan', 'Mustafa Karim', 'Sara Talib',
  'Ahmed Fawzi', 'Mariam Salih', 'Karim Zaidan', 'Hiba Rasheed',
  'Tariq Munir', 'Lina Abbas', 'Bashar Odeh', 'Reem Qassim',
  'Jassim Alwan', 'Nadia Fouad', 'Wael Hamdan', 'Salma Rida',
  'Fadi Ghanem',
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

// Deterministic pseudo-random score generator so cards don't jitter wildly
// between the 60s refreshes — seeded by sector + rank + a slow-moving time
// bucket (changes once a minute), so it re-shuffles on every "refresh"
// but a given minute is reproducible.
function seededScore(seed, low = 82, high = 99) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return low + (h % (high - low + 1));
}

function candidatesForSector(sector, count, timeBucket) {
  const shuffled = [...NAME_POOL].sort(
    (a, b) => seededScore(`${sector}-${a}-${timeBucket}`) - seededScore(`${sector}-${b}-${timeBucket}`)
  );
  return shuffled.slice(0, count).map((name, i) => {
    const score = seededScore(`${sector}-${name}-${timeBucket}-score`);
    return {
      id: `${sector}-${name}`,
      rank: i + 1,
      name,
      initials: initials(name),
      sector,
      score,
    };
  }).sort((a, b) => b.score - a.score).map((c, i) => ({ ...c, rank: i + 1 }));
}

function currentMinuteBucket() {
  return Math.floor(Date.now() / 60_000);
}

const HOME_CARD_COUNT = 5;

// Top candidate from each of the first 5 sectors, for the home page cards.
export async function getHomeTopCandidates() {
  const bucket = currentMinuteBucket();
  return SECTORS.slice(0, HOME_CARD_COUNT).map((sector) => candidatesForSector(sector, 1, bucket)[0]);
}

// Top N (default 25) candidates within a single sector, for the leaderboard page.
export async function getSectorLeaderboard(sector, limit = 25) {
  const bucket = currentMinuteBucket();
  return candidatesForSector(sector, limit, bucket);
}
