var version = '0.0.1';

// Buildings
var HOUSE = 'house';
var FARM = 'farm';
var SCHOOL = 'school';
var TEMPLE = 'temple';
var TOWER = 'tower';
var ARMORY = 'armory';
var CAPITOL = 'capitol';
var LAB = 'laboratory';

var BUILDINGS = [HOUSE, FARM, SCHOOL, TEMPLE, TOWER, ARMORY, CAPITOL, LAB];

// Minion types
var MELEE = 'melee';
var RANGED = 'ranged';
var CANNON = 'cannon';
var SUPER = 'super';

var MINION_TYPES = [MELEE, RANGED, CANNON, SUPER];



var GameApp = angular.module('GameApp', []);
GameApp.controller('GameController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.version = version;
  window.scope = $scope;
  $scope.g = new Game($scope);
}]);


$(window).load(function() {
  scope.g.start();
});
