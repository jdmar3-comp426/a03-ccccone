import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: avgMpgCal(mpg_data),
    allYearStats: allYearsCal(mpg_data),
    ratioHybrids: hybridsCal(mpg_data),
};

function avgMpgCal(mpg_data){
    let totalHighwayMpg = 0;
    let totalCityMpg = 0;
    for (let i = 0; i < mpg_data.length; i++) {
        totalHighwayMpg+=mpg_data[i].highway_mpg;
        totalCityMpg+=mpg_data[i].city_mpg;
    }
    let ret = {};
    ret.city = totalCityMpg/mpg_data.length;
    ret.highway = totalHighwayMpg/mpg_data.length;
    return ret;
}

function allYearsCal(mpg_data){
    let years = [];
    for (let i = 0; i < mpg_data.length; i++) {
        years.push(mpg_data[i].year);
    }
    return getStatistics(years);
}

function hybridsCal(mpg_data){
    let hybridCars = 0;
    for (let i = 0; i < mpg_data.length; i++) {
        if (mpg_data[i].hybrid) {
            hybridCars++;
        }
    }
    return hybridCars/mpg_data.length;
}


function makerHybridsCal(mpg_data){
    return mpg_data.reduce(function (acc, obj) {      
        if (obj.hybrid) {
            let make = obj.make;
            let hybrids = obj.id;
            let check = acc.filter(makeObj => {
                return makeObj.make === make
              });
            
            if (check.length == 0) {
                let newObj = {};
                newObj.make = make;
                newObj.hybrids = [];
                newObj.hybrids.push(hybrids);
                acc.push(newObj);
            } else {
                check[0].hybrids.push(hybrids);
            }
        }
        return acc;
    }, []) 
}

/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: makerHybridsCal(mpg_data),
    avgMpgByYearAndHybrid: avgMpgByYearAndHybridCal(mpg_data)
};


function avgMpgByYearAndHybridCal(mpg_data){
    let sum = mpg_data.reduce(function (acc, obj) {  
        let year = obj.year;    
        acc[year] = acc[year] || {};

        let isHybrid = obj.hybrid;
        let citympg = obj.city_mpg;
        let highwaympy = obj.highway_mpg;
        if (isHybrid) {
            acc[year].hybrid = acc[year].hybrid || {};
            acc[year].hybrid.city = acc[year].hybrid.city || [];
            acc[year].hybrid.highway = acc[year].hybrid.highway || [];
            acc[year].hybrid.city.push(citympg);
            acc[year].hybrid.highway.push(highwaympy);
        } else {
            acc[year].notHybrid = acc[year].notHybrid || {};
            acc[year].notHybrid.city = acc[year].notHybrid.city || [];
            acc[year].notHybrid.highway = acc[year].notHybrid.highway || [];
            acc[year].notHybrid.city.push(citympg);
            acc[year].notHybrid.highway.push(highwaympy);
        }

        return acc;
    }, {});


    for (const [key, value] of Object.entries(sum)) {
        if (value.hybrid) {
            if (value.hybrid.city) {
                value.hybrid.city = value.hybrid.city.reduce((a, b) => a + b, 0)/value.hybrid.city.length;
            }
            if (value.hybrid.highway) {
                value.hybrid.highway = value.hybrid.highway.reduce((a, b) => a + b, 0)/value.hybrid.highway.length;
            }
        }

        if (value.notHybrid) {
            if (value.notHybrid.city) {
                value.notHybrid.city = value.notHybrid.city.reduce((a, b) => a + b, 0)/value.notHybrid.city.length;
            }
            if (value.notHybrid.highway) {
                value.notHybrid.highway = value.notHybrid.highway.reduce((a, b) => a + b, 0)/value.notHybrid.highway.length;
            }
        }
    }
    let sumOrder = {
        'hybrid': null,
        'notHybrid': null,
    }

    ret = Object.assign(sumOrder, sum);
    return ret;
}