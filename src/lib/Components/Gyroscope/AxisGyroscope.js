"use strict";
//
//  AxisGyroscope.js
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

const ArgumentNullException = require('../../ArgumentNullException.js');
const ComponentBase = require('../ComponentBase.js');
const Gyro = require('./Gyro.js');
const GyroTriggerMode = require('./GyroTriggerMode.js');
const IllegalArgumentException = require('../../IllegalArgumentException.js');
const MultiAxisGyro = require('./MultiAxisGyro.js');

/**
 * @classdesc A generic gyroscope device abstraction component.
 * @implements {Gyro}
 * @extends {ComponentBase}
 */
class AxisGyroscope extends Gyro {
    /**
     * Initializes a new instance of the jsrpi.Components.Gyroscope.AxisGyroscope
     * class with the multi-axis gyro to read from.
     * @param {MultiAxisGryo} multiAxisGyro The multi-axis gyro to read from.
     * @param {Number} degPerSecondFactor The degrees-per-second factor value.
     * @constructor
     */
    constructor(multiAxisGyro, degPerSecondFactor = 0) {
        super();

        if (!multiAxisGyro) {
            throw new ArgumentNullException("multiAxisGyro");
        }

        if (!(multiAxisGyro instanceof MultiAxisGyro)) {
            throw new IllegalArgumentException("multiAxisGyro param must be an instance of jsrpi.Components.Gyroscope.MultiAxisGyro.");
        }

        this._base = new ComponentBase();
        this._multiAxisGyro = multiAxisGyro;
        this._trigger = GyroTriggerMode.ReadNotTriggered;
        this._value = 0;
        this._offset = 0;
        this._angle = 0;
        this._degPerSecondFactor = 0;
        this._factorSet = false;

        if (degPerSecondFactor) {
            if (!isNaN(degPerSecondFactor)) {
                this._degPerSecondFactor = degPerSecondFactor;
                this._factorSet = true;
            }
        }
    }

    /**
     * Gets or sets the name of this component.
     * @property {String} componentName - The component name.
     * @override
     */
    get componentName() {
        return this._base.componentName;
    }

    set componentName(name) {
        this._base.componentName = name;
    }

    /**
     * Gets or sets the object this component is tagged with (if set).
     * @property {Object} tag - The tag.
     * @override
     */
    get tag() {
        return this._base.tag;
    }

    set tag(t) {
        this._base.tag = t;
    }

    /**
     * Determines whether or not the current instance has been disposed.
     * @property {Boolean} isDisposed - true if disposed; Otherwise, false.
     * @readonly
     * @override
     */
    get isDisposed() {
        return this._base.isDisposed;
    }

    /**
     * Gets the custom property collection.
     * @property {Array} propertyCollection - The property collection.
     * @readonly
     * @override
     */
    get propertyCollection() {
        return this._base.propertyCollection;
    }

    /**
     * Checks to see if the property collection contains the specified key.
     * @param  {String} key The key name of the property to check for.
     * @return {Boolean}    true if the property collection contains the key;
     * Otherwise, false.
     * @override
     */
    hasProperty(key) {
        return this._base.hasProperty(key);
    }

    /**
     * Sets the value of the specified property. If the property does not already exist
     * in the property collection, it will be added.
     * @param  {String} key   The property name (key).
     * @param  {String} value The value to assign to the property.
     * @override
     */
    setProperty(key, value) {
        this._base.setProperty(key, value);
    }

    /**
     * Returns the string representation of this object. In this case, it simply
     * returns the component name.
     * @return {String} The name of this component.
     * @override
     */
    toString() {
        return this.componentName;
    }

    /**
     * Releases all resources used by the AxisGyroscope object.
     * @override
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }

        if (this._multiAxisGyro) {
            this._multiAxisGyro.dispose();
            this._multiAxisGyro = undefined;
        }

        this._trigger = GyroTriggerMode.ReadNotTriggered;
        this._value = 0;
        this._offset = 0;
        this._angle = 0;
        this._degPerSecondFactor = 0;
        this._factorSet = false;
        this._base.dispose();
    }

    /**
     * Reads and updates the angle.
     * @returns {number} The angular velocity of the gyro.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to read from the gyro.
     */
    readAndUpdateAngle() {
        this._multiAxisGyro.readGyro();
        let angularVelocity = (((this._value - this._offset) / 40) * 40);
        if (this._factorSet) {
            angularVelocity /= this._degPerSecondFactor;
        }

        this._angle = (this._angle + angularVelocity * this._multiAxisGyro.timeDelta / 1000);
        return angularVelocity;
    }

    /**
     * Gets or sets the raw value.
     * @property {Number} rawValue - The raw value.
     * @throws {IOException} if an error occurs while reading from the Gyro.
     * @override
     */
    get rawValue() {
        if (this._trigger === GyroTriggerMode.GetRawValueTriggerRead) {
            this.readAndUpdateAngle();
        }

        return this._value;
    }

    set rawValue(value) {
        this._value = value || 0;
    }

    /**
     * Gets or sets the offset value, which is the value the gyro outputs when
     * not rotating.
     * @property {Number} offset - The offset.
     * @override
     */
    get offset() {
        return this._offset;
    }

    set offset(value) {
        this._offset = value || 0;
    }

    /**
     * Gets or sets the gyro angle (angular position).
     * @property {Number} angle - The angle.
     * @throws {IOException} if an error occurs while reading from the gyro.
     * @override
     */
    get angle() {
        if (this._trigger === GyroTriggerMode.GetAngleTriggerRead) {
            this.readAndUpdateAngle();
        }

        return this._angle;
    }

    set angle(value) {
        this._angle = value || 0;
    }

    /**
     * Gets the angular velocity.
     * @property {Number} angularVelocity - The angular velocity.
     * @readonly
     * @override
     */
    get angularVelocity() {
        if (this._trigger === GyroTriggerMode.GetAngularVelocityTriggerRead) {
            return this.readAndUpdateAngle();
        }

        let adjusted = (this._angle - this._offset);
        if (this._factorSet) {
            return (adjusted / this._degPerSecondFactor);
        }

        return adjusted;
    }

    /**
     * Sets the read trigger.
     * @param {Number} trig - The trigger mode to re-read the gyro value. Use
     * one of the jsrpi.Components.Gyroscope.GyroTriggerMode values.
     * @override
     */
    setReadTrigger(trig) {
        this._trigger = trig || GyroTriggerMode.ReadNotTriggered;
    }

    /**
     * Recalibrates the offset.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    recalibrateOffset() {
        this._multiAxisGyro.recalibrateOffset();
    }
}

module.exports = AxisGyroscope;