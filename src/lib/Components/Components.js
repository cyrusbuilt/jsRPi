"use strict";
//
//  Components.js
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
 * @fileOverview Contains classes, interfaces, etc for device abstraction
 * components.
 *
 * @module Components
 */

module.exports = {
  'component' : require('./Component.js'),
  'componentBase' : require('./ComponentBase.js'),
  'buttons' : require('./Button/Buttons.js'),
  'buzzers' : require('./Buzzers/Buzzers.js'),
  'lcdDisplay' : require('./LcdDisplay/LcdDisplay.js'),
  'lights' : require('./Lights/Lights.js'),
  'motors' : require('./Motors/Motors.js'),
  'power' : require('./Power/Power.js'),
  'relays' : require('./Relays/Relays.js'),
  'sensors' : require('./Sensors/Sensors.js'),
  'switches' : require('./Switches/Switches.js'),
  'temperature' : require('./Temperature/Temperature.js')
};
