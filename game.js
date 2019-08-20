const baseStores = {
  player: {
    hp: 50,
    dmg: 1,
    goldInit: 0,
    gear: {
      weapon: { level: 1, upgradeCost: 10, upgradeMod: 2 },
      armor: { level: 1, upgradeCost: 10, upgradeMod: 3 }
    }
  },
  enemy: { hp: 3, dmg: 1, goldDrop: 3, eliteMod: 4, bossMod: 3 },
  skills: {
    regen: {
      power: 10,
      level: 1,
      upgradeCost: 1000,
      purchaseCost: 1000,
      costMultiplier: 1.2,
      powerIncrease: 1.75,
      name: "Regen"
    },
    midas: {
      power: 100,
      level: 1,
      upgradeCost: 10000,
      purchaseCost: 10000,
      costMultiplier: 1.2,
      powerIncrease: 1.75,
      name: "Midas"
    },
    aura: {
      power: 1000,
      level: 1,
      upgradeCost: 100000,
      purchaseCost: 100000,
      costMultiplier: 1.2,
      powerIncrease: 1.75,
      name: "Aura"
    }
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
};
/* ------------ DECLARE DOM ELEMENTS FOR INNERHTML ------------ */
// PLAYER INFO DISPLAY
const playerHPBar = document.getElementById("playerHPBar"),
  playerHPText = document.getElementById("playerCurrentHP"),
  playerMaxHPText = document.getElementById("playerMaxHP"),
  playerMessage = document.getElementById("playerMessage"),
  // ENEMY INFO DISPLAY
  enemyHitBox = document.getElementById("enemyHitbox"),
  enemyHPBar = document.getElementById("enemyCurrentHP"),
  enemyHPText = document.getElementById("enemyHPText"),
  enemyMaxHPText = document.getElementById("enemyMaxHPText"),
  enemyGoldText = document.getElementById("enemyGold"),
  enemyDamageText = document.getElementById("enemyDamage"),
  enemyClassText = document.getElementById("enemyClass"),
  // CAMPFIRE DISPLAY
  campfire_e = document.getElementById("campfire"),
  enemy_e = document.getElementById("enemy"),
  advanceBtn = document.getElementById("advance"),
  retreatBtn = document.getElementById("retreat"),
  nextBtn = document.getElementById("next"),
  // COUNTER & GOLD DISPLAY ELEMENTS
  counterDisplay = document.getElementById("enemyCounter"),
  waveCounterDisplay = document.getElementById("waveCounter"),
  goldDisplay = document.getElementById("goldDisplay"),
  // WEAPON DISPLAY ELEMENTS
  weaponLvlEl = document.getElementById("weaponLvl"),
  weaponDMGEl = document.getElementById("weaponDMG"),
  weaponCostEl = document.getElementById("weaponCost"),
  // ARMOR DISPLAY ELEMENTS
  armorLvlEl = document.getElementById("armorLvl"),
  armorHPEl = document.getElementById("armorHP"),
  armorCostEl = document.getElementById("armorCost"),
  // UPGRADE BUTTONS
  weaponUpgrade = document.getElementById("weaponUpgrade"),
  armorUpgrade = document.getElementById("armorUpgrade"),
  buyRegenBtn = document.getElementById("buyRegenBtn"),
  buyMidasBtn = document.getElementById("buyMidasBtn"),
  buyAuraBtn = document.getElementById("buyAuraBtn"),
  upgradeRegenBtn = document.getElementById("upgradeRegenBtn"),
  upgradeMidasBtn = document.getElementById("upgradeMidasBtn"),
  upgradeAuraBtn = document.getElementById("upgradeAuraBtn"),
  regenCost = document.getElementById("regenCost"),
  midasCost = document.getElementById("midasCost"),
  auraCost = document.getElementById("auraCost"),
  regenBonusTxt = document.getElementById("regenBonus"),
  midasBonusTxt = document.getElementById("midasBonus"),
  auraBonusTxt = document.getElementById("auraBonus"),
  regenUpgradeCost = document.getElementById("regenUpgradeCost"),
  midasUpgradeCost = document.getElementById("midasUpgradeCost"),
  auraUpgradeCost = document.getElementById("auraUpgradeCost"),
  regenText = document.getElementById("regen"),
  midasText = document.getElementById("midas"),
  auraText = document.getElementById("aura");
/* ------------ CREATE MUTABLE VARIABLES BASED ON STORE ------------ */
let player = { ...baseStores.player },
  enemyBase = { ...baseStores.enemy },
  party = { ...baseStores.party },
  world = { ...baseStores.world },
  skills = { ...baseStores.skills },
  isResting = true;
/* ------------ INITIALIZE GEAR OBJECTS FROM STORE VARIABLES ------------ */
const weapon = player.gear.weapon,
  armor = player.gear.armor;
/* ------------ COUNTER VARIABLES ------------ */
let currentGold = player.goldInit,
  enemyMaxHP = enemyBase.hp,
  enemyCurrentHP = enemyBase.hp,
  enemyDMG = enemyBase.dmg,
  enemyGold = enemyBase.goldDrop,
  playerHP = player.hp,
  playerMaxHP = player.hp,
  waveNumber = world.wave.num,
  regenBonus = skills.regen.power,
  auraBonus = skills.aura.power,
  midasBonus = skills.midas.power,
  enemyClass = "",
  enemyCounter = 1;
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

// SHORTEN LARGE NUMBERS FOR GREATER THAN 1000
const addSuffix = value => {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = [
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
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = "";
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)
      );
      const dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
};
// Update Health Abstraction for Simpler Function Calls
const updateHealth = (maxHP, newHealth, type) => {
  type === "player" ? (playerHP = newHealth) : (enemyCurrentHP = newHealth);
  const percent = (newHealth / maxHP) * 100;
  const healthObj = { percent, maxHP, newHealth };
  type === "player" ? playerHPDisplay(healthObj) : enemyHPDisplay(healthObj);
};
const playerHPDisplay = healthObj => {
  playerHPBar.style.width = healthObj.percent + "%";
  playerHPText.innerHTML = addSuffix(healthObj.newHealth);
  playerMaxHPText.innerHTML = addSuffix(healthObj.maxHP);
};
const enemyHPDisplay = healthObj => {
  enemyHPBar.style.width = healthObj.percent + "%";
  enemyHPText.innerHTML = addSuffix(healthObj.newHealth);
  enemyMaxHPText.innerHTML = addSuffix(healthObj.maxHP);
};
// UPDATE PLAYER HEALTH DISPLAY FOR HEALTH BAR & TEXT READOUT
const updatePlayerHealth = health => updateHealth(playerMaxHP, health, "player"),
  // UPDATE ENEMY HEALTH DISPLAY FOR HEALTH BAR & TEXT READOUT
  updateEnemyHealth = health => updateHealth(enemyMaxHP, health, "enemy"),
  // EASY FUNCTION TO CALL WHEN HEALING PLAYER TO FULL HEALTH
  healPlayer = () => updatePlayerHealth(playerMaxHP),
  // TOGGLE LIST OF ELEMENTS, USED TO TRANSITION TO OR FROM THE CAMPFIRE
  toggleResting = () => {
    const toggle_elements = [campfire_e, enemy_e, retreatBtn, enemyHitBox];
    for (var e of toggle_elements) {
      toggleShow(e);
    }
    isResting = !isResting;
  },
  // ALLOW PLAYER TO RETURN TO CAMPFIRE, OR TRIGGERED ON PLAYER DEATH
  retreat = () => {
    enemyCounter = 1;
    stopEnemyAttack();
    toggleShow(advanceBtn);
    healPlayer();
    toggleResting();
  },
  // RETURN TO BATTLE, SAME WAVE NUMBER
  advance = () => {
    toggleResting();
    toggleShow(advanceBtn);
    spawnEnemy();
    startEnemyAttack();
  },
  // CALLED WHEN WAVE CLEARED, ALLOWS PLAYER TO MOVE TO NEXT WAVE
  restAtCampfire = () => {
    stopEnemyAttack();
    healPlayer();
    toggleShow(nextBtn);
    playerMessage.innerHTML = "Wave Cleared.";
    toggleResting();
  },
  // UPDATES ENEMY BASE STATS AND STARTS NEW WAVE
  nextWave = () => {
    updateWaveCounter();
    enemyCounter = 1;
    displayEnemyCounter();
    playerMessage.innerHTML = "";
    toggleShow(nextBtn);
    toggleResting();
    spawnEnemy();
    startEnemyAttack();
  },
  // UTILITY FUNCTION, TOGGLE "SHOW" CLASS FOR ELEMENT ARGUMENT
  toggleShow = e => {
    e.classList.toggle("show");
  },
  // DETERMINES ENEMY STATS, UPDATES VALUES AND DISPLAYS
  spawnEnemy = () => {
    setTimeout(() => {
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
      displayEnemyStats();
      updateEnemyHealth(enemyCurrentHP);
    }, 150);
  };
