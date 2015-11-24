"use strict";

//
//  Lights.js
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
 * @fileOverview Provides classes, interfaces, etc for manipulating lighting devices.
 *
 * @module Lights
 */

module.exports = {
  Light : require('./Light.js'),
  LightLevelChangeEvent : require('./LightLevelChangeEvent.js'),
  LightStateChangeEvent : require('./LightStateChangeEvent.js'),
  LedInterface : require('./LEDInterface.js'),
  DimmableLight : require('./DimmableLight.js'),
  DimmableLightBase : require('./DimmableLightBase.js'),
  DimmableLightComponent : require('./DimmableLightComponent.js'),
  LightBase : require('./LightBase.js'),
  LightComponent : require('./LightComponent.js'),
  LedBase : require('./LEDBase.js'),
  LedComponent : require('./LEDComponent.js')
};
