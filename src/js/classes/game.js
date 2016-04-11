var Game = function(scope) {
  this.Init(scope);
};

Game.prototype.Init = function(scope) {
  this.scope = scope;

  // Timing
  this.fps = 20;
  this.stepSize = 1 / this.fps;
  this.time = 0
  this.stepStart = new Date();
  this.stepEnd = new Date();
  this.paused;

  // Resources
  this.gold = 200;
  this.goldRate = 0;
  this.goldRateBase = 0;
  this.goldRateBonus = 1;

  this.knowledge = 0;
  this.knowledgeRate = 0;
  this.knowledgeRateBase = 0;
  this.knowledgeRateBonus = 1;

  this.favor = 0;
  this.favorRate = 0;
  this.favorRateBase = 0;
  this.favorRateBonus = 1;

  this.gear = {boots: 0, blades: 0, rings: 0, shields: 0};
  this.gearRate = 0;
  this.gearRateBase = 0;
  this.gearRateBonus = 1;

  // missions
  this.expeditionLevel = 1;
  this.raidLevel = 1;
  this.waveLevel = 1;

  // Event Timers
  this.minionTime = 5;
  this.expeditionTime = 2 * 60;
  this.raidTime = 3 * 60;
  this.waveTime = 10 * 60;

  this.timers = {};
  this.timers.minion = 0;
  this.timers.expedition = 0;
  this.timers.raid = 0;
  this.timers.wave = 0;

  // Minions
  this.minionOrder = 0;
  this.populationCap = 0;

  this.minions = {};
  this.minions[HUT] = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions[FARM] = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions[WORKSHOP] = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions[SHRINE] = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions[LIBRARY] = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions[TOWER] = {melee: 0, caster: 0, siege: 0, all: 0};

  this.minions.raid = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions.raidRally = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions.expedition = {melee: 0, caster: 0, siege: 0, all: 0};
  this.minions.expeditionRally = {melee: 0, caster: 0, siege: 0, all: 0};

  this.minionCounts = {melee: 0, caster: 0, siege: 0, all: 0};

  this.minionStats = {};
  this.minionStats.melee = {offense: 1, defense: 2, strength: 2, skill: 1};
  this.minionStats.caster = {offense: 2, defense: 1, strength: 1, skill: 2};
  this.minionStats.siege = {offense: 2, defense: 2, strength: 2, skill: 2};

  this.minionStatBonuses = {};
  this.minionStatBonuses.melee = {offense: 1, defense: 1, strength: 1, skill: 1};
  this.minionStatBonuses.caster = {offense: 1, defense: 1, strength: 1, skill: 1};
  this.minionStatBonuses.siege = {offense: 1, defense: 1, strength: 1, skill: 1};


  // Buildings
  this.buildings = Building.initializeBuildings(this);


};

Game.prototype.start = function() {
  this.step();
};

/////////////////////////////////////////////////////////
// TIME FUNCTIONS ///////////////////////////////////////
/////////////////////////////////////////////////////////
Game.prototype.step = function() {
  this.stepStart = new Date();
  var elapsedTime = (this.stepStart - this.stepEnd) / 1000;

  // Cap simulated time at 8 hours
  elapsedTime = Math.min(elapsedTime, 1000 * 60 * 60 * 8);

  var thisref = this;
  if (elapsedTime > 0 && !this.paused) {
    this.scope.$apply(function(scope) {
      thisref.applyTime(elapsedTime);
      if (thisref.statsUpdateRequired) {
        thisref.updateStats();
        thisref.statsUpdateRequired = false;
      }
    });
  } else {
    this.scope.$apply();
  }

  this.stepEnd = this.stepStart;
  window.setTimeout(function () {
    thisref.step();
  }, thisref.stepSize * 1000);
};

Game.prototype.applyTime = function(time) {
  this.addGold(this.goldRate * time);
  this.addKnowledge(this.knowledgeRate * time);
  this.addFavor(this.favorRate * time);
  this.addGear(this.gearRate * time);

  this.addMinionTime(time);
  this.addExpeditionTime(time);
  this.addRaidTime(time);
  this.addWaveTime(time);

  this.time += time;
};

Game.prototype.addMinionTime = function(time) {
  this.timers.minion += time;

  var minions = Math.floor(this.timers.minion / this.minionTime);
  var minionsAdded = this.addMinions(minions) || 0;

  this.timers.minion -= minionsAdded * this.minionTime;
  this.timers.minion = Math.min(this.timers.minion, this.minionTime);
};

Game.prototype.addExpeditionTime = function(time) {
  if(isNaN(this.timers.expedition)) {
    return;
  }

  this.timers.expedition += time;
  if (this.timers.expedition > this.expeditionTime) {
    this.getExpeditionOutcome();
  }
  this.timers.expedition = null;
};

Game.prototype.addRaidTime = function(time) {
  if(isNaN(this.timers.raid)) {
    return;
  }

  this.timers.raid += time;
  if (this.timers.raid > this.raidTime) {
    this.getRaidOutcome();
  }
  this.timers.raid = null;
};

Game.prototype.addWaveTime = function(time) {
  if(isNaN(this.timers.wave)) {
    return;
  }

  this.timers.wave += time;
  if (this.timers.wave > this.waveTime) {
    this.getWaveOutcome();
  }
  this.timers.wave = 0;
};

/////////////////////////////////////////////////////////
// UPDATE FUNCTIONS /////////////////////////////////////
/////////////////////////////////////////////////////////
Game.prototype.addGold = function(gold) {
  this.gold += gold;
};

