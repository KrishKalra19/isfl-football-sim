import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const FIRST_NAMES = ["Jacob","Michael","Joshua","Matthew","Daniel","Christopher","Andrew","Ethan","Joseph","William","Anthony","David","Alexander","Nicholas","Ryan","Tyler","James","John","Jonathan","Noah","Brandon","Christian","Dylan","Samuel","Benjamin","Nathan","Zachary","Logan","Justin","Gabriel","Jose","Austin","Kevin","Elijah","Caleb","Robert","Thomas","Jordan","Cameron","Jack","Hunter","Jackson","Angel","Isaiah","Evan","Isaac","Luke","Mason","Jayden","Jason","Gavin","Aaron","Connor","Aiden","Aidan","Kyle","Juan","Charles","Luis","Adam","Lucas","Brian","Eric","Adrian","Nathaniel","Sean","Alex","Carlos","Bryan","Ian","Owen","Jesus","Landon","Julian","Chase","Cole","Diego","Jeremiah","Steven","Sebastian","Xavier","Timothy","Carter","Wyatt","Brayden","Blake","Hayden","Devin","Cody","Richard","Seth","Dominic","Jaden","Antonio","Miguel","Liam","Patrick","Carson","Jesse","Tristan","Alejandro","Henry","Victor","Trevor","Bryce","Jake","Riley","Colin","Jared","Jeremy","Mark","Caden","Garrett","Parker","Marcus","Vincent","Kaleb","Kaden","Brady","Colton","Kenneth","Joel","Oscar","Josiah","Jorge","Ashton","Cooper","Tanner","Eduardo","Paul","Edward","Ivan","Preston","Maxwell","Alan","Levi","Stephen","Grant","Nicolas","Dakota","Omar","Alexis","George","Eli","Collin","Spencer","Gage","Max","Ricardo","Cristian","Derek","Micah","Brody","Francisco","Nolan","Ayden","Dalton","Shane","Peter","Damian","Jeffrey","Brendan","Travis","Fernando","Peyton","Conner","Andres","Javier","Giovanni","Shawn","Braden","Jonah","Bradley","Cesar","Emmanuel","Manuel","Edgar","Mario","Erik","Edwin","Johnathan","Devon","Erick","Wesley","Oliver","Trenton","Hector","Malachi","Jalen","Raymond","Gregory","Abraham","Elias","Leonardo","Sergio","Donovan","Colby","Marco","Bryson","Martin"];
const LAST_NAMES = ["SMITH","JOHNSON","WILLIAMS","BROWN","JONES","GARCIA","MILLER","DAVIS","RODRIGUEZ","MARTINEZ","HERNANDEZ","LOPEZ","GONZALEZ","WILSON","ANDERSON","THOMAS","TAYLOR","MOORE","JACKSON","MARTIN","LEE","PEREZ","THOMPSON","WHITE","HARRIS","SANCHEZ","CLARK","RAMIREZ","LEWIS","ROBINSON","WALKER","YOUNG","ALLEN","KING","WRIGHT","SCOTT","TORRES","NGUYEN","HILL","FLORES","GREEN","ADAMS","NELSON","BAKER","HALL","RIVERA","CAMPBELL","MITCHELL","CARTER","ROBERTS","GOMEZ","PHILLIPS","EVANS","TURNER","DIAZ","PARKER","CRUZ","EDWARDS","COLLINS","REYES","STEWART","MORRIS","MORALES","MURPHY","COOK","ROGERS","GUTIERREZ","ORTIZ","MORGAN","COOPER","PETERSON","BAILEY","REED","KELLY","HOWARD","RAMOS","KIM","COX","WARD","RICHARDSON","WATSON","BROOKS","CHAVEZ","WOOD","JAMES","BENNETT","GRAY","MENDOZA","RUIZ","HUGHES","PRICE","ALVAREZ","CASTILLO","SANDERS","PATEL","MYERS","LONG","ROSS","FOSTER","JIMENEZ","POWELL","JENKINS","PERRY","RUSSELL","SULLIVAN","BELL","COLEMAN","BUTLER","HENDERSON","BARNES","GONZALES","FISHER","VASQUEZ","SIMMONS","ROMERO","JORDAN","PATTERSON","ALEXANDER","HAMILTON","GRAHAM","REYNOLDS","GRIFFIN","WALLACE","MORENO","WEST","COLE","HAYES","BRYANT","HERRERA","GIBSON","ELLIS","TRAN","MEDINA","AGUILAR","STEVENS","MURRAY","FORD","CASTRO","MARSHALL","OWENS","HARRISON","FERNANDEZ","MCDONALD","WOODS","WASHINGTON","KENNEDY","WELLS","VARGAS","HENRY","CHEN","FREEMAN","WEBB","TUCKER","GUZMAN","BURNS","CRAWFORD","OLSON","SIMPSON","PORTER","HUNTER","GORDON","MENDEZ","SILVA","SHAW","SNYDER","MASON","DIXON","MUNOZ","HUNT","HICKS","HOLMES","PALMER","WAGNER","BLACK","ROBERTSON","BOYD","ROSE","STONE","SALAZAR","FOX","WARREN","MILLS","MEYER","RICE","SCHMIDT","GARZA","DANIELS","FERGUSON","NICHOLS","STEPHENS","SOTO","WEAVER","RYAN","GARDNER","PAYNE","GRANT","DUNN","KELLEY","SPENCER","HAWKINS","ARNOLD","PIERCE","VAZQUEZ","HANSEN","PETERS","SANTOS","HART","BRADLEY","KNIGHT","ELLIOTT","CUNNINGHAM","DUNCAN","ARMSTRONG","HUDSON","CARROLL","LANE","RILEY","ANDREWS","ALVARADO","RAY","DELGADO","BERRY","PERKINS","HOFFMAN","JOHNSTON","MATTHEWS","PENA","RICHARDS","CONTRERAS","WILLIS","CARPENTER","LAWRENCE","SANDOVAL","GUERRERO","GEORGE","CHAPMAN","RIOS","ESTRADA","ORTEGA","WATKINS","GREENE","NUNEZ","WHEELER","VALDEZ","HARPER","BURKE","LARSON","SANTIAGO","MALDONADO","MORRISON"];

const ALL_TEAM_NAMES = [
  "Dorne Defenders", "King's Landing Knights", "Westeros White Walkers",
  "Albuquerque Blues", "Scranton Stranglers", "Pawnee Penguins",
  "Greendale Humans", "New York 30Rockers", "Orange County Arresters",
  "Winterfell Wizards", "Dunder Mifflin Devils", "Springfield Isotopes",
  "Hawkins Hawks", "Crenshaw Cavaliers", "Quahog Quagmires"
];

const DIVISIONS = [
  { name: "Prestige Division", teams: ["Dorne Defenders", "King's Landing Knights", "Westeros White Walkers", "Winterfell Wizards", "Hawkins Hawks"] },
  { name: "Workplace Division", teams: ["Scranton Stranglers", "Pawnee Penguins", "Greendale Humans", "New York 30Rockers", "Dunder Mifflin Devils"] },
  { name: "Wildcard Division", teams: ["Albuquerque Blues", "Orange County Arresters", "Springfield Isotopes", "Crenshaw Cavaliers", "Quahog Quagmires"] },
];

function teamDivision(name) {
  const d = DIVISIONS.find(d => d.teams.includes(name));
  return d ? d.name : "";
}

function generateLeagueStandings(yourName, yourWins) {
  return ALL_TEAM_NAMES.map(name => {
    const wins = name === yourName ? yourWins : Math.max(2, Math.min(15, 4 + randInt(10)));
    return { name, wins, losses: 17 - wins, division: teamDivision(name) };
  });
}

const POSITIONS = ["QB", "RB", "WR", "EDGE", "LB", "CB"];
const POS_MULTIPLIERS = { QB: 1, RB: 0.262, WR: 0.554, EDGE: 0.615, LB: 0.477, CB: 0.523 };

// ─── GAME LOGIC (ported from Java) ─────────────────────────────────────────
function randInt(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[randInt(arr.length)]; }

function makeName() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return `${first} ${last.charAt(0)}${last.slice(1).toLowerCase()}`;
}

function checkTrait(age) {
  if (age < 25) return 0;
  if (age < 30) return 1;
  if (age < 33) return 2;
  if (age < 36) return 3;
  return 4;
}

