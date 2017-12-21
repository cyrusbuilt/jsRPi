"use strict";
//
//  HMC5883L.js
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

const ArgumentNullException = require('../../../ArgumentNullException.js');
const AxisGyroscope = require('../AxisGyroscope.js');
const BoardRevision = require('../../../BoardRevision.js');
const ComponentBase = require('../../ComponentBase.js');
const CoreUtils = require('../../../PiSystem/CoreUtils.js');
const GyroTriggerMode = require('../GyroTriggerMode.js');
const HMC5883LOutputRate = require('./HMC5883LOutputRate.js');
const HMC5883LGains = require('./HMC5883LGains.js');
const I2CBus = require('../../../IO/I2C/I2CBus.js');
const IOException = require('../../../IO/IOException.js');
const MeasurementModes = require('./MeasurementModes.js');
const MultiAxisGyro = require('../MultiAxisGyro.js');
const ObjectDisposedException = require('../../../ObjectDisposedException.js');
const OperationMode = require('./OperationMode.js');
const Samples = require('./Samples.js');
const SystemInfo = require('../../../PiSystem/SystemInfo.js');

const CALIBRATION_READS = 50;
const CALIBRATION_SKIPS = 5;
const HMC5883L_ADDR = 0x1E;

/**
 * Represents a device abstraction component for a Honeywell HMC5883L
 * 3-axis Digital Compass IC. See http://www51.honeywell.com/aero/common/documents/myaerospacecatalog-documents/Defense_Brochures-documents/HMC5883L_3-Axis_Digital_Compass_IC.pdf
 * for details.
 */
class HMC5883L extends MultiAxisGyro {
    /**
     * Initializes a new instance of the jsrpi.Components.Gyroscope.Honeywell.HMC5883L
     * class with the I2C device that represents the physical connection to the
     * gyro.
     * @param {I2CInterface} device The I2C device that represents the physical
     * connection to the gyro. If null, then it is assumbed that the host is a
     * revision 2 or higher board and a default jsrpi.IO.I2C.I2CBus using the
     * rev 2 I2C bus path will be used instead.
     * @param {Number} busAddress The bus address of the device.
     * @throws {IOException} if unable to open the specified I2C bus device.
     * @throws {ObjectDisposedException} if the specified device instance has
     * been disposed.
     * @constructor
     */
    constructor(device = null, busAddress = 0) {
        super();
        this._base = new ComponentBase();

        if (!device) {
            device = new I2CBus(BoardRevision.Rev2);
        }

        this._device = device;
        if (!this._device.isOpen) {
            this._device.open();
        }

        this._x = new AxisGyroscope(this, 20);
        this._y = new AxisGyroscope(this, 20);
        this._z = new AxisGyroscope(this, 20);

        this._aX = CoreUtils.cloneObject(this._x);
        this._aY = CoreUtils.cloneObject(this._y);
        this._aZ = CoreUtils.cloneObject(this._z);

        this._address = HMC5883L_ADDR;
        if (busAddress) {
            if (!isNaN(busAddress)) {
                this._address = busAddress;
            }
        }

        this._timeDelta = 0;
        this._lastRead = 0;
        this._outputRate = HMC5883LOutputRate.Rate_15_HZ;
        this._average = Samples.Average_8;
        this._measurementMode = MeasurementModes.NormalMode;
        this._gain = HMC5883LGains.GAIN_1_3_GA;
        this._mode = OperationMode.Continuous;
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
     * Releases all resources used by the HMC5883L5 object.
     * @override
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }

        if (this._device) {
            this._device.dispose();
            this._device = undefined;
        }

        if (!this._aX) {
            this._aX.dispose();
            this._aX = undefined;
        }

        if (!this._aY) {
            this._aY.dispose();
            this._aY = undefined;
        }

        if (!this._aZ) {
            this._aZ.dispose();
            this._aZ = undefined;
        }

