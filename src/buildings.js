"use strict";

var Buildings = function(terrain) {
  var MAX_BUILDING_STORIES = 40;
  var MAX_TERRAIN_STEEPNESS_FOR_BUILDING = 3;

  var BLOCK_LAYOUTS = [
    [ { left:     0.0,  right: 1.0,  top: 0.0,  bottom: 1.0, } ],


    [ { left:     0.0,  right: 0.5,  top: 0.0,  bottom:  1.0 },
      { left:     0.5,  right: 1.0,  top: 0.0,  bottom:  1.0 } ],


    [ { left:     0.0,  right: 1.0,  top: 0.0,  bottom: 0.5 },
      { left:     0.0,  right: 1.0,  top: 0.5,  bottom: 1.0 } ],


    [ { left:     0.0,  right: 0.5,  top: 0.0,  bottom: 1.0 },
      { left:     0.5,  right: 1.0,  top: 0.0,  bottom: 0.5 },
      { left:     0.5,  right: 1.0,  top: 0.5,  bottom: 1.0 } ],


    [ { left:     0.0,  right: 0.5,  top: 0.0,  bottom: 0.5, },
      { left:     0.5,  right: 1.0,  top: 0.0,  bottom: 0.5, },
      { left:     0.0,  right: 0.5,  top: 0.5,  bottom: 1.0, },
      { left:     0.5,  right: 1.0,  top: 0.5,  bottom: 1.0, } ],


    [ { left:     0.0,  right: (1 / 3),  top: 0.0,  bottom:  0.5 },
      { left: (1 / 3),  right: (2 / 3),  top: 0.0,  bottom:  0.5 },
      { left: (2 / 3),  right:     1.0,  top: 0.0,  bottom:  0.5 },
      { left:     0.0,  right:     0.5,  top: 0.5,  bottom: 1.0 },
      { left:     0.5,  right:     1.0,  top: 0.5,  bottom: 1.0 } ],


    [ { left:     0.0,  right: 0.25,  top: 0.0,    bottom:  (1/3), },
      { left:     0.75, right: 1.0,   top: 0.0,    bottom:  (1/3), },
      { left:     0.0,  right: 0.25,  top: (2/3),  bottom:  1.0, },
      { left:     0.75, right: 1.0,   top: (2/3),  bottom:  1.0, },

      { left:     0.0, right: 0.25,   top: (1/3),  bottom:  0.5, },
      { left:     0.0, right: 0.25,   top:   0.5,  bottom:  (2/3), },
      { left:     0.75, right: 1.0,   top: (1/3),  bottom:  0.5, },
      { left:     0.75, right: 1.0,   top:   0.5,  bottom:  (2/3), },

      { left:     0.25,   right: 0.4167,  top: 0.0,  bottom:  0.5, },
      { left:     0.4167, right: 0.5834,  top: 0.0,  bottom:  0.5, },
      { left:     0.5834, right: 0.75,    top: 0.0,  bottom:  0.5, },
      { left:     0.25,   right: 0.4167,  top: 0.5,  bottom:  1.0, },
      { left:     0.4167, right: 0.5834,  top: 0.5,  bottom:  1.0, },
      { left:     0.5834, right: 0.75,    top: 0.5,  bottom:  1.0, }, ],
  ];

  var generateUnitBlocks = function(terrain) {
    var blocks = [];
    var block;
    var mapX, mapZ;
    var maxStories, actualStories;

    for (mapX = -CityConfig.HALF_BLOCK_COLUMNS; mapX < CityConfig.HALF_BLOCK_COLUMNS; mapX++) {
      blocks[mapX] = [];

      for (mapZ = -CityConfig.HALF_BLOCK_ROWS; mapZ < CityConfig.HALF_BLOCK_ROWS; mapZ++) {
        var blockLayout = BLOCK_LAYOUTS[Math.floor(Math.random() * BLOCK_LAYOUTS.length)];

        block = [];
        blockLayout.forEach(function(lot) {
          var blockTerrainCoordinates = [
            terrain.heightAtCoordinates(mapX + lot.left, mapZ + lot.top),
            terrain.heightAtCoordinates(mapX + lot.right, mapZ + lot.top),
            terrain.heightAtCoordinates(mapX + lot.left, mapZ + lot.bottom),
            terrain.heightAtCoordinates(mapX + lot.right, mapZ + lot.bottom),
          ];
          var minimumTerrainHeight = Math.min(...blockTerrainCoordinates);
          var maximumTerrainHeight = Math.max(...blockTerrainCoordinates);

          if ((maximumTerrainHeight - minimumTerrainHeight) < MAX_TERRAIN_STEEPNESS_FOR_BUILDING) {
            maxStories = calculateMaxBuildingStories(mapX, mapZ);
            actualStories = Math.max(1, Math.round(Math.random() * maxStories));

            block.push({
              left: lot.left,
              right: lot.right,
              top: lot.top,
              bottom: lot.bottom,
              yFloor: minimumTerrainHeight,
              ySurface: maximumTerrainHeight,
              stories: actualStories,
            });
          }
        });

        blocks[mapX][mapZ] = block;
      }
    }

    console.log(blocks);
    return blocks;
  };

  var calculateMaxBuildingStories = function(mapX, mapZ) {
    var squareRootOfMaxBuildingStories = Math.pow(MAX_BUILDING_STORIES, (1/12));

    var multiplierX = squareRootOfMaxBuildingStories * (1 - (Math.abs(mapX) / CityConfig.HALF_BLOCK_COLUMNS));
    var multiplierZ = squareRootOfMaxBuildingStories * (1 - (Math.abs(mapZ) / CityConfig.HALF_BLOCK_ROWS));
    var multiplier = Math.min(multiplierX, multiplierZ);

    return Math.max(1, Math.round(Math.pow(multiplier, 12)));
  };

  var blocks = generateUnitBlocks(terrain);

  var buildings = {};

  buildings.blockAtCoordinates = function(mapX, mapZ) {
    return blocks[mapX][mapZ];
  };

  return buildings;
};