function createPlayer() {
  let ovr = 59;
  if (Math.random() < 0.5) ovr += randInt(10);
  else ovr -= randInt(6);
  const age = 21 + randInt(16);
  return { name: makeName(), ovr, age, devTrait: checkTrait(age), salary: 0, ovrC: 0 };
}

function newContract(p, mult) {
  let ovrMult = 0;
  if (p.ovr < 65) ovrMult = 25;
  else if (p.ovr < 70) ovrMult = 35;
  else if (p.ovr < 76) ovrMult = 50;
  else if (p.ovr < 83) ovrMult = 68;
  else if (p.ovr < 91) ovrMult = 85;
  else ovrMult = 100;
  ovrMult /= 100;

  let sal = 0;
  if (p.devTrait === 0) sal = Math.floor(mult * 9 * ovrMult) + 1;
  else if (p.devTrait === 1) sal = Math.floor(mult * 50 * ovrMult);
  else if (p.devTrait === 2) sal = Math.floor(mult * 48 * ovrMult);
  else if (p.devTrait === 3) sal = Math.floor(mult * 45 * ovrMult);
  else sal = Math.floor(mult * 40 * ovrMult);
  return { ...p, salary: sal };
}

function developPlayer(p) {
  let ovr = p.ovr;
  const ovrC = ovr;
  p = { ...p };
  p.age += 1;
  p.devTrait = checkTrait(p.age);

  if (p.devTrait === 0) { ovr++; if (Math.random() < 0.5) ovr++; if (Math.random() < 0.25) ovr++; }
  else if (p.devTrait === 1) { ovr++; if (Math.random() < 0.25) ovr++; }
  else if (p.devTrait === 2) { if (Math.random() < 0.25) ovr--; else if (Math.random() < 0.5) ovr++; }
  else if (p.devTrait === 3) { if (Math.random() < 0.5) ovr--; ovr--; }
  else { if (Math.random() < 0.5) ovr--; if (Math.random() < 0.5) ovr--; ovr -= 3; }

  if (ovr > 99) ovr = 99;
  p.ovr = ovr;
  p.ovrC = ovrC;
  return p;
}

function devStr(p) {
  if (!p.ovrC) return "";
  const diff = p.ovr - p.ovrC;
  if (Math.abs(diff) > 3) return "";
  return diff >= 0 ? `+${diff}` : `${diff}`;
}

function bestOf(roster, positions) {
  let best = null, bestPos = null;
  positions.forEach(pos => {
    const p = roster[pos];
    if (!best || p.ovr > best.ovr) { best = p; bestPos = pos; }
  });
  return best ? { player: best, pos: bestPos } : null;
}

function bestRookie(roster) {
  let best = null, bestPos = null;
  POSITIONS.forEach(pos => {
    const p = roster[pos];
    if (p.age <= 22 && (!best || p.ovr > best.ovr)) { best = p; bestPos = pos; }
  });
  return best ? { player: best, pos: bestPos } : null;
}

function bestComeback(roster) {
  let best = null, bestPos = null;
  POSITIONS.forEach(pos => {
    const p = roster[pos];
    const d = devStr(p);
    if (d && d.startsWith("+") && (!best || p.ovr > best.ovr)) { best = p; bestPos = pos; }
  });
  return best ? { player: best, pos: bestPos } : null;
}

function rollAwards(roster) {
  const categories = [
    { label: "MVP", cand: bestOf(roster, POSITIONS) },
    { label: "Offensive Player of the Year", cand: bestOf(roster, ["QB", "RB", "WR"]) },
    { label: "Defensive Player of the Year", cand: bestOf(roster, ["EDGE", "LB", "CB"]) },
    { label: "Rookie of the Year", cand: bestRookie(roster) },
    { label: "Comeback Player of the Year", cand: bestComeback(roster) },
  ];
  const results = [];
  categories.forEach(cat => {
    if (!cat.cand) return;
    const chance = Math.max(0.03, Math.min(0.85, (cat.cand.player.ovr - 65) / 35));
    if (Math.random() < chance) {
      results.push({ award: cat.label, playerName: cat.cand.player.name, pos: cat.cand.pos, ovr: cat.cand.player.ovr });
    }
  });
  return results;
}

function needsResign(age) {
  return (age % 4 === 0 && age !== 24) || age === 25;
}

function calcOffOvr(roster) {
  return (roster.QB.ovr * 0.525) + (roster.RB.ovr * 0.15) + (roster.WR.ovr * 0.325);
}
function calcDefOvr(roster) {
  return (roster.EDGE.ovr * 0.4) + (roster.LB.ovr * 0.3) + (roster.CB.ovr * 0.3);
}
function calcOvr(roster) {
  return Math.floor((calcOffOvr(roster) + calcDefOvr(roster)) / 2);
}
function calcSalarySpent(roster) {
  return POSITIONS.reduce((s, pos) => s + roster[pos].salary, 0);
}

function applyInjuries(roster, injuries) {
  const out = {};
  POSITIONS.forEach(pos => {
    const inj = injuries[pos];
    out[pos] = inj ? { ...roster[pos], ovr: Math.max(30, roster[pos].ovr - inj.penalty) } : roster[pos];
  });
  return out;
}

const INJURY_CHANCE_PER_WEEK = 0.05;

function playGame(offOvr, defOvr, opponentTeams) {
  const teamsCopy = [...opponentTeams];
  const idx = randInt(teamsCopy.length);
  const oppName = teamsCopy.splice(idx, 1)[0];

  let yourScore = 0, oppScore = 0;
  const xran = offOvr / 160;
  const yran = defOvr / 160;

  let addOn = 0;
  [3,7,3,6,3,7].forEach(v => { if (Math.random() < xran) addOn += v; });
  [3,3,7].forEach(v => { if (Math.random() > xran) addOn -= v; });

  if (offOvr < 60) yourScore = 13 + addOn;
  else if (offOvr < 70) yourScore = 17 + addOn;
  else if (offOvr < 80) yourScore = 20 + addOn;
  else if (offOvr < 90) yourScore = 23 + addOn;
  else yourScore = 24 + addOn;

  let subFrom = 0;
  [3,7,3,6,3,7].forEach(v => { if (Math.random() > yran) subFrom += v; });
  [3,7,7].forEach(v => { if (Math.random() < yran) subFrom -= v; });

  if (defOvr < 80) oppScore = 14 + subFrom;
  else oppScore = 17 + subFrom;

  let result;
  if (yourScore > oppScore) result = "WIN";
  else if (yourScore === oppScore) {
    if (Math.random() < 0.5) {
      yourScore += Math.random() < 0.35 ? 3 : 6;
      result = "OT WIN";
    } else {
      oppScore += Math.random() < 0.35 ? 3 : 6;
      result = "OT LOSS";
    }
  } else result = "LOSS";

  return { yourScore, oppScore, oppName: oppName.trim(), result, isWin: result.includes("WIN"), remainingTeams: teamsCopy };
}

const SCOUT_TAGS = {
  boom: { label: "Boom Potential", color: "#4ade80" },
  bust: { label: "Bust Risk", color: "#ef4444" },
  safe: { label: "Pro Ready", color: "#60a5fa" },
  wild: { label: "Wildcard", color: "#a78bfa" },
};

function scoutReport(ovr) {
  const roll = Math.random();
  let archetype, spread;
  if (roll < 0.2) { archetype = "boom"; spread = 8 + randInt(8); }
  else if (roll < 0.4) { archetype = "bust"; spread = 8 + randInt(8); }
  else if (roll < 0.7) { archetype = "safe"; spread = 2 + randInt(3); }
  else { archetype = "wild"; spread = 12 + randInt(10); }

  const bias = -3 + randInt(7);
  const center = ovr + bias;
  const low = Math.max(35, center - spread);
  const high = Math.min(99, center + spread);
  return { ...SCOUT_TAGS[archetype], low, high };
}

function draftPickCount(draftPO) {
  return draftPO >= 2 ? 1 : draftPO === 1 ? 2 : 3;
}

