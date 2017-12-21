"use strict";
//
//  Gyro.js
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

const Component = require('../Component.js');

/**
 * A single-axis gyroscope device abstraction component interface.
 * @interface
 * @extends {Component}
 */
class Gyro extends Component {
    /**
     * Initializes a new instance of the jsrpi.Components.Gyroscope.Gyro interface.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * In a derived class, gets the angular velocity.
     * @property {Number} angularVelocity - The angular velocity.
     * @readonly
     */
    get angularVelocity() { return 0; }

    /**
     * In a derived class, gets or sets the raw value.
     * @property {Number} rawValue - The raw value.
     * @throws {IOException} if an error occurs while reading from the Gyro.
     */
    get rawValue() { return 0; }
    set rawValue(value) {}

    /**
     * In a derived class, gets or sets the offset value, which is the value the gyro outputs when
     * not rotating.
     * @property {Number} offset - The offset.
     */
    get offset() { return 0; }
    set offset(value) {}

    /**
     * In a derived class, gets or sets the gyro angle (angular position).
     * @property {Number} angle - The angle.
     * @throws {IOException} if an error occurs while reading from the gyro.
     */
    get angle() { return 0; }
    set angle(value) {}

    /**
     * Recalibrates the offset.
     */
    recalibrateOffset() {}

    /**
     * In a derived class, sets the read trigger.
     * @param {Number} trig - The trigger mode to re-read the gyro value. Use
     * one of the jsrpi.Components.Gyroscope.GyroTriggerMode values.
     */
    setReadTrigger(trig) {}
}

module.exports = Gyro;