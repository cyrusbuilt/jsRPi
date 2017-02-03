"use strict";
//
//  TemperatureConversion.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2015 CyrusBuilt
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

/**
 * @fileOverview Temperature conversion utilities.
 *
 * @module TemperatureConversion
 * @requires TemperatureScale
 */

const TemperatureScale = require('./TemperatureScale.js');

/**
 * Absolute zero temperature in Celcius scale.
 * @type {Number}
 * @const
 */
const ABSOLUTE_ZERO_CELCIUS = -273.15;

/**
 * Absolute zero temperature in Farenheit scale.
 * @type {Number}
 * @const
 */
const ABSOLUTE_ZERO_FARENHEIT = -459.67;

/**
 * Absolute zero temperature in Kelvin scale.
 * @type {Number}
 * @const
 */
const ABSOLUTE_ZERO_KELVIN = 0;

/**
 * Absolute zero temperature in Rankine scale.
 * @type {Number}
 * @const
 */
const ABSOLUTE_ZERO_RANKINE = 0;

/**
 * Converts the temperature from Rankine to Kelvin scale.
 * Formula = [K] = [R] x 5/9.
 * @param  {Number} temp The temperature in degrees Rankine.
 * @return {Number}      The temperature value in degrees Kelvin.
 */
const convertRankineToKelvin = function(temp) {
  return ((temp * 5) / 9);
};

/**
 * Converts the temperature from Rankine to Celcius scale.
 * Formula = [C] = ([R] - 491.67) x 5/9.
 * @param  {Number} temp The temperature in degrees Rankine.
 * @return {Number}      The temperature in degrees Celcius.
 */
const convertRankineToCelcius = function(temp) {
  return (((temp - 491.67) * 5) / 9);
};

/**
 * Converts the temperature from Rankine to Farenheit scale.
 * Formula = [F] = [R] - 459.67.
 * @param  {Number} temp The temperature in degrees Rankine.
 * @return {Number}      The temperature value in degrees Farenheit.
 */
const convertRankineToFarenheit = function(temp) {
  return (temp - 459.67);
};

/**
 * Converts the temperature from Kelvin to Rankine scale.
 * Formula = [R] = [K] x 9/5.
 * @param  {Number} temp The temperature in degrees Kelvin.
 * @return {Number}      The temperature value in degrees Rankine.
 */
const convertKelvinToRankine = function(temp) {
  return ((temp * 9) / 5);
};

/**
 * Converts the temperature from Kelvin to Farenheit scale.
 * Formula = [F] = [K] x 9/5 - 459.67.
 * @param  {Number} temp The temperature in degrees Kelvin.
 * @return {Number}      The temperature value in degrees Farenheit.
 */
const convertKelvinToFarenheit = function(temp) {
  return (((temp * 9) / 5) - 459.67);
};

/**
 * Converts the temperature from Kelvin to Celcius scale.
 * Formula = [C] = [K] - 273.15.
 * @param  {Number} temp The temperature in degress Kelvin.
 * @return {Number}      The temperature value in degrees Celcius.
 */
const convertKelvinToCelcius = function(temp) {
  return (temp + ABSOLUTE_ZERO_CELCIUS);
};

/**
 * Converts the temperature from Celcius to Rankine scale.
 * Formula = [R] = ([C] + 273.15) x 9/5.
 * @param  {Number} temp The temperature in degrees Celcius.
 * @return {Number}      The temperature value in degrees Rankine.
 */
const convertCelciusToRankine = function(temp) {
  return (((temp - ABSOLUTE_ZERO_CELCIUS) * 9) / 5);
};

/**
 * Converts the temperature from Celcius to Kelvin scale.
 * Formula = [K] = [C] + 273.15.
 * @param  {Number} temp The temperature in degrees Celcius.
 * @return {Number}      The temperature value in degrees Kelvin.
 */
const convertCelciusToKelvin = function(temp) {
  return (temp - ABSOLUTE_ZERO_CELCIUS);
};

/**
 * Converts the temperature from Celcius to Farenheit scale.
 * Formula = [F] = [C] x 9/5 + 32.
 * @param  {Number} temp The temperature in degrees Celcius.
 * @return {Number}      The temperature value in degrees Farenheit.
 */
const convertCelciusToFarenheit = function(temp) {
  return (((temp * 9) / 5) + 32);
};

