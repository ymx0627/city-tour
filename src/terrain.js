"use strict";

var CityTour = CityTour || {};

CityTour.Terrain = function(coordinates) {
  var interpolateHeight = function(point, floor, ceiling) {
    var heightDifferential = ceiling - floor;
    var percentage = point - Math.floor(point);
    return floor + (heightDifferential * percentage);
  };

  var terrain = {};

  terrain.heightAtCoordinates = function(x, z) {
    var xIsWhole = (Math.floor(x) === x);
    var zIsWhole = (Math.floor(z) === z);
    var leftHeight, rightHeight, topHeight, bottomHeight;
    var topRowInterpolatedHeight, bottomRowInterpolatedHeight;

    if (xIsWhole && zIsWhole) {
      return coordinates[x][z];
    }

    if (!xIsWhole && zIsWhole) {
      leftHeight = coordinates[Math.floor(x)][z];
      rightHeight = coordinates[Math.ceil(x)][z];

      return interpolateHeight(x, leftHeight, rightHeight);
    }
    else if (xIsWhole && !zIsWhole) {
      topHeight = coordinates[x][Math.floor(z)];
      bottomHeight = coordinates[x][Math.ceil(z)];

      return interpolateHeight(z, topHeight, bottomHeight);
    }
    else {
      leftHeight = coordinates[Math.floor(x)][Math.floor(z)];
      rightHeight = coordinates[Math.ceil(x)][Math.floor(z)];
      topRowInterpolatedHeight = interpolateHeight(x, leftHeight, rightHeight);

      leftHeight = coordinates[Math.floor(x)][Math.ceil(z)];
      rightHeight = coordinates[Math.ceil(x)][Math.ceil(z)];
      bottomRowInterpolatedHeight = interpolateHeight(x, leftHeight, rightHeight);

      return interpolateHeight(z, topRowInterpolatedHeight, bottomRowInterpolatedHeight);
    }
  };

  return terrain;
};