function generateDraftClass(wins, draftPO, excludePositions = []) {
  const draftStock = 100.0 / (wins / 0.6 + 8);
  let base;
  if (wins < 3) base = 67;
  else if (wins < 7) base = 64;
  else if (wins < 10 && draftPO < 1) base = 61;
  else if (wins < 13 && draftPO < 2) base = 59;
  else base = 58;

  const players = {};
  POSITIONS.filter(pos => !excludePositions.includes(pos)).forEach(pos => {
    let p = createPlayer();
    p.age = 21 + randInt(3);
    p.ovr = base + randInt(Math.max(1, Math.floor(draftStock)));
    if (p.ovr > 99) p.ovr = 99;
    p.devTrait = checkTrait(p.age);
    p = newContract(p, POS_MULTIPLIERS[pos]);
    p.scouting = scoutReport(p.ovr);
    players[pos] = p;
  });
  return players;
}

function generateTradeOffers(currentPlayer, mult, candidateTeams) {
  const offers = [];
  const usedTeams = new Set();
  let attempts = 0;
  while (offers.length < 3 && attempts < 50) {
    attempts++;
    let p = createPlayer();
    const delta = -15 + randInt(31);
    p.ovr = Math.max(40, Math.min(99, currentPlayer.ovr + delta));
    p.devTrait = checkTrait(p.age);
    p = newContract(p, mult);
    const fromTeam = pick(candidateTeams).trim();
    if (usedTeams.has(fromTeam) && usedTeams.size < candidateTeams.length) continue;
    usedTeams.add(fromTeam);
    offers.push({ player: p, fromTeam });
  }
  return offers;
}

function generateFAClass() {
  let goodLeft = 2, midLeft = 2, badLeft = 2;
  const players = {};
  const posArr = [...POSITIONS].sort(() => Math.random() - 0.5);

  posArr.forEach(pos => {
    let p = createPlayer();
    let assigned = false;
    while (!assigned) {
      const r = Math.random();
      if (r < 0.33 && goodLeft > 0) { p.ovr += 10 + randInt(20); goodLeft--; assigned = true; }
      else if (r < 0.67 && midLeft > 0) { p.ovr += 5 + randInt(12); midLeft--; assigned = true; }
      else if (badLeft > 0) { p.ovr += randInt(7); badLeft--; assigned = true; }
    }
    if (p.ovr > 99) p.ovr = 99;
    if (p.age < 25) { p.age = 25; p.devTrait = checkTrait(p.age); }
    p = newContract(p, POS_MULTIPLIERS[pos]);
    players[pos] = p;
  });
  return players;
}

function initTeam(chosenName) {
  const allNames = [...ALL_TEAM_NAMES];
  let name;
  if (chosenName && allNames.includes(chosenName)) {
    name = chosenName;
    allNames.splice(allNames.indexOf(chosenName), 1);
  } else {
    const idx = randInt(allNames.length);
    name = allNames.splice(idx, 1)[0];
  }
  const opponents = allNames;

  const roster = {};
  POSITIONS.forEach(pos => {
    let p = createPlayer();
    p = newContract(p, POS_MULTIPLIERS[pos]);
    roster[pos] = p;
  });

  return { name, roster, opponents, yr: 2024, history: [], sessionWins: 0, sessionLosses: 0, POappear: 0, SBappear: 0, SBwins: 0, badSeasonStreak: 0, fired: false, tradesUsedThisSeason: 0, awardsWon: [], injuries: {} };
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function PlayerCard({ pos, player, highlight, onClick, compact, actionLabel, scouting, injury }) {
  const traitLabel = ["Rising", "Prime", "Steady", "Declining", "Veteran"][player.devTrait];
  const traitColor = ["#4ade80", "#60a5fa", "#a78bfa", "#fb923c", "#ef4444"][player.devTrait];
  const dev = devStr(player);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && onClick ? "rgba(245,158,11,0.08)" : highlight ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.02)",
        border: highlight ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8, padding: compact ? "8px 12px" : "12px 16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{
        fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: compact ? 10 : 12,
        color: "#f59e0b", minWidth: 40, letterSpacing: 1
      }}>{pos}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: compact ? 14 : 16, color: "#e2e8f0",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {player.name}
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#94a3b8",
          display: "flex", gap: 10, marginTop: 2, flexWrap: "wrap"
        }}>
          <span>{player.age}y/o</span>
          <span style={{ color: traitColor, fontWeight: 700 }}>{traitLabel}</span>
          <span>${player.salary}M</span>
          {injury && <span style={{ color: "#ef4444", fontWeight: 700 }}>🩹 Out {injury.weeksLeft}wk</span>}
        </div>
      </div>
      <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
        {scouting ? (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: compact ? 15 : 18,
              color: "#fbbf24"
            }}>{scouting.low}&ndash;{scouting.high}</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
              color: scouting.color
            }}>{scouting.label}</div>
          </div>
        ) : (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: compact ? 18 : 22,
              color: player.ovr >= 80 ? "#4ade80" : player.ovr >= 65 ? "#fbbf24" : "#ef4444"
            }}>{player.ovr}</div>
            {dev && <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11,
              color: dev.startsWith("+") ? "#4ade80" : "#ef4444"
            }}>{dev}</div>}
          </div>
        )}
        {actionLabel && (
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 11,
            color: "#f59e0b", opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s",
            letterSpacing: 1
          }}>{actionLabel}</div>
        )}
      </div>
    </div>
  );
}

function RosterPanel({ roster, title, injuries = {} }) {
  const offOvr = Math.floor(calcOffOvr(roster));
  const defOvr = Math.floor(calcDefOvr(roster));
  const ovr = calcOvr(roster);
  const spent = calcSalarySpent(roster);
  return (
    <div style={{ marginBottom: 16 }}>
      {title && (
        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
          marginBottom: 10, letterSpacing: 3, textTransform: "uppercase"
        }}>{title}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {POSITIONS.map(pos => <PlayerCard key={pos} pos={pos} player={roster[pos]} injury={injuries[pos]} />)}
      </div>
      <div style={{
        display: "flex", gap: 16, marginTop: 14, fontFamily: "'Space Mono', monospace",
        fontSize: 12, color: "#64748b", flexWrap: "wrap",
        padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 6
      }}>
        <span>OVR <b style={{ color: "#e2e8f0", fontSize: 14 }}>{ovr}</b></span>
        <span>OFF <b style={{ color: "#60a5fa", fontSize: 14 }}>{offOvr}</b></span>
        <span>DEF <b style={{ color: "#f472b6", fontSize: 14 }}>{defOvr}</b></span>
        <span>CAP <b style={{ color: spent > 110 ? "#ef4444" : "#94a3b8", fontSize: 14 }}>${spent}M / $110M</b></span>
      </div>
    </div>
  );
}

function GameResult({ week, game, record }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "7px 0",
      borderBottom: "1px solid rgba(255,255,255,0.03)", fontFamily: "'Space Mono', monospace", fontSize: 12
    }}>
      <span style={{ color: "#475569", minWidth: 52, fontSize: 11 }}>WK {String(week).padStart(2, " ")}</span>
      <span style={{ color: "#e2e8f0", minWidth: 50 }}>{game.yourScore} - {game.oppScore}</span>
      <span style={{ color: "#64748b", flex: 1, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        vs {game.oppName}
      </span>
      <span style={{
        fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 10, letterSpacing: 1,
        color: game.isWin ? "#4ade80" : "#ef4444",
        minWidth: 62, textAlign: "right"
      }}>{game.result}</span>
      <span style={{ color: "#475569", fontSize: 11, minWidth: 36, textAlign: "right" }}>{record}</span>
    </div>
  );
}

