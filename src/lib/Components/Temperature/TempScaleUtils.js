"use strict";
//
//  TempScaleUtils.js
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
 * @fileOverview Temperature scale utilities.
 *
 * @module TempScaleUtils
 * @requires TemperatureScale
 */

var TemperatureScale = require('./TemperatureScale.js');

/**
 * Gets the name of the scale.
 * @param  {TemperatureScale} scale The scale to get the name of.
 * @return {String}        The name of the scale.
 */
var getScaleName = function(scale) {
  var name = "";
  switch (scale) {
    case TemperatureScale.Celcius:
      name = "Celcius";
      break;
    case TemperatureScale.Farenheit:
      name = "Farenheit";
      break;
    case TemperatureScale.Kelvin:
      name = "Kelvin";
      break;
    case TemperatureScale.Rankine:
      name = "Rankine";
      break;
    default:
      break;
  }
  return name;
};

/**
 * Gets the scale postfix.
 * @param  {TemperatureScale} scale [description]
 * @return {String}       The scale to get the postfix for.
 */
var getScalePostfix = function(scale) {
  return getScaleName(scale).charAt(0);
};

module.exports.getScaleName = getScaleName;
module.exports.getScalePostfix = getScalePostfix;
