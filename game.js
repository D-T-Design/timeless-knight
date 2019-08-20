var baseStores = {
    player: {
      hp: 50,
      dmg: 1,
      goldInit: 0,
      gear: {
        weapon: { level: 1, upgradeCost: 10, upgradeMod: 2 },
        armor: { level: 1, upgradeCost: 10, upgradeMod: 3 }
      }
    },
    enemy: { hp: 3, dmg: 1, goldDrop: 30, eliteMod: 4, bossMod: 3 },
    skills: {
      regen: { power: 10, level: 1, upgradeCost: 1000, powerIncrease: 1, name: "Regen" },
      midas: { power: 100, level: 1, upgradeCost: 1000, powerIncrease: 2, name: "Midas" },
      aura: { power: 100, level: 1, upgradeCost: 1000, powerIncrease: 5, name: "Aura" }
    },
    world: {
      wave: { num: 1, perWave: 10, modifier: 1.5 },
      loop: {
        num: 1,
        buffInit: {},
        buffStats: {
          goldPerMonster: 1,
          dmgModifier: 1,
          waveReduction: 0.5,
          dmgReduction: 0.5,
          costReduction: 1
        }
      }
    }
  },
  statArchive = {
    player: {
      totalDamage: 0,
      totalGold: 0,
      monstersKilled: 0,
      highestLoop: 1,
      timesClicked: 1
    }
  };
/* ------------ DECLARE DOM ELEMENTS FOR INNERHTML ------------ */
// PLAYER INFO DISPLAY
var playerHPBar = document.getElementById("playerHPBar");
var playerHPText = document.getElementById("playerCurrentHP");
var playerMaxHPText = document.getElementById("playerMaxHP");
var playerMessage = document.getElementById("playerMessage");
// ENEMY INFO DISPLAY
var enemyHitBox = document.getElementById("enemyHitbox");
var enemyHPBar = document.getElementById("enemyCurrentHP");
var enemyHPText = document.getElementById("enemyHPText");
var enemyMaxHPText = document.getElementById("enemyMaxHPText");
var enemyGoldText = document.getElementById("enemyGold");
var enemyDamageText = document.getElementById("enemyDamage");
var enemyClassText = document.getElementById("enemyClass");
// CAMPFIRE DISPLAY
var campfire_e = document.getElementById("campfire");
var enemy_e = document.getElementById("enemy");
var advanceBtn = document.getElementById("advance");
var retreatBtn = document.getElementById("retreat");
var nextBtn = document.getElementById("next");
// COUNTER & GOLD DISPLAY ELEMENTS
var counterDisplay = document.getElementById("enemyCounter");
var waveCounterDisplay = document.getElementById("waveCounter");
var goldDisplay = document.getElementById("goldDisplay");
// WEAPON DISPLAY ELEMENTS
var weaponLvlEl = document.getElementById("weaponLvl");
var weaponDMGEl = document.getElementById("weaponDMG");
var weaponCostEl = document.getElementById("weaponCost");
// ARMOR DISPLAY ELEMENTS
var armorLvlEl = document.getElementById("armorLvl");
var armorHPEl = document.getElementById("armorHP");
var armorCostEl = document.getElementById("armorCost");
// UPGRADE BUTTONS
var weaponUpgrade = document.getElementById("weaponUpgrade");
var armorUpgrade = document.getElementById("armorUpgrade");

/* ------------ CREATE MUTABLE VARIABLES BASED ON STORE ------------ */
var player = { ...baseStores.player };
var enemyBase = { ...baseStores.enemy };
var party = { ...baseStores.party };
var world = { ...baseStores.world };
var skills = { ...baseStores.skills };
var isResting = true;

/* ------------ INITIALIZE GEAR OBJECTS FROM STORE VARIABLES ------------ */
var weapon = player.gear.weapon;
var armor = player.gear.armor;

/* ------------ COUNTER VARIABLES ------------ */
var currentGold = player.goldInit;
var enemyMaxHP = enemyBase.hp;
var enemyCurrentHP = enemyBase.hp;
var enemyDMG = enemyBase.dmg;
var enemyGold = enemyBase.goldDrop;
var playerHP = player.hp;
var playerMaxHP = player.hp;
var waveNumber = world.wave.num;
var enemyClass;
var enemyCounter = 1;