const CONFETTI_COLORS = ["#f59e0b", "#ef4444", "#4ade80", "#60a5fa", "#a78bfa", "#fbbf24"];

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.5 + Math.random() * 1.5,
    color: CONFETTI_COLORS[randInt(CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
    size: 6 + Math.random() * 6,
  })), []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: -20, left: `${p.left}%`,
          width: p.size, height: p.size * 0.4, background: p.color,
          animation: `isfl-confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          transform: `rotate(${p.rotate}deg)`,
          borderRadius: 2,
        }} />
      ))}
    </div>
  );
}

function PlayoffBracket({ results, currentRound }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {PO_ROUNDS.map((name, idx) => {
        const res = results.find(r => r.round === idx);
        const isCurrent = idx === currentRound && !res;
        return (
          <div key={name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            padding: "10px 14px", borderRadius: 8, flexWrap: "wrap",
            background: isCurrent ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)",
            border: isCurrent ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13,
              color: isCurrent ? "#f59e0b" : res ? "#e2e8f0" : "#475569"
            }}>{name}</span>
            {res?.bye ? (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#60a5fa" }}>BYE</span>
            ) : res ? (
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11,
                color: res.isWin ? "#4ade80" : "#ef4444"
              }}>{res.yourScore}-{res.oppScore} vs {res.oppName} &middot; {res.isWin ? "WON" : "LOST"}</span>
            ) : (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#334155" }}>
                {isCurrent ? "IN PROGRESS" : "—"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StandingsTable({ standings, yourTeamName }) {
  return (
    <div>
      {DIVISIONS.map(div => {
        const rows = standings
          .filter(s => s.division === div.name)
          .sort((a, b) => b.wins - a.wins);
        return (
          <div key={div.name} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
              marginBottom: 8, letterSpacing: 2, textTransform: "uppercase"
            }}>{div.name}</div>
            <div style={{
              background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)",
              overflow: "hidden"
            }}>
              {rows.map((s, i) => (
                <div key={s.name} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                  background: s.name === yourTeamName ? "rgba(245,158,11,0.08)" : "transparent",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  fontFamily: "'Space Mono', monospace", fontSize: 12
                }}>
                  <span style={{ color: "#475569", minWidth: 16 }}>{i + 1}</span>
                  <span style={{
                    flex: 1, color: s.name === yourTeamName ? "#f59e0b" : "#e2e8f0",
                    fontWeight: s.name === yourTeamName ? 700 : 400
                  }}>{s.name}</span>
                  <span style={{ color: "#94a3b8" }}>{s.wins}-{s.losses}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, small }) {
  const styles = {
    primary: { bg: "linear-gradient(135deg, #f59e0b, #d97706)", text: "#0f172a", hoverBg: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
    secondary: { bg: "rgba(255,255,255,0.06)", text: "#94a3b8", hoverBg: "rgba(255,255,255,0.12)" },
    danger: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", hoverBg: "rgba(239,68,68,0.25)" },
    success: { bg: "rgba(74,222,128,0.15)", text: "#4ade80", hoverBg: "rgba(74,222,128,0.25)" },
  };
  const s = styles[variant];
  const [hovered, setHovered] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: small ? 12 : 14, letterSpacing: 1,
        padding: small ? "6px 14px" : "10px 22px", borderRadius: 6,
        border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.08)",
        background: disabled ? "#1e293b" : hovered ? s.hoverBg : s.bg,
        color: disabled ? "#475569" : s.text,
        cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", textTransform: "uppercase",
        whiteSpace: "nowrap"
      }}
    >{children}</button>
  );
}

function LogPanel({ messages, logRef }) {
  return (
    <div ref={logRef} style={{
      background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 14,
      maxHeight: 180, overflowY: "auto", fontFamily: "'Space Mono', monospace", fontSize: 12,
      color: "#94a3b8", lineHeight: 1.8, border: "1px solid rgba(255,255,255,0.04)"
    }}>
      {messages.map((m, i) => (
        <div key={i} style={{
          color: m.type === "success" ? "#4ade80" : m.type === "error" ? "#ef4444" : m.type === "highlight" ? "#fbbf24" : "#94a3b8"
        }}>{m.text}</div>
      ))}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
const PHASES = {
  WELCOME: "WELCOME", TEAM_SELECT: "TEAM_SELECT", ROSTER_VIEW: "ROSTER_VIEW", REGULAR_SEASON: "REGULAR_SEASON",
  POSTSEASON_CHECK: "POSTSEASON_CHECK", POSTSEASON_ROUND: "POSTSEASON_ROUND",
  SEASON_END: "SEASON_END", RESIGN: "RESIGN", DRAFT: "DRAFT",
  FREE_AGENCY: "FREE_AGENCY", SESSION_END: "SESSION_END", HALL_OF_FAME: "HALL_OF_FAME",
};

const PO_ROUNDS = ["Wildcard", "Divisional", "Conference Championship", "Super Bowl"];
const PO_PENALTIES = [2, 4, 6, 8];
const MAX_TRADES_PER_SEASON = 3;

const SAVE_KEY = "isfl-save-v1";
function saveGame(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
}

const HOF_KEY = "isfl-hof-v1";
function loadHOF() {
  try {
    const raw = localStorage.getItem(HOF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function addToHOF(entry) {
  try {
    const entries = loadHOF();
    entries.push(entry);
    while (entries.length > 50) entries.shift();
    localStorage.setItem(HOF_KEY, JSON.stringify(entries));
  } catch {}
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.WELCOME);
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [wins, setWins] = useState(0);
  const [weekNum, setWeekNum] = useState(1);
  const [opponentPool, setOpponentPool] = useState([]);
  const [logs, setLogs] = useState([]);
  const [poRound, setPoRound] = useState(0);
  const [draftPO, setDraftPO] = useState(0);
  const [draftClass, setDraftClass] = useState(null);
  const [faClass, setFaClass] = useState(null);
  const [resignList, setResignList] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [hasSave, setHasSave] = useState(() => !!loadGame());
  const [tradeMode, setTradeMode] = useState(false);
  const [tradePos, setTradePos] = useState(null);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [draftPicksTotal, setDraftPicksTotal] = useState(0);
  const [draftPicksRemaining, setDraftPicksRemaining] = useState(0);
  const [draftedPositions, setDraftedPositions] = useState([]);
  const [leagueStandings, setLeagueStandings] = useState([]);
  const [showStandings, setShowStandings] = useState(false);
  const [playoffResults, setPlayoffResults] = useState([]);
  const [hofEntries, setHofEntries] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (!team) return;
    saveGame({
      phase, team, games, wins, weekNum, opponentPool, poRound, draftPO, draftClass, faClass, resignList,
      draftPicksTotal, draftPicksRemaining, draftedPositions, leagueStandings, playoffResults
    });
    setHasSave(true);
  }, [phase, team, games, wins, weekNum, opponentPool, poRound, draftPO, draftClass, faClass, resignList, draftPicksTotal, draftPicksRemaining, draftedPositions, leagueStandings, playoffResults]);

  const addLog = useCallback((text, type = "normal") => {
    setLogs(prev => [...prev, { text, type }]);
  }, []);

  const goToHallOfFame = () => {
    setHofEntries(loadHOF());
    setPhase(PHASES.HALL_OF_FAME);
  };

  const goToTeamSelect = () => {
    if (hasSave && !window.confirm("Starting a new franchise will erase your saved game. Continue?")) return;
    clearSave();
    setPhase(PHASES.TEAM_SELECT);
  };

  const selectTeam = (name) => {
    const t = initTeam(name);
    setTeam(t);
    setPhase(PHASES.ROSTER_VIEW);
    setOpponentPool([...t.opponents]);
  };

  const continueGame = () => {
    const s = loadGame();
    if (!s || !s.team) return;
    setTeam(s.team);
    setGames(s.games || []);
    setWins(s.wins || 0);
    setWeekNum(s.weekNum || 1);
    setOpponentPool(s.opponentPool || []);
    setPoRound(s.poRound || 0);
    setDraftPO(s.draftPO || 0);
    setDraftClass(s.draftClass || null);
    setFaClass(s.faClass || null);
    setResignList(s.resignList || []);
    setDraftPicksTotal(s.draftPicksTotal || 0);
    setDraftPicksRemaining(s.draftPicksRemaining || 0);
    setDraftedPositions(s.draftedPositions || []);
    setLeagueStandings(s.leagueStandings || []);
    setPlayoffResults(s.playoffResults || []);
    setLogs([]);
    setPhase(s.phase || PHASES.ROSTER_VIEW);
  };

  const simWeeks = (count) => {
    if (!team) return;
    const target = Math.min(weekNum + count - 1, 17);
    let w = wins;
    const newGames = [...games];
    let pool = [...opponentPool];
    const injuries = { ...team.injuries };
    const injuryLogs = [];

    for (let wk = weekNum; wk <= target; wk++) {
      POSITIONS.forEach(pos => {
        const inj = injuries[pos];
        if (!inj) return;
        inj.weeksLeft -= 1;
        if (inj.weeksLeft <= 0) {
          injuryLogs.push({ text: `✅ ${team.roster[pos].name} (${pos}) is back to full health.`, type: "success" });
          delete injuries[pos];
        }
      });

      if (Math.random() < INJURY_CHANCE_PER_WEEK) {
        const healthy = POSITIONS.filter(pos => !injuries[pos]);
        if (healthy.length > 0) {
          const pos = pick(healthy);
          const weeksLeft = 1 + randInt(3);
          const penalty = 6 + randInt(10);
          injuries[pos] = { weeksLeft, penalty };
          injuryLogs.push({ text: `🩹 ${team.roster[pos].name} (${pos}) is banged up — out ${weeksLeft} week${weeksLeft > 1 ? "s" : ""}.`, type: "error" });
        }
      }

      const effRoster = applyInjuries(team.roster, injuries);
      const offOvr = calcOffOvr(effRoster);
      const defOvr = calcDefOvr(effRoster);
      if (pool.length === 0) pool = [...team.opponents];
      const g = playGame(offOvr, defOvr, pool);
      pool = g.remainingTeams;
      if (g.isWin) w++;
      newGames.push({ week: wk, game: g, record: `${w}-${wk - w}` });
    }

    setGames(newGames);
    setWins(w);
    setWeekNum(target + 1);
    setOpponentPool(pool);
    if (injuryLogs.length > 0) setLogs(prev => [...prev, ...injuryLogs]);
    setTeam(prev => ({ ...prev, injuries }));

    if (target >= 17) {
      setTeam(prev => ({
        ...prev,
        sessionWins: prev.sessionWins + w,
        sessionLosses: prev.sessionLosses + (17 - w),
      }));
      setLeagueStandings(generateLeagueStandings(team.name, w));
      setTimeout(() => setPhase(PHASES.POSTSEASON_CHECK), 300);
    }
  };

  const startPostseason = () => {
    const e = wins;
    let made = false, bye = false;
    const newLogs = [];

    if (e < 9) { newLogs.push({ text: "You didn't make the playoffs this year.", type: "error" }); }
    else if (e === 9) {
      if (Math.random() < 0.666) { made = true; newLogs.push({ text: "You made the playoffs!", type: "success" }); }
      else newLogs.push({ text: "You didn't make the playoffs.", type: "error" });
    }
    else if (e < 13) { made = true; newLogs.push({ text: "You made the playoffs!", type: "success" }); }
    else if (e === 13) {
      made = true;
      if (Math.random() < 0.6) { bye = true; newLogs.push({ text: "You made the playoffs with a first-round bye!", type: "success" }); }
      else newLogs.push({ text: "You made the playoffs!", type: "success" });
    }
    else { made = true; bye = true; newLogs.push({ text: "You made the playoffs with a first-round bye!", type: "success" }); }

    setLogs(newLogs);

    if (!made) {
      const seasonAwards = rollAwards(team.roster);
      if (seasonAwards.length > 0) {
        setLogs(prev => [...prev, ...seasonAwards.map(a => ({ text: `🏆 ${a.award}: ${a.playerName} (${a.pos})`, type: "success" }))]);
      }
      setTeam(prev => {
        const newStreak = prev.badSeasonStreak + 1;
        const fired = newStreak >= 3;
        return {
          ...prev,
          badSeasonStreak: newStreak,
          fired,
          awardsWon: [...prev.awardsWon, ...seasonAwards.map(a => ({ ...a, yr: prev.yr }))],
          history: [...prev.history, { yr: prev.yr, record: `${e}-${17 - e}`, result: "Missed Playoffs", awards: seasonAwards }]
        };
      });
      setPhase(PHASES.SEASON_END);
      return;
    }

    setTeam(prev => ({ ...prev, POappear: prev.POappear + 1, badSeasonStreak: 0 }));
    setDraftPO(0);
    setPoRound(bye ? 1 : 0);
    setPlayoffResults(bye ? [{ round: 0, bye: true }] : []);
    setPhase(PHASES.POSTSEASON_ROUND);
  };

  const simPlayoffRound = () => {
    const offOvr = calcOffOvr(team.roster) - PO_PENALTIES[poRound];
    const defOvr = calcDefOvr(team.roster) - PO_PENALTIES[poRound];
    let pool = [...opponentPool];
    if (pool.length === 0) pool = [...team.opponents];
    const g = playGame(offOvr, defOvr, pool);
    setOpponentPool(g.remainingTeams);

    const roundName = PO_ROUNDS[poRound];
    setLogs(prev => [...prev, {
      text: `${roundName}: ${g.yourScore} - ${g.oppScore} vs ${g.oppName}  →  ${g.result}`,
      type: g.isWin ? "success" : "error"
    }]);
    setPlayoffResults(prev => [...prev, { round: poRound, yourScore: g.yourScore, oppScore: g.oppScore, oppName: g.oppName, isWin: g.isWin }]);

    if (g.isWin) {
      if (poRound < 3) {
        const newDraftPO = poRound >= 1 ? 2 : 1;
        setDraftPO(newDraftPO);
        if (poRound === 2) {
          setTeam(prev => ({ ...prev, SBappear: prev.SBappear + 1 }));
        }
        setPoRound(poRound + 1);
      } else {
        setLogs(prev => [...prev, { text: "YOU WON THE SUPER BOWL!", type: "success" }]);
        const seasonAwards = rollAwards(team.roster);
        if (seasonAwards.length > 0) {
          setLogs(prev => [...prev, ...seasonAwards.map(a => ({ text: `🏆 ${a.award}: ${a.playerName} (${a.pos})`, type: "success" }))]);
        }
        setTeam(prev => ({
          ...prev,
          SBappear: prev.SBappear + 1,
          SBwins: prev.SBwins + 1,
          awardsWon: [...prev.awardsWon, ...seasonAwards.map(a => ({ ...a, yr: prev.yr }))],
          history: [...prev.history, { yr: prev.yr, record: `${wins}-${17 - wins}`, result: "Won the Super Bowl!", awards: seasonAwards }]
        }));
        setPhase(PHASES.SEASON_END);
      }
    } else {
      const lostIn = `Lost in ${roundName}`;
      const seasonAwards = rollAwards(team.roster);
      if (seasonAwards.length > 0) {
        setLogs(prev => [...prev, ...seasonAwards.map(a => ({ text: `🏆 ${a.award}: ${a.playerName} (${a.pos})`, type: "success" }))]);
      }
      setTeam(prev => ({
        ...prev,
        awardsWon: [...prev.awardsWon, ...seasonAwards.map(a => ({ ...a, yr: prev.yr }))],
        history: [...prev.history, { yr: prev.yr, record: `${wins}-${17 - wins}`, result: lostIn, awards: seasonAwards }]
      }));
      setPhase(PHASES.SEASON_END);
    }
  };

  const startNewSeason = () => {
    const newRoster = {};
    POSITIONS.forEach(pos => { newRoster[pos] = developPlayer(team.roster[pos]); });

    const needsResignArr = POSITIONS.filter(pos => needsResign(newRoster[pos].age));
    needsResignArr.forEach(pos => {
      newRoster[pos] = newContract(newRoster[pos], POS_MULTIPLIERS[pos]);
    });

    setTeam(prev => ({ ...prev, roster: { ...newRoster }, yr: prev.yr + 1 }));
    setResignList(needsResignArr);
    setLogs([]);
    setPhase(PHASES.RESIGN);
  };

  const handleResign = (pos) => {
    addLog(`Re-signed ${pos}: ${team.roster[pos].name} for $${team.roster[pos].salary}M`, "success");
    setResignList(prev => prev.filter(p => p !== pos));
  };

  const skipResign = (pos) => {
    const oldName = team.roster[pos].name;
    let backup = createPlayer();
    backup = newContract(backup, POS_MULTIPLIERS[pos]);
    setTeam(prev => ({ ...prev, roster: { ...prev.roster, [pos]: backup } }));
    addLog(`Let ${oldName} walk. Replacement: ${backup.name} (${backup.ovr} ovr)`, "highlight");
    setResignList(prev => prev.filter(p => p !== pos));
  };

  const finishResign = () => {
    const updates = {};
    resignList.forEach(pos => {
      let backup = createPlayer();
      backup = newContract(backup, POS_MULTIPLIERS[pos]);
      updates[pos] = backup;
    });
    if (Object.keys(updates).length > 0) {
      setTeam(prev => ({ ...prev, roster: { ...prev.roster, ...updates } }));
    }
    setResignList([]);
    const picks = draftPickCount(draftPO);
    setDraftPicksTotal(picks);
    setDraftPicksRemaining(picks);
    setDraftedPositions([]);
    setDraftClass(generateDraftClass(wins, draftPO, []));
    setLogs([]);
    setPhase(PHASES.DRAFT);
  };

  const draftPlayer = (pos) => {
    const player = draftClass[pos];
    addLog(`Drafted ${pos}: ${player.name} (${player.ovr} ovr, $${player.salary}M)`, "success");
    setTeam(prev => ({ ...prev, roster: { ...prev.roster, [pos]: player } }));

    const newDrafted = [...draftedPositions, pos];
    const remaining = draftPicksRemaining - 1;
    setDraftedPositions(newDrafted);
    setDraftPicksRemaining(remaining);

    if (remaining > 0 && newDrafted.length < POSITIONS.length) {
      setDraftClass(generateDraftClass(wins, draftPO, newDrafted));
    } else {
      setFaClass(generateFAClass());
      setTimeout(() => { setLogs([]); setPhase(PHASES.FREE_AGENCY); }, 600);
    }
  };

  const skipDraft = () => {
    setDraftPicksRemaining(0);
    setFaClass(generateFAClass());
    setLogs([]);
    setPhase(PHASES.FREE_AGENCY);
  };

  const signFA = (pos) => {
    const fa = faClass[pos];
    const current = team.roster[pos];
    const newSpent = calcSalarySpent(team.roster) - current.salary + fa.salary;
    if (newSpent > 110) {
      addLog(`Can't afford ${fa.name} — would put you at $${newSpent}M/$110M`, "error");
      return;
    }
    addLog(`Signed ${pos}: ${fa.name} (${fa.ovr} ovr, $${fa.salary}M)`, "success");
    setTeam(prev => ({ ...prev, roster: { ...prev.roster, [pos]: fa } }));
  };

  const finishFA = () => {
    setGames([]);
    setWins(0);
    setWeekNum(1);
    setOpponentPool([...team.opponents]);
    setLogs([]);
    setTeam(prev => ({ ...prev, tradesUsedThisSeason: 0, injuries: {} }));
    setPhase(PHASES.REGULAR_SEASON);
  };

  const openTrade = () => { setTradeMode(true); setTradePos(null); setTradeOffers([]); };
  const closeTrade = () => { setTradeMode(false); setTradePos(null); setTradeOffers([]); };

  const shopPosition = (pos) => {
    setTradePos(pos);
    setTradeOffers(generateTradeOffers(team.roster[pos], POS_MULTIPLIERS[pos], team.opponents));
  };

  const acceptTrade = (offer) => {
    const current = team.roster[tradePos];
    const newSpent = calcSalarySpent(team.roster) - current.salary + offer.player.salary;
    if (newSpent > 110) {
      addLog(`Trade rejected — taking on ${offer.player.name} would put you at $${newSpent}M/$110M`, "error");
      return;
    }
    addLog(`Traded ${current.name} (${current.ovr} ovr) to the ${offer.fromTeam} for ${offer.player.name} (${offer.player.ovr} ovr, $${offer.player.salary}M)`, "success");
    setTeam(prev => ({
      ...prev,
      roster: { ...prev.roster, [tradePos]: offer.player },
      tradesUsedThisSeason: prev.tradesUsedThisSeason + 1
    }));
    closeTrade();
  };

  const endSession = () => {
    if (team) {
      addToHOF({
        teamName: team.name,
        startYr: team.history[0]?.yr ?? team.yr,
        endYr: team.yr,
        sessionWins: team.sessionWins,
        sessionLosses: team.sessionLosses,
        POappear: team.POappear,
        SBappear: team.SBappear,
        SBwins: team.SBwins,
        fired: team.fired,
        awards: (team.awardsWon || []).map(a => ({ ...a, teamName: team.name })),
        endedAt: Date.now(),
      });
    }
    setPhase(PHASES.SESSION_END);
  };

  const resetAll = () => {
    clearSave();
    setHasSave(false);
    setPhase(PHASES.WELCOME); setTeam(null); setGames([]); setWins(0);
    setWeekNum(1); setLogs([]); setDraftClass(null); setFaClass(null);
    setResignList([]); setShowHelp(false);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#06090f",
      backgroundImage: "radial-gradient(ellipse at 15% 80%, rgba(245,158,11,0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(59,130,246,0.04) 0%, transparent 50%)",
      color: "#e2e8f0", padding: "24px 16px", boxSizing: "border-box",
      fontFamily: "'Rajdhani', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        body { background: #06090f; }
        @keyframes isfl-confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .isfl-team-pick:hover { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.3); }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 28, position: "relative" }}>
          <div style={{
            position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 200, background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <h1 style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 32, margin: 0,
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: 6, position: "relative"
          }}>ISFL</h1>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#475569",
            letterSpacing: 5, marginTop: 6
          }}>ICONIC SHOWS FOOTBALL LEAGUE</div>
          {team && phase !== PHASES.WELCOME && phase !== PHASES.SESSION_END && (
            <div style={{
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 17,
              color: "#f59e0b", marginTop: 10, letterSpacing: 1
            }}>{team.yr} {team.name}</div>
          )}
          {team && team.badSeasonStreak > 0 && !team.fired && phase !== PHASES.WELCOME && phase !== PHASES.SESSION_END && phase !== PHASES.SEASON_END && (
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#fb923c",
              marginTop: 6, letterSpacing: 0.5
            }}>⚠ On the hot seat — {team.badSeasonStreak} straight missed playoffs</div>
          )}
        </div>

        {/* ── WELCOME ── */}
        {phase === PHASES.WELCOME && (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <div style={{
              fontSize: 18, color: "#94a3b8", lineHeight: 1.9,
              maxWidth: 480, margin: "0 auto 36px"
            }}>
              Become the General Manager of a television-themed football team.
              Manage your roster, simulate seasons, and chase Super Bowl glory.
            </div>
            {showHelp && (
              <div style={{
                background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 24, marginBottom: 28,
                fontSize: 15, color: "#94a3b8", lineHeight: 2, textAlign: "left",
                border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <p style={{ marginBottom: 12 }}>Pick your franchise from three divisions, then manage 3 offensive positions (QB, RB, WR) and 3 defensive (EDGE, LB, CB). Each player has an OVR rating that drives game simulation.</p>
                <p style={{ marginBottom: 12 }}>Position importance: QB &gt; EDGE &gt; CB &gt; WR/LB &gt; RB. Younger players develop and improve; players in their mid-30s tend to decline.</p>
                <p style={{ marginBottom: 12 }}>Salary cap is $110M. Every offseason you re-sign expiring contracts, make 1&ndash;3 draft picks (bad seasons earn more), then hit free agency. Draft prospects only show a scouted range &mdash; their true OVR is revealed once you pick.</p>
                <p style={{ marginBottom: 12 }}>During the season you can make up to 3 trades &mdash; shop a position for a replacement if an early loss exposes a weakness. Watch for injuries too: a banged-up starter plays at reduced strength until they heal.</p>
                <p style={{ marginBottom: 12 }}>Finish with 9+ wins to make the playoffs (13+ gets a first-round bye). Miss the playoffs three seasons in a row and ownership fires you.</p>
                <p style={{ marginBottom: 12 }}>Standout seasons earn awards &mdash; MVP, Offensive/Defensive Player of the Year, Rookie of the Year, Comeback Player &mdash; and every franchise you complete is recorded in the Hall of Fame.</p>
                <p>Your progress saves automatically, so you can close the tab and pick up right where you left off.</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {hasSave ? (
                <>
                  <Btn onClick={continueGame}>Continue Franchise</Btn>
                  <Btn variant="secondary" onClick={goToTeamSelect}>New Franchise</Btn>
                </>
              ) : (
                <Btn onClick={goToTeamSelect}>Play Ball</Btn>
              )}
              <Btn variant="secondary" onClick={() => setShowHelp(!showHelp)}>
                {showHelp ? "Got it" : "How to Play"}
              </Btn>
              <Btn variant="secondary" onClick={goToHallOfFame}>Hall of Fame</Btn>
            </div>
          </div>
        )}

        {/* ── TEAM SELECT ── */}
        {phase === PHASES.TEAM_SELECT && (
          <div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 24, textAlign: "center" }}>
              Choose your franchise.
            </div>
            {DIVISIONS.map(div => (
              <div key={div.name} style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
                  marginBottom: 8, letterSpacing: 3, textTransform: "uppercase"
                }}>{div.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {div.teams.map(name => (
                    <button key={name} className="isfl-team-pick" onClick={() => selectTeam(name)} style={{
                      textAlign: "left", padding: "12px 16px", borderRadius: 8,
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                      color: "#e2e8f0", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 15,
                      cursor: "pointer", transition: "all 0.15s"
                    }}>{name}</button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Btn variant="secondary" small onClick={() => setPhase(PHASES.WELCOME)}>Back</Btn>
            </div>
          </div>
        )}

        {/* ── HALL OF FAME ── */}
        {phase === PHASES.HALL_OF_FAME && (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 3,
              color: "#e2e8f0", marginBottom: 20, textAlign: "center"
            }}>HALL OF FAME</div>

            {hofEntries.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", fontSize: 14, padding: "20px 0" }}>
                No franchises completed yet. Finish a season and end your session to make history.
              </div>
            ) : (
              <>
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
                  marginBottom: 8, letterSpacing: 2, textTransform: "uppercase"
                }}>Franchise Legends</div>
                <div style={{
                  background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)",
                  overflow: "hidden", marginBottom: 24
                }}>
                  {[...hofEntries]
                    .sort((a, b) => (b.SBwins - a.SBwins) || (b.POappear - a.POappear) || (b.sessionWins - a.sessionWins))
                    .slice(0, 10)
                    .map((e, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", flexWrap: "wrap",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        fontFamily: "'Space Mono', monospace", fontSize: 12
                      }}>
                        <span style={{ color: "#475569", minWidth: 16 }}>{i + 1}</span>
                        <span style={{ flex: 1, color: "#e2e8f0", fontWeight: 600 }}>
                          {e.teamName}{e.fired && <span style={{ color: "#ef4444" }}> (fired)</span>}
                        </span>
                        <span style={{ color: "#64748b" }}>{e.startYr}&ndash;{e.endYr}</span>
                        <span style={{ color: "#94a3b8" }}>{e.sessionWins}-{e.sessionLosses}</span>
                        <span style={{ color: "#f59e0b" }}>🏆 {e.SBwins}</span>
                      </div>
                    ))}
                </div>

                <div style={{
                  fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
                  marginBottom: 8, letterSpacing: 2, textTransform: "uppercase"
                }}>All-Time Award Winners</div>
                <div style={{
                  background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)",
                  overflow: "hidden", maxHeight: 300, overflowY: "auto"
                }}>
                  {hofEntries.flatMap(e => e.awards || [])
                    .sort((a, b) => b.yr - a.yr)
                    .slice(0, 30)
                    .map((a, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", flexWrap: "wrap",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        fontFamily: "'Space Mono', monospace", fontSize: 11
                      }}>
                        <span style={{ color: "#475569", minWidth: 34 }}>{a.yr}</span>
                        <span style={{ color: "#fbbf24", flex: 1 }}>{a.award}</span>
                        <span style={{ color: "#e2e8f0" }}>{a.playerName} ({a.pos})</span>
                        <span style={{ color: "#64748b" }}>{a.teamName}</span>
                      </div>
                    ))}
                  {hofEntries.flatMap(e => e.awards || []).length === 0 && (
                    <div style={{ padding: 14, color: "#475569", fontSize: 12, textAlign: "center" }}>No awards yet.</div>
                  )}
                </div>
              </>
            )}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Btn variant="secondary" onClick={() => setPhase(PHASES.WELCOME)}>Back</Btn>
            </div>
          </div>
        )}

        {/* ── ROSTER VIEW ── */}
        {phase === PHASES.ROSTER_VIEW && team && (
          <div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 20, textAlign: "center", lineHeight: 1.8 }}>
              You are the new GM of the <b style={{ color: "#f59e0b" }}>{team.name}</b>.
            </div>
            <RosterPanel roster={team.roster} injuries={team.injuries || {}} title="Your Roster" />
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Btn onClick={() => { setOpponentPool([...team.opponents]); setPhase(PHASES.REGULAR_SEASON); }}>
                Start Season
              </Btn>
            </div>
          </div>
        )}

        {/* ── REGULAR SEASON ── */}
        {phase === PHASES.REGULAR_SEASON && team && tradeMode && (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 3,
              color: "#e2e8f0", marginBottom: 4
            }}>TRADE BLOCK</div>

            {!tradePos ? (
              <>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginBottom: 20
                }}>
                  Pick a position to shop &nbsp;|&nbsp; {MAX_TRADES_PER_SEASON - team.tradesUsedThisSeason} trade{MAX_TRADES_PER_SEASON - team.tradesUsedThisSeason !== 1 ? "s" : ""} left this season
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {POSITIONS.map(pos => (
                    <PlayerCard key={pos} pos={pos} player={team.roster[pos]}
                      onClick={() => shopPosition(pos)} actionLabel="SHOP" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginBottom: 20
                }}>
                  Offers for your {tradePos} — {team.roster[tradePos].name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tradeOffers.map((offer, i) => (
                    <div key={i}>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#64748b",
                        marginBottom: 4, letterSpacing: 1
                      }}>FROM {offer.fromTeam.toUpperCase()}</div>
                      <PlayerCard pos={tradePos} player={offer.player}
                        onClick={() => acceptTrade(offer)} actionLabel="ACCEPT" />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Btn variant="secondary" small onClick={() => setTradePos(null)}>Back to Positions</Btn>
                </div>
              </>
            )}

            {logs.length > 0 && <div style={{ marginTop: 16 }}><LogPanel messages={logs} logRef={logRef} /></div>}

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Btn variant="danger" onClick={closeTrade}>Close Trade Block</Btn>
            </div>
          </div>
        )}

        {phase === PHASES.REGULAR_SEASON && team && !tradeMode && (
          <div>
            <RosterPanel roster={team.roster} injuries={team.injuries || {}} title="Roster" />

            {weekNum <= 17 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#94a3b8", marginBottom: 12
                }}>
                  Week {weekNum} of 17 &nbsp;|&nbsp; Record: {wins}-{games.length - wins}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn onClick={() => simWeeks(1)} variant="secondary">1 Week</Btn>
                  <Btn onClick={() => simWeeks(4)} variant="secondary">4 Weeks</Btn>
                  {weekNum <= 8 && (
                    <Btn onClick={() => simWeeks(8 - weekNum + 1)} variant="secondary">To Week 8</Btn>
                  )}
                  <Btn onClick={() => simWeeks(17 - weekNum + 1)}>Sim All</Btn>
                  <Btn onClick={openTrade} variant="secondary" disabled={team.tradesUsedThisSeason >= MAX_TRADES_PER_SEASON}>
                    {team.tradesUsedThisSeason >= MAX_TRADES_PER_SEASON ? "No Trades Left" : "Trade"}
                  </Btn>
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <div style={{ marginBottom: 16 }}><LogPanel messages={logs} logRef={logRef} /></div>
            )}

            {games.length > 0 && (
              <div style={{
                background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: 14, marginTop: 12,
                maxHeight: 360, overflowY: "auto", border: "1px solid rgba(255,255,255,0.04)"
              }}>
                {games.map((g, i) => <GameResult key={i} week={g.week} game={g.game} record={g.record} />)}
              </div>
            )}
          </div>
        )}

        {/* ── POSTSEASON CHECK ── */}
        {phase === PHASES.POSTSEASON_CHECK && team && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: "#94a3b8", marginBottom: 6, letterSpacing: 3 }}>
              SEASON COMPLETE
            </div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 28, fontWeight: 900,
              color: "#f59e0b", marginBottom: 24
            }}>{wins}-{17 - wins}</div>

            {showStandings ? (
              <div style={{ textAlign: "left", marginBottom: 24 }}>
                <StandingsTable standings={leagueStandings} yourTeamName={team.name} />
                <div style={{ textAlign: "center" }}>
                  <Btn variant="secondary" small onClick={() => setShowStandings(false)}>Back</Btn>
                </div>
              </div>
            ) : (
              <>
                {games.length > 0 && (
                  <div style={{
                    background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: 14, marginBottom: 24,
                    maxHeight: 240, overflowY: "auto", border: "1px solid rgba(255,255,255,0.04)",
                    textAlign: "left"
                  }}>
                    {games.map((g, i) => <GameResult key={i} week={g.week} game={g.game} record={g.record} />)}
                  </div>
                )}
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <Btn variant="secondary" onClick={() => setShowStandings(true)}>View Standings</Btn>
                  <Btn onClick={startPostseason}>Check Playoffs</Btn>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── POSTSEASON ROUNDS ── */}
        {phase === PHASES.POSTSEASON_ROUND && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
              marginBottom: 16, letterSpacing: 3
            }}>PLAYOFF BRACKET</div>
            <PlayoffBracket results={playoffResults} currentRound={poRound} />
            {logs.length > 0 && <LogPanel messages={logs} logRef={logRef} />}
            <div style={{ marginTop: 20 }}>
              <Btn onClick={simPlayoffRound} variant={poRound === 3 ? "primary" : "secondary"}>
                Sim {PO_ROUNDS[poRound]}
              </Btn>
            </div>
          </div>
        )}

        {/* ── SEASON END ── */}
        {phase === PHASES.SEASON_END && team && (
          <div style={{ textAlign: "center" }}>
            {team.history[team.history.length - 1]?.result === "Won the Super Bowl!" && <Confetti />}
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, color: "#64748b",
              marginBottom: 8, letterSpacing: 3
            }}>{team.yr} SEASON OVER</div>

            {logs.length > 0 && <div style={{ marginBottom: 16 }}><LogPanel messages={logs} logRef={logRef} /></div>}

            <div style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24,
              color: team.history[team.history.length - 1]?.result.includes("Super Bowl!") ? "#4ade80" : "#94a3b8"
            }}>{team.history[team.history.length - 1]?.result}</div>

            {team.fired ? (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 18,
                  color: "#ef4444", letterSpacing: 2, marginBottom: 10
                }}>YOU'VE BEEN FIRED</div>
                <div style={{ fontSize: 14, color: "#94a3b8", maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
                  Three straight seasons without a playoff appearance. Ownership has decided to go
                  in a different direction as GM of the {team.name}.
                </div>
              </div>
            ) : (
              team.badSeasonStreak > 0 && (
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fb923c",
                  marginBottom: 20
                }}>
                  ⚠ {team.badSeasonStreak} straight non-playoff season{team.badSeasonStreak > 1 ? "s" : ""} — one more and you're fired.
                </div>
              )
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {team.fired ? (
                <Btn variant="danger" onClick={endSession}>View Career Summary</Btn>
              ) : (
                <>
                  <Btn onClick={startNewSeason}>Next Season</Btn>
                  <Btn variant="danger" onClick={endSession}>End Session</Btn>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── RE-SIGNING ── */}
        {phase === PHASES.RESIGN && team && (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 3,
              color: "#e2e8f0", marginBottom: 4
            }}>RE-SIGNING</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginBottom: 20
            }}>{team.yr} Offseason &nbsp;|&nbsp; Cap: ${calcSalarySpent(team.roster)}M / $110M</div>

            <RosterPanel roster={team.roster} injuries={team.injuries || {}} title="Current Roster" />

            {resignList.length > 0 ? (
              <div style={{ marginTop: 20 }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#fb923c",
                  marginBottom: 12, fontWeight: 600
                }}>Expired contracts:</div>
                {resignList.map(pos => (
                  <div key={pos} style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                    background: "rgba(251,146,60,0.04)", borderRadius: 8, padding: 8,
                    border: "1px solid rgba(251,146,60,0.12)"
                  }}>
                    <div style={{ flex: 1 }}>
                      <PlayerCard pos={pos} player={team.roster[pos]} compact />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn onClick={() => handleResign(pos)} variant="success" small>Keep</Btn>
                      <Btn onClick={() => skipResign(pos)} variant="danger" small>Cut</Btn>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 15, color: "#4ade80", marginTop: 16 }}>All contracts handled.</div>
            )}

            {logs.length > 0 && <div style={{ marginTop: 12 }}><LogPanel messages={logs} logRef={logRef} /></div>}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Btn onClick={finishResign}>
                {resignList.length > 0 ? "Skip Rest → Draft" : "Go to Draft"}
              </Btn>
            </div>
          </div>
        )}

        {/* ── DRAFT ── */}
        {phase === PHASES.DRAFT && team && draftClass && (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 3,
              color: "#e2e8f0", marginBottom: 4
            }}>{team.yr} DRAFT &nbsp;&middot;&nbsp; PICK {draftPicksTotal - draftPicksRemaining + 1} OF {draftPicksTotal}</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginBottom: 20
            }}>Scouts only give a range, not a number. True OVR is revealed once you pick. Draft picks can exceed the salary cap.</div>

            <RosterPanel roster={team.roster} injuries={team.injuries || {}} title="Your Team" />

            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
              marginBottom: 10, marginTop: 20, letterSpacing: 3
            }}>DRAFT CLASS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {POSITIONS.filter(pos => draftClass[pos]).map(pos => (
                <PlayerCard key={pos} pos={pos} player={draftClass[pos]} scouting={draftClass[pos].scouting}
                  onClick={() => draftPlayer(pos)} actionLabel="DRAFT" />
              ))}
            </div>

            {logs.length > 0 && <div style={{ marginTop: 12 }}><LogPanel messages={logs} logRef={logRef} /></div>}

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Btn variant="secondary" onClick={skipDraft}>
                {draftPicksRemaining > 1 ? `Skip Remaining Picks (${draftPicksRemaining})` : "Skip Draft"}
              </Btn>
            </div>
          </div>
        )}

        {/* ── FREE AGENCY ── */}
        {phase === PHASES.FREE_AGENCY && team && faClass && (
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 3,
              color: "#e2e8f0", marginBottom: 4
            }}>FREE AGENCY</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginBottom: 20
            }}>Sign as many as you can afford &nbsp;|&nbsp; Cap: ${calcSalarySpent(team.roster)}M / $110M</div>

            <RosterPanel roster={team.roster} injuries={team.injuries || {}} title="Your Team" />

            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b",
              marginBottom: 10, marginTop: 20, letterSpacing: 3
            }}>FREE AGENTS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {POSITIONS.map(pos => (
                <PlayerCard key={pos} pos={pos} player={faClass[pos]}
                  onClick={() => signFA(pos)} actionLabel="SIGN" />
              ))}
            </div>

            {logs.length > 0 && <div style={{ marginTop: 12 }}><LogPanel messages={logs} logRef={logRef} /></div>}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Btn onClick={finishFA}>Start {team.yr} Season</Btn>
            </div>
          </div>
        )}

        {/* ── SESSION END ── */}
        {phase === PHASES.SESSION_END && team && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, marginBottom: 28,
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: 4
            }}>{team.fired ? "CAREER OVER" : "SESSION SUMMARY"}</div>

            <div style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 20, marginBottom: 24,
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "left"
            }}>
              {team.history.map((h, i) => (
                <div key={i} style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#94a3b8",
                  padding: "10px 0",
                  borderBottom: i < team.history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none"
                }}>
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>{h.yr}</span>
                  <span style={{ color: "#64748b" }}> &mdash; </span>
                  {h.record}
                  <span style={{ color: "#64748b" }}> &mdash; </span>
                  <span style={{
                    color: h.result.includes("Super Bowl!") ? "#4ade80" :
                           h.result.includes("Lost in") ? "#fb923c" : "#64748b"
                  }}>{h.result}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10,
              maxWidth: 380, margin: "0 auto 28px"
            }}>
              {[
                ["Record", `${team.sessionWins}-${team.sessionLosses}`],
                ["Playoffs", team.POappear],
                ["SB Apps", team.SBappear],
                ["Rings", team.SBwins],
                ["Awards", team.awardsWon?.length || 0],
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "14px 12px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#475569", letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 22, color: "#e2e8f0", marginTop: 6 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#334155", marginBottom: 20
            }}>Thanks for playing! — Dev: Krish</div>
            <Btn onClick={resetAll}>Play Again</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
