var version = '0.0.4';

// Buildings
var HUT = 'hut';
var FARM = 'farm';
var WORKSHOP = 'workshop';
var LIBRARY = 'library';
var SHRINE = 'shrine';
var TOWER = 'tower';

var STABLE = 'stable';
var ARMORY = 'armory';
var CAPITOL = 'capitol';
var LAB = 'laboratory';

var RAID = "raid";
var RAID_RALLY = "raid rally";
var EXPEDITION = "expedition";
var EXPEDITION_RALLY = "expedition rally";

var BUILDINGS = [HUT, FARM, WORKSHOP, LIBRARY, SHRINE, TOWER, STABLE, ARMORY, CAPITOL, LAB];

// Minion types
var MELEE = 'melee';
var CASTER = 'caster';
var SIEGE = 'siege';
var ALL = 'all';

var MINION_TYPES = [MELEE, CASTER, SIEGE];

// Minion stats
var OFFENSE = 'offense';
var DEFENSE = 'defense';
var STRENGTH = 'strength';
var SKILL = 'skill';

// Mission gear
var BOOTS = 'boots';
var BLADES = 'blades';
var RINGS = 'rings';
var SHIELDS = 'shields';


// Game constants
var START_GOLD = 100;
var SUPER_MINION_BONUS = 2;



var GameApp = angular.module('GameApp', []);
GameApp.controller('GameController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.version = version;
  window.scope = $scope;
  $scope.g = new Game($scope);
}]);


$(window).load(function() {
  scope.g.start();
});