// ENEMY ATTACK INTERVAL START/STOP FUNCTIONS
let enemyAttackInterval;
const enemyAttack = () => !isResting && damagePlayer(),
  startEnemyAttack = () => (enemyAttackInterval = setInterval(enemyAttack, 2000)),
  stopEnemyAttack = () => clearInterval(enemyAttackInterval),
  // CALLED WITHIN SPAWN ENEMY, RETURNS NEW MODIFIED STATS, USED IF ENEMY COUNTER IS 9 or 10
  eliteModifier = stats => {
    const mod = stats.eliteMod;
    return { hp: stats.hp * mod, dmg: stats.dmg * mod, goldDrop: stats.goldDrop * mod };
  },
  // CALLED WHEN WAVE IS CLEARED, MUTATE MONSTER BASE STATS USING WAVE MODIFIER ARGUMENT
  waveModifier = waveMod => {
    const newBase = {
      ...enemyBase,
      hp: Math.round(enemyBase.hp * waveMod),
      dmg: Math.round(enemyBase.dmg * waveMod),
      goldDrop: Math.round(enemyBase.goldDrop * waveMod)
    };
    enemyBase = newBase;
  },
  // CALLED WHEN ENEMIES DIE, ADD ARGUMENT AMOUNT OF GOLD TO PLAYER'S GOLD BAG, UPDATE UI
  addGold = gold => {
    currentGold += gold;
    displayGold();
  },
  // INCREASE PLAYER DAMAGE & UPDATE VISIBLE STATS
  upgradeGear = (gearSlot, upgrade) => {
    if (currentGold >= gearSlot.upgradeCost) {
      currentGold -= gearSlot.upgradeCost;
      gearSlot.level++;
      gearSlot.upgradeCost *= gearSlot.upgradeMod;
      upgrade();
      displayUpgrades();
    }
  },
  upgradeWeaponDMG = () => {
    const weaponUpgrade = () => (player.dmg *= 2);
    upgradeGear(weapon, weaponUpgrade);
  },
  // INCREASE PLAYER HEALTH & UPDATE VISIBLE STATS
  upgradeArmorHP = () => {
    const armorUpgrade = () => ((playerMaxHP = Math.round(playerMaxHP * 1.9)), healPlayer());
    upgradeGear(armor, armorUpgrade);
  },
  displayUpgrades = () => (displayGold(), displayWeaponStats(), displayArmorStats()),
  displaySkillEffect = () => {
    regenText.innerHTML = skills.regen.power;
    midasText.innerHTML = skills.midas.power;
    auraText.innerHTML = skills.aura.power;
  },
  displaySkillCost = () => {
    regenCost.innerHTML = addSuffix(skills.regen.purchaseCost);
    midasCost.innerHTML = addSuffix(skills.midas.purchaseCost);
    auraCost.innerHTML = addSuffix(skills.aura.purchaseCost);
  },
  displaySkillUpgrades = () => {
    regenUpgradeCost.innerHTML = addSuffix(skills.regen.upgradeCost);
    midasUpgradeCost.innerHTML = addSuffix(skills.midas.upgradeCost);
    auraUpgradeCost.innerHTML = addSuffix(skills.aura.upgradeCost);
    regenBonusTxt.innerHTML = addSuffix(regenBonus);
    midasBonusTxt.innerHTML = addSuffix(midasBonus);
    auraBonusTxt.innerHTML = addSuffix(auraBonus);
  },
  purchaseSkill = skillObj => {
    const cost = skillObj.purchaseCost;
    if (currentGold >= cost) {
      currentGold -= cost;
      displayGold();
      activateSkill(skillObj.name);
    }
  },
  upgradeSkill = skillObj => {
    if (currentGold >= skillObj.upgradeCost) {
      currentGold -= skillObj.upgradeCost;
      displayGold();
      switchSkill(skillObj);
    }
  },
  activateSkill = skillName => {
    switch (skillName) {
      case "Regen":
        castSkill("regen", regenEffect);
        toggleShow(buyRegenBtn);
        toggleShow(upgradeRegenBtn);
        break;
      case "Aura":
        castSkill("aura", auraEffect);
        toggleShow(buyAuraBtn);
        toggleShow(upgradeAuraBtn);
        break;
      case "Midas":
        castSkill("midas", midasEffect);
        toggleShow(buyMidasBtn);
        toggleShow(upgradeMidasBtn);
    }
    displaySkillUpgrades();
  },
  switchSkill = skillObj => {
    switch (skillObj.name) {
      case "Regen":
        skillPowerIncrease(regenBonus, skillObj);
        break;
      case "Aura":
        skillPowerIncrease(auraBonus, skillObj);
        break;
      case "Midas":
        skillPowerIncrease(midasBonus, skillObj);
      default:
        break;
    }
  },
  skillPowerIncrease = (bonus, obj) => {
    obj.power = Math.round(obj.power * obj.powerIncrease);
    obj.level++;
    obj.upgradeCost = Math.round(obj.upgradeCost * obj.costMultiplier);
    bonus = obj.power;
    displaySkillUpgrades();
  };