Game.prototype.addKnowledge = function(knowledge) {
  this.knowledge += knowledge;
};

Game.prototype.addFavor = function(favor) {
  this.favor += favor;
};

Game.prototype.addGear = function(count) {
  var gear = this.buildings[WORKSHOP].data.type
  this.gear[gear] += count;
};

Game.prototype.addMinions = function(minions) {
  if (minions <= 0) {
    return;
  }

  var minionsAdded = 0;

  // Add full sets of minions
  var sets = Math.floor(Math.min(minions / 7, (this.populationCap - this.minionCounts.all) / 7));
  if (sets > 0) {
    this.minions[HUT].melee += 3 * sets;
    this.minions[HUT].caster += 3 * sets;
    this.minions[HUT].siege += 1 * sets;
    this.minions[HUT].all += 7 * sets;

    this.minionCounts.melee += 3 * sets;
    this.minionCounts.caster += 3 * sets;
    this.minionCounts.siege += 1 * sets;
    this.minionCounts.all += 7 * sets;

    minions -= 7 * sets;
    minionsAdded += 7 * sets;
  }

  // Add remaining individual minions
  while (minions > 0 && this.buildings[HUT].capacity - this.minionCounts.all > 0) {
    if (this.minionOrder < 3) {
      this.minions[HUT].melee++;
      this.minionCounts.melee++;
    } else if (this.minionOrder < 6) {
      this.minions[HUT].caster++;
      this.minionCounts.caster++;
    } else {
      this.minions[HUT].siege++;
      this.minionCounts.siege++;
    }
    this.minions[HUT].all++;
    this.minionCounts.all++;

    minions--;
    minionsAdded++;

    this.minionOrder = (this.minionOrder + 1) % 7;
  }
  return minionsAdded;
};

Game.prototype.updateStats = function() {
  this.goldRateBase = this.getMinionStatSum(this.minions[FARM], STRENGTH) * this.buildings[FARM].data.rate;
  this.knowledgeRateBase = this.getMinionStatSum(this.minions[LIBRARY], SKILL) * this.buildings[LIBRARY].data.rate;
  this.favorRateBase = this.getMinionStatSum(this.minions[SHRINE], SKILL) * this.buildings[SHRINE].data.rate;
  this.gearRateBase = this.getMinionStatSum(this.minions[WORKSHOP], STRENGTH) * this.buildings[WORKSHOP].data.rate;

  this.goldRateBonus = this.goldRateBonus;
  this.knowledgeRateBonus = this.knowledgeRateBonus;
  this.favorRateBonus = this.favorRateBonus;
  this.gearRateBonus = this.gearRateBonus;

  this.goldRate = this.goldRateBase * this.goldRateBonus;
  this.knowledgeRate = this.knowledgeRateBase * this.knowledgeRateBonus;
  this.favorRate = this.favorRateBase * this.favorRateBonus;
  this.gearRate = this.gearRateBase * this.gearRateBonus;
};




/////////////////////////////////////////////////////////
// USER ACTIONS /////////////////////////////////////////
/////////////////////////////////////////////////////////
Game.prototype.moveMinions = function(minions, type, currentBuilding, newBuilding) {
  if (minions < 1) {
    return;
  }

  currentBuilding = currentBuilding || HUT;
  newBuilding = newBuilding || HUT;
  var currentLocation = this.minions[currentBuilding];
  var newLocation = this.minions[newBuilding];

  var currentCount = currentLocation[type];
  var openSpots = this.buildings[newBuilding].capacity - newLocation[ALL];
  var minionsMoved = Math.min(minions, currentCount, openSpots);

  currentLocation[type] -= minionsMoved;
  currentLocation[ALL] -= minionsMoved;
  newLocation[type] += minionsMoved;
  newLocation[ALL] += minionsMoved;

  if (minionsMoved > 0) {
    this.statsUpdateRequired = true;
  }
};

Game.prototype.buyBuilding = function(buildingName, count) {
  count = count || 1;

  var building = this.buildings[buildingName];
  if (building.unique && building.count > 0) {
    return;
  }

  var bought = 0;
  while (count--) {
    if (this.gold >= building.cost.gold &&
        this.knowledge >= building.cost.knowledge &&
        this.favor >= building.cost.favor) {

      this.gold -= building.cost.gold;
      this.knowledge -= building.cost.knowledge;
      this.favor -= building.cost.favor;

      building.count++;
      bought++;
    } else {
      break;
    }
  }
  if (bought && building.slots) {
    building.capacity += building.slots * bought;
  }
};

Game.prototype.launchExpedition = function() {
  this.moveAllMinions(EXPEDITION_RALLY, EXPEDITION);
  this.timers.expedition = 0;
};


Game.prototype.launchRaid = function() {
  this.moveAllMinions(RAID_RALLY, RAID);
  this.timers.raid = 0;

};




/////////////////////////////////////////////////////////
// UTILITY FUNCTIONS ////////////////////////////////////
/////////////////////////////////////////////////////////
Game.prototype.moveAllMinions = function(currentBuilding, newBuilding) {
  for (var i = 0; i < MINION_TYPES.length; i++) {
    var type = MINION_TYPES[i];
    if (currentBuildin)
  }
};

Game.prototype.getMinionStatSum = function(object, stat) {
  var sum = 0;
  sum += object.melee * this.minionStats.melee[stat];
  sum += object.caster * this.minionStats.caster[stat];
  sum += object.siege * this.minionStats.siege[stat];
  return sum;
};
