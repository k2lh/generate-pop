var app = angular.module('app', ['ui.bootstrap']);

app.controller('Ctrl', ['$scope', '$http', 'randRound', 'randFloor', 'increasePer', 'decreasePer', function Ctrl($scope, $http, randRound, randFloor, increasePer, decreasePer) {

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    $scope.land = 150000;
    $scope.arable = 0;
    $scope.climate = 0;
    $scope.settled = 200;
    $scope.meat = 0;
    $scope.grain = 0;
    $scope.other = 0;
    $scope.famine = 0;
    $scope.plague = 0;
    $scope.exwar = 0;
    $scope.inwar = 0;
    $scope.strife = 0;
    $scope.capital = 0;
    $scope.economyList = 0;
    $scope.settlementList = 0;
    $scope.cityRoll = 0;
    var size = 0;
    var cityRoll = 0;
    var compareCity = 0;

    $scope.$watchCollection('[strife, acreToEat, land, smallRoll, arable, land, climateLimit, economyList, literacyRate, exwar, inwar]', function () {
        // take land & arable & determine acreage
        $scope.farmland = Math.round($scope.land * ($scope.arable / 100));
        $scope.sqAcres = Math.round($scope.farmland * 640);
        $scope.wilderness = Math.round($scope.land - $scope.farmland);
        $scope.wildernessPercent = ($scope.wilderness / $scope.land) * 100;
        // determine max # of people from available land
        $scope.limit = $scope.climateLimit / 10;
        $scope.maxPop = Math.floor($scope.sqAcres / $scope.acreToEat);
        // determine current population - negatives
        $scope.potPop = Math.round($scope.maxPop - ($scope.maxPop * ($scope.climateLimit / 10)));
        if ($scope.strife > 0 ) {
            $scope.actualPop = Math.round($scope.potPop - ($scope.potPop * ($scope.strife / 100)));
        } else {
            $scope.actualPop = $scope.potPop;
        }
        // figure out density per mi
        $scope.density = Math.floor($scope.actualPop / $scope.land);

        // set up largest city size
        var capitalBase = Math.floor(Math.sqrt($scope.actualPop));
        $scope.capital = (capitalBase * $scope.smallRoll);
        $scope.unit = {};
        $scope.unit[0] = {};
        $scope.unit[0].size = $scope.capital;
        $scope.unit[0].type = 'capital';

        var exwar = +$scope.exwar;
        var inwar = +$scope.inwar;
        // castles & forts
        var ageBase = Math.round(Math.sqrt($scope.settled));
        var popBase = Math.round($scope.potPop / 5000000);
        $scope.castleRuinBase = (ageBase * popBase);
        $scope.castleActiveBase = Math.round($scope.actualPop / 50000);

        $scope.castleRuin = decreasePer($scope.castleRuinBase, inwar, exwar);
        $scope.castleActive = increasePer($scope.castleActiveBase, inwar, exwar);

        var castleSplit = randRound(80, 70) ; //  % urban
        var castleA = +castleSplit + inwar - exwar;
        $scope.castleActiveUrban = Math.round($scope.castleActive * (castleA /100));
        $scope.castleActiveWild = $scope.castleActive - $scope.castleActiveUrban;

        var castleB = +castleSplit  - inwar + exwar;
        $scope.castleRuinUrban = Math.round($scope.castleRuin * (castleB /100));
        $scope.castleRuinWild = $scope.castleRuin - $scope.castleRuinUrban;

        if ($scope.capital > 0 ) {

            $scope.urbanHigh = +$scope.economyList.urbanHigh;
            $scope.urbanLow = +$scope.economyList.urbanLow;
            $scope.itenHigh = +$scope.economyList.itenHigh;
            $scope.itenLow = +$scope.economyList.itenLow;
            $scope.urban = randFloor($scope.urbanHigh, $scope.urbanLow);
            $scope.iten = randFloor($scope.itenHigh, $scope.itenLow);
            $scope.rural = (100 - $scope.urban - $scope.iten);
            $scope.urbanPop = Math.round($scope.actualPop * ($scope.urban * .01));
            $scope.itenPop = Math.round($scope.actualPop * ($scope.iten * .01));
            $scope.ruralPop = ($scope.actualPop - $scope.itenPop - $scope.urbanPop);

            if ($scope.literacyRate > 70) {
                $scope.school = Math.round($scope.actualPop / 12000000);
            } else if ($scope.literacyRate < 20 ) {
                $scope.school = Math.round($scope.actualPop / 27000000);
            } else {
                $scope.school = Math.round($scope.actualPop / 18000000);
            }
            $scope.university = {};
            for(var i = 0; i < $scope.school; i ++) {
            var schoolRoll = randFloor(12, 1);
            $scope.university[i] = {};
                if (schoolRoll < 9 ) {
                    $scope.university[i].descrip = 'Bachelors: liberal arts';
                } else if (schoolRoll == 12 ) {
                    $scope.university[i].descrip = 'Masters: law, medicine, theology';
                } else {
                    $scope.university[i].descrip = 'Doctorate: specialized studies';
                }
            }

            // 2nd largest city
            $scope.cityRollA = randFloor($scope.economyList.rollHigh,  $scope.economyList.rollLow);
            size = Math.floor($scope.capital * ($scope.cityRollA / 100));
            var compareCity = size;
            $scope.urbanTotal = size + $scope.capital;
            $scope.unit[1] = {};
            $scope.unit[1].size = size;
            $scope.unit[1].type = 'trade center';

        $scope.bigCityLarge = 0;
        $scope.bigCityMed = 0;
        $scope.bigCitySmall = 0;
        $scope.cityLarge = 0;
        $scope.cityMed = 0;
        $scope.citySmall = 0;

        for(var i = 2; i < 50; i ++) {
            if ($scope.economyList.type < 2 ) {
                var cityRollB = randFloor(80, 60);
            } else if ($scope.economyList.type > 2 ) {
                var cityRollB = randFloor(99, 89);
            } else {
                var cityRollB = randFloor(90, 75);
            }
            size = Math.floor(compareCity * (cityRollB / 100));
            compareCity = size;

            if (size > 100000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'trade center';
                $scope.trade += 1;
                $scope.urbanTotal += size;
            } else if (size > 80000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'bigCityLarge';
                $scope.bigCityLarge += 1;
                $scope.urbanTotal += size;
            } else if (size > 60000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'bigCityMed';
                $scope.bigCityMed += 1;
                $scope.urbanTotal += size;
            } else if (size > 40000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'bigCitySmall';
                $scope.bigCitySmall += 1;
                $scope.urbanTotal += size;
            } else if (size > 20000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'cityLarge';
                $scope.cityLarge += 1;
                $scope.urbanTotal += size;
            } else if (size > 10000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'cityMed';
                $scope.cityMed += 1;
                $scope.urbanTotal += size;
            } else if (size > 5000) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'citySmall';
                $scope.citySmall += 1;
                $scope.urbanTotal += size;
            } else if ( size > 1000 ) {
                $scope.unit[i] = {};
                $scope.unit[i].size = size;
                $scope.unit[i].type = 'town';
                $scope.towns += 1;
                $scope.urbanTotal += size;
            } else {
                break;
            }
        }

            var urbanRem = $scope.urbanPop - $scope.urbanTotal;
            if (urbanRem > 0 ) {
                if ($scope.economyList.type < 2 ) {
                    $scope.villages = Math.round(urbanRem / 500);
                } else if ($scope.economyList.type > 2 ) {
                    var townRem = Math.round(urbanRem * .66);
                    var townsAdd = Math.round(townRem / 1000);
                    $scope.towns = $scope.towns + townsAdd;
                    $scope.villages = Math.round((urbanRem - townRem) / 300);
                } else {
                    var townRem = Math.round(urbanRem * .33);
                    var townsAdd = Math.round(townRem / 1000);
                    $scope.towns = $scope.towns + townsAdd;
                    $scope.villages = Math.round((urbanRem - townRem) / 300);
                }
            }

        }
    }, true);

    $scope.$watchCollection('[famine, plague, exwar, inwar]', function () {
        var famine = +$scope.famine;
        var plague = +$scope.plague;
        var exwar = +$scope.exwar;
        var inwar = +$scope.inwar;
        $scope.strife = famine + plague + exwar + inwar;
    }, true);


/*
    castleRuin - internalWar
    castleActive + internalWar
    75% urban + internalWar - externalWar
    25% border + externalWar - internalWar



        $scope.castleRuinTot = $scope.castleRuinSub + ($scope.castleRuinSub * (($scope.exwar + $scope.inwar) / 10));
        $scope.castleWild1 = randRound(90, 60);
        $scope.castleRuinWild = ($scope.castleRuinTot * ($scope.castleWild1 / 100));
        $scope.castleRuinUrban = $scope.castleRuinTot - $scope.castleRuinWild;

        $scope.castleUrban1 = randRound(90, 60);
        $scope.castleUseUrban = ($scope.castleUse * ($scope.castleUrban1 / 100));
        $scope.castleUseWild = $scope.castleUse - $scope.castleUseUrban;
*/


    $scope.randomFamine = function() {
        $scope.famine = randFloor(20, 0);
    };

    $scope.randomPlague = function() {
        $scope.plague = randFloor(20, 0);
    };

    $scope.randomExwar = function() {
        $scope.exwar = randFloor(20, 0);
    };

    $scope.randomInwar = function() {
        $scope.inwar = randFloor(20, 0);
    };

    $scope.randomLand = function () {
        $scope.land = randFloor(200000, 500);
    };

    $scope.selectClimate = function () {
        var climate = $scope.climateList;
        $scope.climateLimit = climate.adjust;
        $scope.arable = randFloor(climate.amount, 1);
    };

    $scope.updateDiet = function () {
        var meat = +$scope.meat;
        var grain = +$scope.grain;
        var other = +$scope.other;
        $scope.acreToEat = ((grain + meat) * other) * 2;
    };

    $scope.updateEconomy = function () {
        var t = +$scope.economyList.reduce;
        $scope.smallRoll = 1;
        for(var i = 0; i < 2; i ++) {
            $scope.roll = randFloor(4, 1);
            $scope.smallRoll += $scope.roll;
        }
        $scope.smallRoll += t;
        $scope.metro = 0;
        $scope.cities = 0;
        $scope.towns = 0;
        $scope.villages = 0;
    };

    $scope.updateSettlements = function () {
        var settlements = $scope.settlementList;
        $scope.settlementsV = randRound(settlements.villageHigh,  settlements.villageLow);
        $scope.settlementsT = randRound(settlements.townHigh,  settlements.townLow);
        $scope.settlementsC = randRound(settlements.cityHigh, settlements.cityLow);
        $scope.settlementsM = randRound(settlements.metroHigh, settlements.metroLow);
    };

    $scope.updateLiteracy = function () {
        var valueHigh = +$scope.literacyList.valueHigh;
        var valueLow = +$scope.literacyList.valueLow;
        $scope.literacyRate = randRound(valueHigh, valueLow);
    };


    $scope.rollDice = function () {
        $scope.totalRoll = 0;
        for(var i = 0; i < 6; i ++) {
            $scope.roll = randFloor(4, 1);
            $scope.totalRoll += $scope.roll;
        }
    };

    $http.get('json/countryTable.json').success(function(data) {
        $scope.country = data;
    });

    $http.get('json/climateTable.json').success(function(data) {
        $scope.climateTable = data;
    });

    $http.get('json/cityTable.json').success(function(data) {
        $scope.city = data;
    });
/*
    $http.get('json/listOne.json').success(function(data) {
        $scope.listOne = data;
    });

    $http.get('json/listTwo.json').success(function(data) {
        $scope.listTwo = data;
    });
*/
    $scope.climates = [
        {
            descrip : 'Rainforest: humid & wet year-round',
            amount : 15,
            adjust : 3.5
        }, {
            descrip : 'Savanna: short dry mild winter, hot wet summer',
            amount : 50,
            adjust : 2
        }, {
            descrip : 'Desert: hot & dry year-round',
            amount : 5,
            adjust : 5
        }, {
            descrip : 'Steppe: long cold winter, warm summer, little rain',
            amount : 10,
            adjust : 4
        }, {
            descrip : 'Chapparal: wet mild winter, very dry summer',
            amount : 25,
            adjust : 3
        }, {
            descrip : 'Grasslands: cold winter, hot summer, some rain',
            amount : 30,
            adjust : 2.5
        }, {
            descrip : 'Deciduous: cold winter, hot summer, plenty of rain',
            amount : 60,
            adjust : 1.5
        }, {
            descrip : 'Taiga: long cold winter, short cool summer, humid',
            amount : 15,
            adjust : 3.5
        }, {
            descrip : 'Tundra: long cold winter, short cool summer, dry',
            amount : 5,
            adjust : 5
        }
    ];


    $scope.economy = [
        {
            type : 1,
            name : 'medieval, agrarian',
            reduce : 2,
            urbanHigh : 5,
            urbanLow : 1,
            itenHigh : 5,
            itenLow : 1,
            rollHigh : 80,
            rollLow : 20
        },{
            type : 2,
            name : 'agrarian-mercantile transition',
            reduce : 13,
            urbanHigh : 15,
            urbanLow : 5,
            itenHigh : 7,
            itenLow : 2,
            rollHigh : 90,
            rollLow : 60
        },{
            type : 3,
            name : 'renaissance, mercantile',
            reduce : 25,
            urbanHigh : 20,
            urbanLow : 15,
            itenHigh : 10,
            itenLow : 3,
            rollHigh : 99,
            rollLow : 80
        }
    ];

    $scope.settlements = [
        {
            type : 1,
            name : 'compressed/frontier, walled',
            villageLow : 30,
            villageHigh : 50,
            townLow : 35,
            townHigh : 60,
            cityLow : 50,
            cityHigh : 80,
            metroLow : 70,
            metroHigh : 90,
            villageBldgLow : 25,
            villageBldgHigh : 35,
            townBldgLow : 40,
            townBldgHigh : 60,
            cityBldgLow : 65,
            cityBldgHigh : 90,
            metroBldgLow : 100,
            metroBldgHigh : 140
        },{
            type : 2,
            name : 'distributed, ie town expanded beyond walls',
            villageLow : 20,
            villageHigh : 35,
            townLow : 25,
            townHigh : 45,
            cityLow : 30,
            cityHigh : 55,
            metroLow : 45,
            metroHigh : 70,
            villageBldgLow : 15,
            villageBldgHigh : 25,
            townBldgLow : 30,
            townBldgHigh : 45,
            cityBldgLow : 50,
            cityBldgHigh : 70,
            metroBldgLow : 80,
            metroBldgHigh : 100
        },{
            type : 3,
            name : 'established/planned OR unwalled',
            villageLow : 10,
            villageHigh : 20,
            townLow : 15,
            townHigh : 30,
            cityLow : 20,
            cityHigh : 40,
            metroLow : 20,
            metroHigh : 50,
            villageBldgLow : 10,
            villageBldgHigh : 20,
            townBldgLow : 20,
            townBldgHigh : 30,
            cityBldgLow : 30,
            cityBldgHigh : 50,
            metroBldgLow : 40,
            metroBldgHigh : 70
        }
    ];

    $scope.literacy = [
        {
            name : 'rare: clergy & uppermost elites only',
            valueHigh : 5,
            valueLow : 1
        },{
            name : 'limited: clergy, all elites',
            valueHigh : 10,
            valueLow : 5
        },{
            name : 'moderate: clergy, elites, tradespeople',
            valueHigh : 35,
            valueLow : 10
        },{
            name : 'widespread: majority can read, many can write',
            valueHigh : 75,
            valueLow : 35
        },{
            name : 'near-universal: everyone can read AND write',
            valueHigh : 99,
            valueLow : 75
        }
    ];

}]);

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item , key) {
            item["key"] = key;
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            if(a[field] > b[field]) return 1;
            if(a[field] < b[field]) return -1;
            return 0;
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

app.factory('randRound',  function() {
    return  function(x,y) {
        return Math.round(Math.random()* (x - y) + y);
    };
});

app.factory('randFloor',  function() {
    return  function(x,y) {
        return Math.floor(Math.random()* (x - y) + y);
    };
});

app.factory('increasePer',  function() {
    return  function(x,y,z) {
        return Math.round(x + (x * ((y+z) / 100)));
    };
});

app.factory('decreasePer',  function() {
    return  function(x,y,z) {
        return Math.round(x - (x * ((y+z) / 100)));
    };
});

