"use strict";
//
//  PiFaceDevice.js
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

var inherits = require('util').inherits;
var PiFaceBase = require('./PiFaceBase.js');

/**
 * @classdesc PiFace device abstraction.
 * @param {Number} spiSpeed     The clock speed to set the bus to. Can be powers
 * of 2 (500KHz minimum up to 32MHz maximum). If not specified, the default of
 * SPI_SPEED (1MHz) will be used.]
 * @throws {IOException} if unable to read or write to the SPI bus.
 * @constructor
 * @extends {PiFaceBase}
 */
function PiFaceDevice(spiSpeed) {
  PiFaceBase.call(this, spiSpeed);
}

PiFaceDevice.prototype.constructor = PiFaceDevice;
inherits(PiFaceDevice, PiFaceBase);

module.exports = PiFaceDevice;