/* ------------ GAME FUNCTIONS
---------------   Game Loop
---------------     Player starts at campfire (Lvl 1)
---------------     Waves of enemies (9 + 1 Elite)
---------------       Player Death = Lose Gold, Reset Wave
---------------       Return to campfire (Lvl Up Available)
---------------     Reach new campfire (Lvl 2, Lvl Up Available)
---------------       Upgrade Gear
---------------       Purchase Skills
---------------         Upgrade Skills
---------------       Save Game ?
---------------       Continue / Previous Level
---------------      Waves of enemies (9 + 1 Elite + Wave 2 Boost)
---------------      ...
---------------      Repeat (lvl 50)
---------------       All elite enemies, + boss enemy
*/

function toggleResting() {
  var toggle_elements = ["campfire_e", "enemy_e", "retreatBtn", "enemyHitBox"];
  for (var i = 0; i < toggle_elements.length; i++) {
    var e = toggle_elements[i];
    toggleShow(window[e]);
  }
  isResting = !isResting;
}

function healPlayer() {
  updatePlayerHealth(playerMaxHP);
}

function retreat() {
  enemyCounter = 1;
  stopEnemyAttack();
  toggleShow(advanceBtn);
  healPlayer();
  toggleResting();
}

function advance() {
  toggleResting();
  toggleShow(advanceBtn);
  spawnEnemy();
  startEnemyAttack();
}

function restAtCampfire() {
  stopEnemyAttack();
  healPlayer();
  toggleShow(nextBtn);
  playerMessage.innerHTML = "Wave Cleared.";
  toggleResting();
}

function nextWave() {
  updateWaveCounter();
  enemyCounter = 1;
  updateEnemyCounter();
  playerMessage.innerHTML = "";
  toggleShow(nextBtn);
  toggleResting();
  spawnEnemy();
  startEnemyAttack();
}

function toggleShow(e) {
  e.classList.toggle("show");
}

function spawnEnemy() {
  setTimeout(function() {
    var eliteStats = eliteModifier(enemyBase);
    if (enemyCounter === 10) {
      enemyCurrentHP = eliteStats.hp;
      enemyMaxHP = enemyCurrentHP;
      enemyGold = eliteStats.goldDrop;
      enemyDMG = eliteStats.dmg;
      enemyClass = "Elite";
    } else {
      enemyCurrentHP = enemyBase.hp;
      enemyMaxHP = enemyCurrentHP;
      enemyGold = enemyBase.goldDrop;
      enemyDMG = enemyBase.dmg;
      enemyClass = "Minion";
    }
    updateEnemyStats();
    updateEnemyHealth(enemyCurrentHP);
  }, 150);
}
var enemyAttackInterval = setInterval(enemyAttack, 1000);

var enemyAttack = function() {
  damagePlayer();
};

function startEnemyAttack() {
  enemyAttackInterval = setInterval(enemyAttack, 2000);
}

function stopEnemyAttack() {
  clearInterval(enemyAttackInterval);
}
// CALLED WITHIN SPAWN ENEMY, RETURNS NEW MODIFIED STATS, USED IF ENEMY COUNTER IS 9 or 10
function eliteModifier(stats) {
  var mod = stats.eliteMod;
  return { hp: stats.hp * mod, dmg: stats.dmg * mod, goldDrop: stats.goldDrop * mod };
}
// CALLED WHEN WAVE IS CLEARED, MUTATE MONSTER BASE STATS USING WAVE MODIFIER ARGUMENT
function waveModifier(waveMod) {
  var newBase = {
    ...enemyBase,
    hp: Math.round(enemyBase.hp * waveMod),
    dmg: Math.round(enemyBase.dmg * waveMod),
    goldDrop: Math.round(enemyBase.goldDrop * waveMod)
  };
  enemyBase = newBase;
}
// CALLED WHEN ENEMIES DIE, ADD ARGUMENT AMOUNT OF GOLD TO PLAYER'S GOLD BAG, UPDATE UI
function addGold(gold) {
  currentGold += gold;
  updateGoldDisplay();
}
// INCREASE PLAYER DAMAGE & UPDATE VISIBLE STATS
var upgradeGear = function(gearSlot, callback) {
  if (currentGold >= gearSlot.upgradeCost) {
    currentGold -= gearSlot.upgradeCost;
    gearSlot.level++;
    gearSlot.upgradeCost *= gearSlot.upgradeMod;
    callback();
  }
  upgradeDisplay();
};
function upgradeWeaponDMG() {
  var weaponUpgrade = function() {
    player.dmg = player.dmg * 2;
  };
  upgradeGear(weapon, weaponUpgrade);
}
// INCREASE PLAYER HEALTH & UPDATE VISIBLE STATS
function upgradeArmorHP() {
  var armorUpgrade = function() {
    playerMaxHP = Math.round(playerMaxHP * 1.9);
    healPlayer();
  };
  upgradeGear(armor, armorUpgrade);
}

