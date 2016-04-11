var Building = function(game, name, slots, cost, data) {
  this.Init(game, name, slots, cost, data);
};

Building.prototype.Init = function(game, name, slots, cost, data) {
  this.game = game;
  this.name = name;
  this.slots = slots;
  this.cost = cost;
  this.data = data;

  this.startCost = cost;
  this.capacity = 0;
};

Building.initializeBuildings = function(game) {
  var buildings = {};
  buildings.hut = new Building(
    game, HUT, 2,
    {gold: 100, knowledge: 0, favor: 0},
    {}
  );
  buildings.tower = new Building(
    game, TOWER, 4,
    {gold: 100, knowledge: 0, favor: 0},
    {}
  );

  buildings.farm = new Building(
    game, FARM, 2,
    {gold: 100, knowledge: 0, favor: 0},
    {rate: 1}
  );
  buildings.workshop = new Building(
    game, WORKSHOP, 2,
    {gold: 100, knowledge: 0, favor: 0},
    {rate: 1, type: BOOTS}
  );
  buildings.library = new Building(
    game, LIBRARY, 2,
    {gold: 100, knowledge: 0, favor: 0},
    {rate: 1}
  );
  buildings.shrine = new Building(
    game, SHRINE, 2,
    {gold: 100, knowledge: 0, favor: 0},
    {rate: 1}
  );

  buildings.stable = new Building(
    game, STABLE, 0,
    {gold: 100, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.armory = new Building(
    game, ARMORY, 0,
    {gold: 100, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.capitol = new Building(
    game, CAPITOL, 0,
    {gold: 100, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.laboratory = new Building(
    game, LAB, 0,
    {gold: 100, knowledge: 0, favor: 0},
    {unique: true}
  );

  buildings.raid = new Building(
    game, RAID, 0,
    {gold: 0, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.expedition = new Building(
    game, EXPEDITION, 0,
    {gold: 0, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.raidRally = new Building(
    game, RAID_RALLY, 0,
    {gold: 0, knowledge: 0, favor: 0},
    {unique: true}
  );
  buildings.expeditionRally = new Building(
    game, EXPEDITION_RALLY, 0,
    {gold: 0, knowledge: 0, favor: 0},
    {unique: true}
  );

  return buildings;
}
