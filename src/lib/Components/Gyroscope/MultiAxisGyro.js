"use strict";
//
//  MultiAxisGyro.js
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
 * A multi-axis gyroscope device abstraction component interface.
 * @interface
 * @extends {Component}
 */
class MultiAxisGyro extends Component {
    /**
     * Initializes a new instance of the jsrpi.Components.Gyroscope.MultiAxisGyro interface.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * In a derived class, gets the time difference (delta) since the last loop.
     * @property {Number} timeDelta - The time delta.
     * @readonly
     */
    get timeDelta() { return 0; }

    /**
     * In a derived class, initializes the gyro.
     * @param {Gyro} triggeringAxis The gyro that represents the single axis
     * responsible for the triggering of updates.
     * @param {Number} trigMode The gyro update trigger mode. Use one of the
     * jsrpi.Components.Gyroscope.GyroTriggerMode values.
     * @returns {Gyro} a reference to the specified triggering axis, which
     * may or may not have been modified.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    init(triggeringAxis, trigMode) { return null; }

    /**
     * In a derived class, enables the gyro.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    enable() {}

    /**
     * In a derived class, disables the gyro.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    disable() {}

    /**
     * In a derived class, reads the gyro and stores the value internally.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    readGyro() {}

    /**
     * In a derived class, recalibrates the offset.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    recalibrateOffset() {}
}

module.exports = MultiAxisGyro;