var upgradeDisplay = function() {
  updateGoldDisplay();
  updateWeaponStats();
  updateArmorStats();
};

var buyRegenBtn = document.getElementById("buyRegenBtn");
var buyMidasBtn = document.getElementById("buyMidasBtn");
var buyAuraBtn = document.getElementById("buyAuraBtn");
var upgradeRegenBtn = document.getElementById("upgradeRegenBtn");
var upgradeMidasBtn = document.getElementById("upgradeMidasBtn");
var upgradeAuraBtn = document.getElementById("upgradeAuraBtn");
var regenCost = document.getElementById("regenCost");
var midasCost = document.getElementById("midasCost");
var auraCost = document.getElementById("auraCost");
var regenBonus = document.getElementById("regenBonus");
var midasBonus = document.getElementById("midasBonus");
var auraBonus = document.getElementById("auraBonus");
var regenUpgradeCost = document.getElementById("regenUpgradeCost");
var midasUpgradeCost = document.getElementById("midasUpgradeCost");
var auraUpgradeCost = document.getElementById("auraUpgradeCost");
var regenText = document.getElementById("regen");
var midasText = document.getElementById("midas");
var auraText = document.getElementById("aura");
var displaySkillEffect = function() {
  regenText.innerHTML = skills.regen.power;
  midasText.innerHTML = skills.midas.power;
  auraText.innerHTML = skills.aura.power;
};
var displaySkillCost = function() {
  regenCost.innerHTML = addSuffix(skills.regen.upgradeCost);
  midasCost.innerHTML = addSuffix(skills.midas.upgradeCost);
  auraCost.innerHTML = addSuffix(skills.aura.upgradeCost);
};
buyRegenBtn.onclick = function() {
  purchaseSkill(skills.regen);
};
buyMidasBtn.onclick = function() {
  purchaseSkill(skills.midas);
};
buyAuraBtn.onclick = function() {
  purchaseSkill(skills.aura);
};
displaySkillEffect();
displaySkillCost();
var purchaseSkill = function(skillObj) {
  var cost = skillObj.upgradeCost;
  if (currentGold >= cost) {
    currentGold -= cost;
    updateGoldDisplay();
    activateSkill(skillObj.name);
  }
};

var activateSkill = function(skillName) {
  switch (skillName) {
    case "Regen":
      castSpell("regen", regenEffect);
      toggleShow(buyRegenBtn);
      toggleShow(upgradeRegenBtn);
      break;
    case "Aura":
      castSpell("aura", auraEffect);
      toggleShow(buyAuraBtn);
      toggleShow(upgradeAuraBtn);
      break;
    case "Midas":
      castSpell("midas", midasEffect);
      toggleShow(buyMidasBtn);
      toggleShow(upgradeMidasBtn);
  }
};
var regenEffect = function() {
  if (!isResting) {
    if (playerHP < playerMaxHP) {
      updatePlayerHealth(playerHP + skills.regen.power);
    }
  }
};
var auraEffect = function() {
  if (!isResting) {
    var enemyHP = enemyCurrentHP - skills.aura.power;
    if (enemyHP <= 0) {
      enemyCurrentHP = 0;
      updateEnemyHealth(enemyCurrentHP);
      killEnemy();
    } else {
      updateEnemyHealth(enemyHP);
    }
  }
};
var midasEffect = function() {
  if (!isResting) {
    var gold = skills.midas.power;
    addGold(gold);
  }
};

var castSpell = function(id, effect) {
  clearInterval(id);
  var id = setInterval(effect, 1000);
  id;
};
// SHORTEN LARGE NUMBERS FOR GREATER THAN 1000
function addSuffix(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = [
      "",
      "k",
      "m",
      "b",
      "t",
      "q",
      "qn",
      "sx",
      "sp",
      "o",
      "n",
      "d",
      "ud",
      "dd",
      "td",
      "qd",
      "qnd",
      "sxd",
      "spd",
      "od",
      "nd",
      "v",
      "uv",
      "dv",
      "tv",
      "qv",
      "qnv",
      "sxv",
      "spv",
      "ov",
      "nv",
      "tg"
    ];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)
      );
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}
// CALLED WHEN WEAPON IS UPGRADED, UPDATES UI WITH NEW VALUES
function updateWeaponStats() {
  weaponLvlEl.innerHTML = weapon.level;
  weaponDMGEl.innerHTML = addSuffix(player.dmg);
  weaponCostEl.innerHTML = addSuffix(weapon.upgradeCost);
}
// CALLED WHEN ARMOR IS UPGRADED, UPDATES UI WITH NEW VALUES
function updateArmorStats() {
  armorLvlEl.innerHTML = armor.level;
  armorCostEl.innerHTML = addSuffix(armor.upgradeCost);
}
// CALLED WHEN AN ENEMY DIES, ADDS TO COUNTER AND UPDATES UI
function updateEnemyCounter() {
  counterDisplay.innerHTML = enemyCounter;
}