let regen, aura, midas;
const regenEffect = () => {
    if (!isResting) {
      if (playerHP < playerMaxHP) {
        let newHP = playerHP + skills.regen.power;
        newHP > playerMaxHP && (newHP = playerMaxHP);
        updatePlayerHealth(newHP);
      }
    }
  },
  auraEffect = () => {
    if (!isResting) {
      const enemyHP = enemyCurrentHP - skills.aura.power;
      if (enemyHP <= 0) {
        enemyCurrentHP = 0;
        updateEnemyHealth(enemyCurrentHP);
        killEnemy();
      } else {
        updateEnemyHealth(enemyHP);
      }
    }
  },
  midasEffect = () => {
    if (!isResting) {
      const gold = skills.midas.power;
      addGold(gold);
    }
  },
  castSkill = (id, effect) => {
    clearInterval(id);
    id = setInterval(effect, 1000);
    id;
  },
  // CALLED WHEN WEAPON IS UPGRADED, UPDATES UI WITH NEW VALUES
  displayWeaponStats = () => {
    weaponLvlEl.innerHTML = weapon.level;
    weaponDMGEl.innerHTML = addSuffix(player.dmg);
    weaponCostEl.innerHTML = addSuffix(weapon.upgradeCost);
  },
  // CALLED WHEN ARMOR IS UPGRADED, UPDATES UI WITH NEW VALUES
  displayArmorStats = () => {
    armorLvlEl.innerHTML = armor.level;
    armorCostEl.innerHTML = addSuffix(armor.upgradeCost);
  },
  // CALLED WHEN AN ENEMY DIES, ADDS TO COUNTER AND UPDATES UI
  displayEnemyCounter = () => (counterDisplay.innerHTML = enemyCounter),
  displayEnemyStats = () => {
    enemyDamageText.innerHTML = addSuffix(enemyDMG);
    enemyGoldText.innerHTML = addSuffix(enemyGold);
    enemyClassText.innerHTML = enemyClass;
  },
  // CALLED WHEN A WAVE IS CLEARED, ADDS TO WAVE COUNTER, RESETS ENEMY COUNTER, UPDATES UI, AND CALLS WAVE MODIFIER
  updateWaveCounter = () => {
    waveNumber++;
    waveCounterDisplay.innerHTML = waveNumber;
    waveModifier(world.wave.modifier);
    enemyCounter = 1;
    displayEnemyCounter();
  },
  // CALLED WHEN GOLD IS RECEIVED OR UPGRADE IS PURCHASED, UPDATES GOLD DISPLAY UI
  displayGold = () => (goldDisplay.innerHTML = addSuffix(currentGold)),
  // UTILITY FUNCTION, DRY CODE FOR DAMAGE ENEMY & DAMAGE PLAYER
  damage = (hp, dmg, death, display) => {
    let newHP = hp - dmg;
    if (newHP <= 0) {
      newHP = 0;
      display(newHP);
      death();
    } else {
      hp = newHP;
      display(hp);
    }
  },
  damageEnemy = () => damage(enemyCurrentHP, player.dmg, killEnemy, updateEnemyHealth),
  damagePlayer = () => damage(playerHP, enemyDMG, killPlayer, updatePlayerHealth),
  // HANDLE KILL ENEMY LOGIC, WAVE COMPLETE OR SPAWN ANOTHER ENEMY
  killEnemy = () => {
    let goldDrop = enemyBase.goldDrop;
    const eliteStats = eliteModifier(enemyBase);
    if (enemyCounter !== 10) {
      enemyCounter++;
      addGold(goldDrop);
      displayEnemyCounter();
      spawnEnemy();
    } else {
      goldDrop = eliteStats.goldDrop;
      addGold(goldDrop);
      restAtCampfire();
    }
  },
  // HANDLE KILL PLAYER RESULT, MESSAGE, REMOVE GOLD, RETREAT
  killPlayer = () => {
    playerMessage.innerHTML = "You died. Gold Lost: " + currentGold;
    currentGold = 0;
    displayGold();
    retreat();
  };
/* ------------ UI INITIALIZE ------------ */
waveCounterDisplay.innerHTML = waveNumber;
updateEnemyHealth(enemyBase.hp);
updatePlayerHealth(playerHP);
displayUpgrades();
displayEnemyCounter();
spawnEnemy();
displayEnemyStats();
displaySkillEffect();
displaySkillCost();

/* ------------ ASSIGN ONCLICK FUNCTIONS ------------ */
enemyHitBox.onclick = () => damageEnemy();
weaponUpgrade.onclick = () => upgradeWeaponDMG();
armorUpgrade.onclick = () => upgradeArmorHP();
advanceBtn.onclick = () => advance();
nextBtn.onclick = () => nextWave();
retreatBtn.onclick = () => retreat();
buyRegenBtn.onclick = () => purchaseSkill(skills.regen);
buyMidasBtn.onclick = () => purchaseSkill(skills.midas);
buyAuraBtn.onclick = () => purchaseSkill(skills.aura);
upgradeRegenBtn.onclick = () => upgradeSkill(skills.regen);
upgradeMidasBtn.onclick = () => upgradeSkill(skills.midas);
upgradeAuraBtn.onclick = () => upgradeSkill(skills.aura);
