var version = '0.0.5';

// Minion types
var MELEE = 'melee';
var CASTER = 'caster';
var SIEGE = 'siege';
var ALL = 'all';

var MINION_TYPES = [MELEE, CASTER, SIEGE];

// Minion stats
var DAMAGE = 'damage';
var DURABILITY = 'durability';
var STRENGTH = 'strength';
var SKILL = 'skill';

// Mission gear
var MACHETES = 'machetes';
var TALISMANS = 'talismans';
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
