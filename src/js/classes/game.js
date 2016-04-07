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
  this.gold = 0;
  this.goldRate = 0;
  this.goldRateBonus = 0;

  this.knowledge = 0;
  this.knowledgeRate = 0;
  this.knowledgeRateBonus = 0;

  this.favor = 0;
  this.favorRate = 0;
  this.favorRateBonus = 0;

  // Event Timers
  this.minionTime = 5;
  this.exploreTime = 0;
  this.attackTime = 0;
  this.defenseTime = 0;

  this.timers = {};
  this.timers.minion = 0;
  this.timers.explore = 0;
  this.timers.attack = 0;
  this.timers.defense = 0;

  // Minions
  this.minionOrder = 0;
  this.population = 0;
  this.populationCap = 6;

  this.minions = {};
  this.minions.idle = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.farm = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.temple = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.tower = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.school = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.defending = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.attacking = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};
  this.minions.exploring = {melee: 0, ranged: 0, cannon: 0, super: 0, total: 0};

  this.minionStats = {};
  this.minionStats.melee = {offense: 1, defense: 2, skill: 1, strength: 2};
  this.minionStats.ranged = {offense: 2, defense: 1, skill: 2, strength: 1};
  this.minionStats.cannon = {offense: 2, defense: 2, skill: 1, strength: 2};
  this.minionStats.super = {offense: 3, defense: 3, skill: 1, strength: 3};

  // Buildings
  this.buildings = {};
  this.buildings.house = new Building(this, HOUSE, 50, 0, false, {population: 3});
  this.buildings.farm = new Building(this, FARM, 100, 1, false, {rate: 1});
  this.buildings.school = new Building(this, SCHOOL, 1000, 4, false, {rate: 1});
  this.buildings.armory = new Building(this, ARMORY, 1000, 0, true, {});
  this.buildings.tower = new Building(this, TOWER, 800, 1, false, {});
  this.buildings.capitol = new Building(this, CAPITOL, 4000, 0, true, {});
  this.buildings.laboratory = new Building(this, LAB, 10000, 0, true, {});
  this.buildings.temple = new Building(this, TEMPLE, 2000, 5, false, {rate: 1});
};

Game.prototype.start = function() {
  this.step();
};

Game.prototype.step = function() {
  this.stepStart = new Date();
  var elapsedTime = (this.stepStart - this.stepEnd) / 1000;

  // Cap simulated time at 8 hours
  elapsedTime = Math.min(elapsedTime, 1000 * 60 * 60 * 8);

  var thisref = this;
  if (elapsedTime > 0 && !this.paused) {
    this.scope.$apply(function(scope) {
      thisref.applyTime(elapsedTime);
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
  this.addGold(this.goldRate * this.goldRateBonus);
  this.addKnowledge(this.knowledgeRate * this.knowledgeRateBonus);
  this.addFavor(this.favorRate * this.favorRateBonus);

  this.addMinionTime(time);
  this.addExploreTime(time);
  this.addAttackTime(time);
  this.addDefenseTime(time);

  this.time += time;
};

Game.prototype.addMinionTime = function(time) {
  this.timers.minion += time;

  var minions = Math.floor(this.timers.minion / this.minionTime);
  this.addMinions(minions);

  if (minions > 0)
    this.timers.minion = 0;
  else
    this.timers.minion = Math.min(this.timers.minion, this.minionTime);
};

Game.prototype.addExploreTime = function(time) {
};

Game.prototype.addAttackTime = function(time) {
};

Game.prototype.addDefenseTime = function(time) {
};

Game.prototype.addGold = function(gold) {
  this.gold += gold;
};

Game.prototype.addKnowledge = function(knowledge) {
  this.knowledge += knowledge;
};

Game.prototype.addFavor = function(favor) {
  this.favor += favor;
};

Game.prototype.addMinions = function(minions) {
  if (minions <= 0)
    return;

  // Add full sets of minions
  var sets = Math.floor(Math.min(minions / 7, (this.populationCap - this.population) / 7));
  if (sets > 0) {
    this.minions.idle.melee += 3 * sets;
    this.minions.idle.ranged += 3 * sets;
    this.minions.idle.cannon += 1 * sets;

    minions -= 7 * sets;
    this.population += 7 * sets;
  }

  // Add remaining individual minions
  while(minions > 0 && this.populationCap - this.population > 0) {
    if (this.minionOrder < 3)
      this.minions.idle.melee += 1;
    else if (this.minionOrder < 6)
      this.minions.idle.ranged += 1;
    else
      this.minions.idle.cannon += 1;

    minions -= 1;
    this.population += 1;
    this.minionOrder = (this.minionOrder + 1) % 7;
  }
};
