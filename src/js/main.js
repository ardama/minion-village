var version = '0.0.3';

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

var BUILDINGS = [HUT, FARM, WORKSHOP, LIBRARY, SHRINE, TOWER, STABLE, ARMORY, CAPITOL, LAB];

// Minion types
var MELEE = 'melee';
var RANGED = 'ranged';
var CANNON = 'cannon';
var SUPER = 'super';
var ALL = 'all';

var MINION_TYPE = [MELEE, RANGED, CANNON, SUPER, ALL];

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


var GameApp = angular.module('GameApp', []);
GameApp.controller('GameController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.version = version;
  window.scope = $scope;
  $scope.g = new Game($scope);
}]);


$(window).load(function() {
  scope.g.start();
});