/**
 * Converts the temperature from Farenheit to Rankine scale.
 * Formula = [R] = [F] + 459.67.
 * @param  {Number} temp The temperature in degrees Farenheit.
 * @return {Number}      The temperature value in degrees Rankine.
 */
const convertFarenheitToRankine = function(temp) {
  return (temp + 459.67);
};

/**
 * Converts the temperature from Farenheit to Kelvin scale.
 * Formula = [K] = ([F] + 459.67) x 5/9.
 * @param  {Number} temp The temperature in degrees Farenheit.
 * @return {Number}      The temperature value in degrees Kelvin.
 */
const convertFarenheitToKelvin = function(temp) {
  return (((temp + 459.67) * 5) / 9);
};

/**
 * Converts the temperature from Farenheit to Celcius scale.
 * Formula = [C] = ([F] - 32) x 5/9.
 * @param  {Number} temp The temperature in degrees Farenheit.
 * @return {Number}      The temperature value in degrees Celcius.
 */
const convertFarenheitToCelcius = function(temp) {
  return ((temp - 32) * 5 / 9);
};

/**
 * Converts the specified temperature value to Rankine scale.
 * @param  {TemperatureScale} scale The temperature scale to convert from.
 * @param  {Number} temp  The temperature value to convert to Rankine scale.
 * @return {Number}       The temperature value in degrees Rankine.
 */
const convertToRankine = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertFarenheitToRankine(temp);
      break;
    case TemperatureScale.Celcius:
      val = convertCelciusToRankine(temp);
      break;
    case TemperatureScale.Kelvin:
      val = convertKelvinToRankine(temp);
      break;
    case TemperatureScale.Rankine:
      val = temp;
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature in Rankine to the specified scale.
 * @param  {TemperatureScale} scale The scale to convert the specified Rankine
 * value to.
 * @param  {Number} temp  The temperature value in degrees Rankine.
 * @return {Number}       The temperature value in the specified scale.
 */
const convertFromRankine = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertRankineToFarenheit(temp);
      break;
    case TemperatureScale.Celcius:
      val = convertRankineToCelcius(temp);
      break;
    case TemperatureScale.Kelvin:
      val = convertRankineToKelvin(temp);
      break;
    case TemperatureScale.Rankine:
      val = temp;
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified value from the specified scale to degrees Kelvin.
 * @param  {TemperatureScale} scale The temperature scale to convert the value
 * from.
 * @param  {Number} temp  The temperature value to convert.
 * @return {Number}       The temperature in degrees Kelvin.
 */
