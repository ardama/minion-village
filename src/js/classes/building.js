var Building = function(game, name, cost, capacity, unique, data) {
  this.Init(game, name, cost, capacity, unique, data);
};

Building.prototype.Init = function(game, name, cost, capacity, unique, data) {
  this.game = game;
  this.name = name;

  this.cost = cost;
  this.capacity = capacity;
  this.unique = unique;
  this.data = data;

  this.startCost = cost;
  this.minions = 0;
};
