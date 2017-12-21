"use strict";
//
//  Potentiometer.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2017 CyrusBuilt
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
 * A digital potentiometer device abstraction component interface.
 * @interface
 * @extends {Component}
 */
class Potentiometer extends Component {
    /**
     * Initializes a new instance of the jsrpi.Components.Potentiometers.Potentiometer
     * interface.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Gets the maximum wiper-value supported by the device.
     * @property {Number} maxValue - The max wiper value.
     * @readonly
     */
    get maxValue() { return 0; }

    /**
     * Gets whether the device is a potentiometer or a rheostat.
     * @property {Boolean} isRheostat - true if this instance is rheostat;
     * otherwise, false.
     * @readonly
     */
    get isRheostat() { return false; }

    /**
     * Gets or sets the wiper's current value.
     * @property {Number} currentValue - The current value. Values from 0 to
     * MaxValue are valid. Values above or below these boundaries should be
     * corrected quietly.
     */
    get currentValue() { return 0; }

    set currentValue(value) {}

    /**
     * Increases the wiper's value by the specified number of steps.
     * It is not an error if the wiper hits or already hit the upper
     * boundary. In such situations, the wiper sticks to the upper
     * boundary or doesn't change.
     * @param {Number} steps - How many steps to increase. If not specified
     * or zero then defaults to 1. If the current value is equal to the max
     * value, then nothing happens. If steps is less than zero, than an
     * exception is thrown.
     * @throws {IOException} if communication with the device failed.
     */
    increase(steps = 0) {}

    /**
     * Decreases the wiper's value by the specified number of
     * steps. It is not an error if the wiper hits or already
     * hit the lower boundary (0). In such situations, the
     * wiper sticks to the lower boundary or doesn't change.
     * @param {Number} steps - The number of steps to decrease by. If not
     * specified or zero, then defaults to 1.
     * @throws {IOException} if communication with the device failed.
     */
    decrease(steps = 0) {}
}

module.exports = Potentiometer;