const convertToKelvin = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertFarenheitToKelvin(temp);
      break;
    case TemperatureScale.Celcius:
      val = convertCelciusToKelvin(temp);
      break;
    case TemperatureScale.Kelvin:
      val = temp;
      break;
    case TemperatureScale.Rankine:
      val = convertRankineToKelvin(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature from Kelvin to the specified scale.
 * @param  {TemperatureScale} scale The scale to convert to.
 * @param  {Number} temp  The temperature in degrees Kelvin.
 * @return {Number}       The temperature value in the specified scale.
 */
const convertFromKelvin = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertKelvinToFarenheit(temp);
      break;
    case TemperatureScale.Celcius:
      val = convertKelvinToCelcius(temp);
      break;
    case TemperatureScale.Kelvin:
      val = temp;
      break;
    case TemperatureScale.Rankine:
      val = convertKelvinToRankine(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature to the specified Celcius scale.
 * @param  {TemperatureScale} scale The scale to convert to Celcius.
 * @param  {Number} temp  The temperature value.
 * @return {Number}       The temperature value in degrees Celcius.
 */
const convertToCelcius = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertFarenheitToCelcius(temp);
      break;
    case TemperatureScale.Celcius:
      val = temp;
      break;
    case TemperatureScale.Kelvin:
      val = convertKelvinToCelcius(temp);
      break;
    case TemperatureScale.Rankine:
      val = convertRankineToCelcius(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature value in degrees Celcius to the specified
 * scale.
 * @param  {TemperatureScale} scale The scale to convert the temperature value to.
 * @param  {Number} temp  The temperature in degrees Celcius.
 * @return {Number}       The temperature value in the specified scale.
 */
const convertFromCelcius = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = convertCelciusToFarenheit(temp);
      break;
    case TemperatureScale.Celcius:
      val = temp;
      break;
    case TemperatureScale.Kelvin:
      val = convertCelciusToKelvin(temp);
      break;
    case TemperatureScale.Rankine:
      val = convertCelciusToRankine(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature value to Farenheit scale.
 * @param  {TemperatureScale} scale The scale to convert the temperature from.
 * @param  {Number} temp  The temperature value in the specified scale.
 * @return {Number}       The temperature in degrees Farenheit.
 */
const convertToFarenheit = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = temp;
      break;
    case TemperatureScale.Celcius:
      val = convertCelciusToFarenheit(temp);
      break;
    case TemperatureScale.Kelvin:
      val = convertKelvinToFarenheit(temp);
      break;
    case TemperatureScale.Rankine:
      val = convertRankineToFarenheit(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Convert the temperature in degrees Farenheit to the specified scale.
 * @param  {TemperatureScale} scale The scale to convert to.
 * @param  {Number} temp  The temperature in degrees Farenheit.
 * @return {Number}       The temperature value in the specified scale.
 */
const convertFromFarenheit = function(scale, temp) {
  let val = 0;
  switch (scale) {
    case TemperatureScale.Farenheit:
      val = temp;
      break;
    case TemperatureScale.Celcius:
      val = convertFarenheitToCelcius(temp);
      break;
    case TemperatureScale.Kelvin:
      val = convertFarenheitToKelvin(temp);
      break;
    case TemperatureScale.Rankine:
      val = convertFarenheitToRankine(temp);
      break;
    default:
      break;
  }
  return val;
};

/**
 * Converts the specified temperature from one scale to another.
 * @param  {TemperatureScale} fromScale The scale to convert the temperature from.
 * @param  {TemperatureScale} toScale   The scale to convert the temperature to.
 * @param  {Number} temp      The temperature value to convert.
 * @return {Number}           The temperature in the degress matching the 'to'
 * scale.
 */
const convert = function(fromScale, toScale, temp) {
  let val = 0;
  switch (fromScale) {
    case TemperatureScale.Farenheit:
      val = convertFromFarenheit(toScale, temp);
      break;
    case TemperatureScale.Celcius:
      val = convertFromCelcius(toScale, temp);
      break;
    case TemperatureScale.Kelvin:
      val = convertFromKelvin(toScale, temp);
      break;
    case TemperatureScale.Rankine:
      val = convertFromRankine(toScale, temp);
      break;
    default:
      break;
  }
  return val;
};

module.exports.ABSOLUTE_ZERO_CELCIUS = ABSOLUTE_ZERO_CELCIUS;
module.exports.ABSOLUTE_ZERO_FARENHEIT = ABSOLUTE_ZERO_FARENHEIT;
module.exports.ABSOLUTE_ZERO_KELVIN = ABSOLUTE_ZERO_KELVIN;
module.exports.ABSOLUTE_ZERO_RANKINE = ABSOLUTE_ZERO_RANKINE;
module.exports.convertRankineToKelvin = convertRankineToKelvin;
module.exports.convertRankineToCelcius = convertRankineToCelcius;
module.exports.convertRankineToFarenheit = convertRankineToFarenheit;
module.exports.convertKelvinToRankine = convertKelvinToRankine;
module.exports.convertKelvinToFarenheit = convertKelvinToFarenheit;
module.exports.convertKelvinToCelcius = convertKelvinToCelcius;
module.exports.convertCelciusToRankine = convertCelciusToRankine;
module.exports.convertCelciusToKelvin = convertCelciusToKelvin;
module.exports.convertCelciusToFarenheit = convertCelciusToFarenheit;
module.exports.convertFarenheitToRankine = convertFarenheitToRankine;
module.exports.convertFarenheitToKelvin = convertFarenheitToKelvin;
module.exports.convertFarenheitToCelcius = convertFarenheitToCelcius;
module.exports.convertToRankine = convertToRankine;
module.exports.convertFromRankine = convertFromRankine;
module.exports.convertToKelvin = convertToKelvin;
module.exports.convertFromKelvin = convertFromKelvin;
module.exports.convertToCelcius = convertToCelcius;
module.exports.convertFromCelcius = convertFromCelcius;
module.exports.convertToFarenheit = convertToFarenheit;
module.exports.convertFromFarenheit = convertFromFarenheit;
module.exports.convert = convert;