        if (!this._x) {
            this._x.dispose();
            this._x = undefined;
        }

        if (!this._y) {
            this._y.dispose();
            this._y = undefined;
        }

        if (!this._z) {
            this._z.dispose();
            this._z = undefined;
        }

        this._timeDelta = 0;
        this._lastRead = 0;
        this._outputRate = HMC5883LOutputRate.Rate_15_HZ;
        this._average = Samples.Average_8;
        this._measurementMode = MeasurementModes.NormalMode;
        this._gain = HMC5883LGains.GAIN_1_3_GA;
        this._mode = OperationMode.Continuous;
        this._base.dispose();
    }

    /**
     * The default physical bus address of the HMC5883L.
     * @type {number}
     * @const
     */
    static get HMC5883L_ADDRESS() { return HMC5883L_ADDR; }

    /**
     * Gets a reference to the X axis.
     * @property {AxisGyroscope|*} X - The X axis.
     * @readonly
     */
    get X() { return this._x; }

    /**
     * Gets a reference to the Y axis.
     * @property {AxisGyroscope|*} Y - The Y axis.
     * @readonly
     */
    get Y() { return this._y; }

    /**
     * Gets a reference to the Z axis.
     * @property {AxisGyroscope|*} Z - The Z axis.
     * @readonly
     */
    get Z() { return this._z; }

    /**
     * Gets a reference to the X axis implementation.
     * @property {AxisGyroscope|*} aX - The X axis implementation.
     * @readonly
     */
    get aX() { return this._aX; }

    /**
     * Gets a reference to the Y axis implementation.
     * @property {AxisGyroscope|*} aY - The Y axis implementation.
     * @readonly
     */
    get aY() { return this._aY; }

    /**
     * Gets a reference to the Z axis implementation.
     * @property {AxisGyroscope|*} aZ - The Z axis implementation.
     * @readonly
     */
    get aZ() { return this._aZ; }

    /**
     * Gets the time difference (delta) since the last loop.
     * @property {Number} timeDelta - The time delta.
     * @readonly
     */
    get timeDelta() { return this._timeDelta; }

    /**
     * Gets or sets the output rate (resolution).
     * @property {Number} outputRate - The output rate.
     */
    get outputRate() {
        return this._outputRate;
    }

    set outputRate(value) {
        this._outputRate = value || HMC5883LOutputRate.Rate_15_HZ;
    }

    /**
     * Gets or sets the average sample rate.
     * @property {Number} samplesAverage - The average sample rate.
     */
    get samplesAverage() {
        return this._average;
    }

    set samplesAverage(value) {
        this._average = value || Samples.Average_8;
    }

    /**
     * Gets or sets the measurement mode.
     * @property {Number} measurementMode - The measurement mode.
     */
    get measurementMode() {
        return this._measurementMode;
    }

    set measurementMode(value) {
        this._measurementMode = value || MeasurementModes.NormalMode;
    }

    /**
     * Gets or sets the gain.
     * @property {Number} gain - The gain.
     */
    get gain() {
        return this._gain;
    }

    set gain(value) {
        this._gain = value || HMC5883LGains.GAIN_1_3_GA;
    }

    /**
     * Gets or sets the mode of operation.
     * @property {Number} operationMode - The mode.
     */
    get operationMode() {
        return this._mode;
    }

    set operationMode(value) {
        this._mode = value || OperationMode.Continuous;
    }

    /**
     * Enables the gyro.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    enable() {
        if (this.isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Gyroscope.Honeywell.HMC5883L");
        }
        let packet = [ 2, 0 ];
        this._device.writeBytes(this._address, packet);
    }

    /**
     * Disables the gyro.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     */
    disable() {
        if (this.isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Gyroscope.Honeywell.HMC5883L");
        }

        let initPkt = [
            ((this._average << 5) + (this._outputRate << 2) + this._measurementMode),
            (this._gain << 5),
            OperationMode.Idle
        ];
        this._device.writeBytes(this._address, initPkt);
    }

    /**
     * Initializes the gyro.
     * @param {Gyro} triggeringAxis The gyro that represents the single axis
     * responsible for the triggering of updates.
     * @param {Number} trigMode The gyro update trigger mode. Use one of the
     * jsrpi.Components.Gyroscope.GyroTriggerMode values.
     * @returns {Gyro} a reference to the specified triggering axis, which
     * may or may not have been modified.
     * @throws {ArgumentNullException} if the trigAxis param is null or undefined.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     * @override
     */
    init(triggeringAxis, trigMode) {
        if (!triggeringAxis) {
            throw new ArgumentNullException("trigAxis param cannot be null or undefined. Must be of type jsrpi.Components.Gyroscope.Gyro.");
        }

        if (!trigMode) {
            trigMode = GyroTriggerMode.ReadNotTriggered;
        }

        this.enable();
        if (triggeringAxis === this.aX) {
            this.aX.setReadTrigger(trigMode);
        }
        else {
            this.aX.setReadTrigger(GyroTriggerMode.ReadNotTriggered);
        }

        if (triggeringAxis === this.aY) {
            this.aY.setReadTrigger(trigMode);
        }
        else {
            this.aY.setReadTrigger(GyroTriggerMode.ReadNotTriggered);
        }

        if (triggeringAxis === this.aZ) {
            this.aZ.setReadTrigger(trigMode);
        }
        else {
            this.aZ.setReadTrigger(GyroTriggerMode.ReadNotTriggered);
        }

        return triggeringAxis;
    }

    /**
     * Reads the gyro and stores the value internally.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     * @override
     */
    readGyro() {
        if (this.isDisposed) {
            throw new ObjectDisposedException("jsrpi.Components.Gyroscope.Honeywell.HMC5883L");
        }

        let now = SystemInfo.getCurrentTimeMillis();
        this._timeDelta = (now - this._lastRead);
        this._lastRead = now;

        let data = this._device.readBytes(this._address, 6);
        if (data.length !== 6) {
            throw new IOException("Couldn't read compass data; Returned buffer size = " + data.length.toString());
        }

        this.aX.rawValue = ((data[0] & 0xff) << 8) + (data[1] & 0xff);
        this.aY.rawValue = ((data[2] & 0xff) << 8) + (data[3] & 0xff);
        this.aZ.rawValue = ((data[3] & 0xff) << 8) + (data[5] & 0xff);
    }

    /**
     * Recalibrates the offset.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @throws {IOException} if unable to write to the gyro.
     * @override
     */
    recalibrateOffset() {
        let totalX = 0;
        let totalY = 0;
        let totalZ = 0;

        let x = 0;
        let y = 0;
        let z = 0;

        let minX = 10000;
        let minY = 10000;
        let minZ = 10000;

        let maxX = -10000;
        let maxY = -10000;
        let maxZ = -10000;

        for (let i = 0; i < CALIBRATION_SKIPS; i++) {
            this.readGyro();
            CoreUtils.sleepMicroseconds(1000);
        }

        for (let j = 0; j < CALIBRATION_READS; j++) {
            this.readGyro();

            x = this.aX.rawValue;
            y = this.aY.rawValue;
            z = this.aZ.rawValue;

            totalX += x;
            totalY += y;
            totalZ += z;

            if (x < minX) {
                minX = x;
            }

            if (y < minY) {
                minY = y;
            }

            if (z < minZ) {
                minZ = z;
            }

            if (x > maxX) {
                maxX = x;
            }

            if (y > maxY) {
                maxY = y;
            }

            if (z > maxZ) {
                maxZ = z;
            }
        }

        this.aX.offset = (totalX / CALIBRATION_READS);
        this.aY.offset = (totalY / CALIBRATION_READS);
        this.aZ.offset = (totalZ / CALIBRATION_READS);
    }
}

module.exports = HMC5883L;