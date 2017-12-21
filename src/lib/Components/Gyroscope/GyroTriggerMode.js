"use strict";
//
//  GyroTriggerMode.js
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
 * Possible triggers for reading data from a gyroscope.
 * @enum {Number}
 */
const GyroTriggerMode = {
    /**
     * The read will not be triggered.
     * @type {Number}
     */
    ReadNotTriggered: 0,

    /**
     * Triggers the device read when requesting the angle.
     * @type {Number}
     */
    GetAngleTriggerRead: 1,

    /**
     * Triggers the device read when requesting the angular velocity.
     * @type {Number}
     */
    GetAngularVelocityTriggerRead: 2,

    /**
     * Triggers the device read when requesting the raw value.
     * @type {Number}
     */
    GetRawValueTriggerRead: 4
};

module.exports = GyroTriggerMode;