function updateEnemyStats() {
  enemyDamageText.innerHTML = addSuffix(enemyDMG);
  enemyGoldText.innerHTML = addSuffix(enemyGold);
  enemyClassText.innerHTML = enemyClass;
}
// CALLED WHEN A WAVE IS CLEARED, ADDS TO WAVE COUNTER, RESETS ENEMY COUNTER, UPDATES UI, AND CALLS WAVE MODIFIER
function updateWaveCounter() {
  waveNumber++;
  waveCounterDisplay.innerHTML = waveNumber;
  waveModifier(world.wave.modifier);
  enemyCounter = 1;
  updateEnemyCounter();
}
// CALLED WHEN AN ENEMY DIES OR UPGRADE IS PURCHASED, UPDATES GOLD DISPLAY UI
function updateGoldDisplay() {
  goldDisplay.innerHTML = addSuffix(currentGold);
}
// CALLED WHEN ENEMY IS CLICKED, OR PARTY MEMBER AUTO-ATTACKS, PERFORMS DAMAGE CALCS AND CALLS UI UPDATE
function damage(hp, dmg, death, display) {
  var newHP = hp - dmg;
  if (newHP <= 0) {
    newHP = 0;
    display(newHP);
    death();
  } else {
    hp = newHP;
    display(hp);
  }
}

function damageEnemy() {
  damage(enemyCurrentHP, player.dmg, killEnemy, updateEnemyHealth);
}
// SPAWN ENEMY, MUTATE STATS BASED ON ENEMY COUNTER, UPDATE UI & GOLD COUNTER
var killEnemy = function() {
  var goldDrop = enemyBase.goldDrop;
  var eliteStats = eliteModifier(enemyBase);
  if (enemyCounter === 10) {
    goldDrop = eliteStats.goldDrop;
    addGold(goldDrop);
    restAtCampfire();
  } else {
    enemyCounter++;
    addGold(goldDrop);
    updateEnemyCounter();
    spawnEnemy();
  }
};

function damagePlayer() {
  damage(playerHP, enemyDMG, killPlayer, updatePlayerHealth);
}

var killPlayer = function() {
  playerMessage.innerHTML = "You died. Gold Lost: " + currentGold;
  currentGold = 0;
  updateGoldDisplay();
  retreat();
};

// Update Health Abstraction for Simpler Function Calls
function updateHealth(maxHP, newHealth, type) {
  type === "player" ? (playerHP = newHealth) : (enemyCurrentHP = newHealth);
  var percent = (newHealth / maxHP) * 100;
  var HPBar = type + "HPBar";
  var HPText = type + "HPText";
  var maxHPText = type + "MaxHPText";
  window[HPBar].style.width = percent + "%";
  window[HPText].innerHTML = addSuffix(newHealth);
  window[maxHPText].innerHTML = addSuffix(maxHP);
}
// UPDATE PLAYER HEALTH DISPLAY FOR HEALTH BAR & TEXT READOUT
function updatePlayerHealth(health) {
  updateHealth(playerMaxHP, health, "player");
}
// UPDATE ENEMY HEALTH DISPLAY FOR HEALTH BAR & TEXT READOUT
function updateEnemyHealth(health) {
  updateHealth(enemyMaxHP, health, "enemy");
}
/* ------------ UI INITIALIZE ------------ */
updateEnemyCounter();
waveCounterDisplay.innerHTML = waveNumber;
updateEnemyHealth(enemyBase.hp);
updatePlayerHealth(playerHP);
upgradeDisplay();
spawnEnemy();
updateEnemyStats();

/* ------------ ASSIGN ONCLICK FUNCTIONS ------------ */
enemyHitBox.onclick = function() {
  damageEnemy();
};
weaponUpgrade.onclick = function() {
  upgradeWeaponDMG();
};
armorUpgrade.onclick = function() {
  upgradeArmorHP();
};
advanceBtn.onclick = function() {
  advance();
};
nextBtn.onclick = function() {
  nextWave();
};
retreatBtn.onclick = function() {
  retreat();
};
