"use strict";
//
//  MicrochipPotentiometerBase.js
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

const ArgumentNullException = require('../../../ArgumentNullException.js');
const ComponentBase = require('../../ComponentBase.js');
const DeviceControlChannel = require('./DeviceControlChannel.js');
const DeviceControllerTerminalConfiguration = require('./DeviceControllerTerminalConfiguration.js');
const EventEmitter = require('events').EventEmitter;
const IllegalArgumentException = require('../../../IllegalArgumentException.js');
const InvalidOperationException = require('../../../InvalidOperationException.js');
const MCPTerminalConfiguration = require('./MCPTerminalConfiguration.js');
const MicrochipPotentiometer = require('./MicrochipPotentiometer.js');
const MicrochipPotChannel = require('./MicrochipPotChannel.js');
const MicrochipPotDeviceController = require('./MicrochipPotDeviceController.js');
const MicrochipPotDeviceStatus = require('./MicrochipPotDeviceStatus.js');
const MicrochipPotNonVolatileMode = require('./MicrochipPotNonVolatileMode.js');
const ObjectDisposedException = require('../../../ObjectDisposedException.js');

const WIPER_ACTION_EVENT = "wiperActionEvent";
const PIN_NOT_AVAILABLE = true;
const INITIALVALUE_LOADED_FROM_EEPROM = 0;

/**
 * @classdesc Wiper event info class (private).
 * @private
 */
class WiperEvent {
    /**
     * Initializes a new instance of the WiperEvent class with the channel, controller, and value.
     * @param {DeviceControlChannel} channel The control channel for the wiper.
     * @param {MicrochipPotDeviceController} controller The device controller.
     * @param {Number} val The device reading value.
     * @constructor
     */
    constructor(channel = null, controller = null, val = 0) {
        this._chan = channel;
        this._ctlr = controller;
        this._value = 0;
    }

    /**
     * Sets the channel value.
     * @param {Boolean} nonVol Set true if setting the channel value of a
     * non-volatile wiper, or false for a volatile wiper.
     */
    setChannelValue(nonVol) {
        nonVol = nonVol || false;
        this._ctlr.setValue(this._chan, this._value, nonVol);
    }
}

/**
 * @classdesc Base class for Microchip MCP45XX and MCP46XX IC device
 * abstraction components.
 * @implements {MicrochipPotentiometer}
 * @extends {ComponentBase}
 * @extends {EventEmitter)
 */
class MicrochipPotentiometerBase extends MicrochipPotentiometer {
    /**
     * Initializes a new instance of the MicrochipPotentiometerBase class with
     * the I2C device connection, pin A0, A1, and A2 states, the potentiometer
     * (channel) provided by the device, how to do non-volatile I/O and the
     * initial value for devices which are not capable of non-volatile wipers.
     * @param {I2CInterface|I2CBus} device The I2C bus device this instance is connected to.
     * @param {Boolean} pinA0 Whether the device's address pin A0 is high (true) or low (false).
     * @param {Boolean} pinA1 Whether the device's address pin A1 is high (true) or low (false).
     * @param {Boolean} pinA2 Whether the device's address pin A2 is high (true) or low (false).
     * @param {MicrochipPotChannel|Number} channel Which of the potentiometers provided by the device to control.
     * @param {MicrochipPotNonVolatileMode|Number} nonVolatileMode The way non-volatile reads or writes are done.
     * @param {Number} initialNonVolWiperValue The value for devices which are not capable of non-volatile wipers.
     * @throws {ArgumentNullException} if 'device' param or 'channel' param are null.
     * @throws {IllegalArgumentException} if the specified channel is not supported by this device.
     * @throws {IOException} if unable to open the I2C bus.
     * @constructor
     */
    constructor(device = null, pinA0 = false, pinA1 = false, pinA2 = false, channel = MicrochipPotChannel.None,
                nonVolatileMode = MicrochipPotNonVolatileMode.VolatileAndNonVolatile, initialNonVolWiperValue = 0) {
        super();

        if (!device) {
            throw new ArgumentNullException("device");
        }

        if (!this.isChannelSupported(channel)) {
            throw new IllegalArgumentException("Specified channel not supported by device.");
        }

        this._base = new ComponentBase();
        this._emitter = new EventEmitter();
        this._channel = channel;
        this._currentValue = 0;
        this._nonVolMode = nonVolatileMode;
        const deviceAddr = MicrochipPotentiometerBase._buildI2CAddress(pinA0, pinA1, pinA2);
        this._controller = new MicrochipPotDeviceController(device, deviceAddr);
        this._emitter.on(WIPER_ACTION_EVENT, (wiperEvt) => this._onWiperActionEvent(wiperEvt));
        this._initialize(initialNonVolWiperValue);
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
     * Releases all resources used by the MicrochipPotentiometerBase object.
     * @override
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }

        if (this._controller) {
            this._controller.dispose();
            this._controller = undefined;
        }

        this._currentValue = -1;
        this._channel = MicrochipPotChannel.None;
        this._nonVolMode = MicrochipPotNonVolatileMode.VolatileAndNonVolatile;
        this._emitter.removeAllListeners();
        this._emitter = undefined;
        this._base.dispose();
    }

    /**
     * Gets the way non-volatile reads and/or writes are done.
     * @property {MicrochipPotNonVolatileMode|Number} nonVolatileMode - The non-volatile mode.
     * @readonly
     * @override
     */
    get nonVolatileMode() {
        return this._nonVolMode;
    }

    /**
     * Gets the channel this device is configured for.
     * @property {MicrochipPotChannel|Number} channel - The device channel.
     * @readonly
     * @override
     */
    get channel() {
        return this._channel;
    }

    /**
     * Adjusts the given value according to the boundaries (0 and maxValue).
     * @param {Number} val The wiper's value to be set.
     * @returns {number} A valid wiper value.
     * @private
     */
    _getValueAccordingBoundaries(val = 0) {
        let newVal = 0;
        if (isNaN(val) || val < 0) {
            newVal = 0;
        }
        else if (val > this.maxValue) {
            newVal = this.maxValue;
        }
        else {
            newVal = val;
        }
        return newVal;
    }

    /**
     * Attaches a listener (callback) for the specified event name.
     * @param  {String}   evt      The name of the event.
     * @param  {Function} callback The callback function to execute when the
     * event is raised.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @override
     */
    on(evt, callback) {
        if (this.isDisposed) {
            throw new ObjectDisposedException("MicrochipPotentiometerBase");
        }
        this._emitter.on(evt, callback);
    }

    /**
     * Emits the specified event.
     * @param  {String} evt  The name of the event to emit.
     * @param  {Object} args The object that provides arguments to the event.
     * @throws {ObjectDisposedException} if this instance has been disposed.
     * @override
     */
    emit(evt, args) {
        if (this.isDisposed) {
            throw new ObjectDisposedException("MicrochipPotentiometerBase");
        }

        this._emitter.emit(evt, args);
    }

    /**
     * Fires the WIPER_ACTION_EVENT event.
     * @param {WiperEvent|Object} wiperEvt The event info.
     * @private
     */
    _fireWiperActionEvent(wiperEvt) {
        if (this.isDisposed) {
            throw new ObjectDisposedException("MicrochipPotentiometerBase");
        }

        setImmediate((wiperEvt) => {
            this.emit(WIPER_ACTION_EVENT, wiperEvt);
        });
    }

    /**
     * Handles the internal WIPER_ACTION_EVENT.
     * @param {WiperEvent|Object} wiperEvt The event info.
     * @private
     */
    _onWiperActionEvent(wiperEvt) {
        // Do nothing if no event specified.
        if (wiperEvt === null) {
            return;
        }

        // For volatile wiper.
        switch (this._nonVolMode) {
            case MicrochipPotNonVolatileMode.VolatileOnly:
            case MicrochipPotNonVolatileMode.VolatileAndNonVolatile:
                wiperEvt.setChannelValue(MicrochipPotDeviceController.VOLATILE_WIPER);
                break;
            case MicrochipPotNonVolatileMode.NonVolatileOnly:
                break;
            default:
                break;
        }

        // For non-volatile wiper.
        switch (this._nonVolMode) {
            case MicrochipPotNonVolatileMode.NonVolatileOnly:
            case MicrochipPotNonVolatileMode.VolatileAndNonVolatile:
                wiperEvt.setChannelValue(MicrochipPotDeviceController.NONVOLATILE_WIPER);
                break;
            case MicrochipPotNonVolatileMode.VolatileOnly:
                break;
            default:
                break;
        }
    }

    /**
     * The current value. Values from 0 to <see cref="MaxValue"/>
     * are valid. Values above or below these boundaries should be
     * corrected quietly.
     * @property {Number} The wiper's current value. This value is read from
     * cache. The cache is updated on any modifying action or the method
     * updateCacheFromDevice().
     * @override
     */
    get currentValue() {
        return this._currentValue;
    }

    set currentValue(val) {
        // Check boundaries.
        const newVal = this._getValueAccordingBoundaries(val);

        // Set wipers according to mode.
        const chan = DeviceControlChannel.valueOf(this.channel);
        this._fireWiperActionEvent(new WiperEvent(chan, this._controller, newVal));

        // Set value only if volatile wiper is affected.
        if (this._nonVolMode === MicrochipPotNonVolatileMode.NonVolatileOnly) {
            return;
        }

        this._currentValue = newVal;
    }

    /**
     * Gets the device and wiper status.
     * @property {MicrochipPotDeviceStatus} deviceStatus - The device status.
     * @throws {IOException} if communication with the device fails.
     * @readonly
     * @override
     */
    get deviceStatus() {
        const devStat = this._controller.deviceStatus;
        const wiperLockActive = this._channel === MicrochipPotChannel.A ? devStat.channelALocked : devStat.channelBLocked;
        return new MicrochipPotDeviceStatus(this._channel, devStat.eepromWriteActive, devStat.eepromWriteProtected, wiperLockActive);
    }

    /**
     * Gets or sets the current terminal configuration.
     * @property {MCPTerminalConfiguration} terminalConfiguration - The
     * terminal configuration.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     * @override
     */
    get terminalConfiguration() {
        const chan = DeviceControlChannel.valueOf(this._channel);
        const tcon = this._controller.getTerminalConfiguration(chan);
        return new MCPTerminalConfiguration(this._channel, tcon.channelEnabled, tcon.pinAEnabled, tcon.pinWEnabled, tcon.pinBEnabled);
    }

    set terminalConfiguration(config) {
        if (!config) {
            throw new ArgumentNullException("config value cannot be null or undefined.");
        }

        if (config.channel !== this._channel) {
            throw new IllegalArgumentException("Setting a configuration with a channel " +
                                                "than is not the potentiometer's channel is not supported.");
        }

        const chan = DeviceControlChannel.valueOf(this._channel);
        const devCon = new DeviceControllerTerminalConfiguration(chan, config.channelEnabled, config.pinAEnabled, config.pinWEnabled, config.pinBEnabled);
        this._controller.setTerminalConfiguration(devCon);
    }

    /**
     * Sets the non-volatility mode.
     * @param {MicrochipPotNonVolatileMode|Number} mode The way non-volatile reads or writes are done.
     * @throws {InvalidOperationException} if This device is not capable of non-volatile wipers.
     * @protected
     */
    _setNonVolatileMode(mode) {
        if (!this.isNonVolatileWiperCapable && this._nonVolMode !== MicrochipPotNonVolatileMode.VolatileOnly) {
            throw new InvalidOperationException("This device is not capable of non-volatile wipers." +
                                                " You *must* use MicrochipPotNonVolatileMode.VolatileOnly.");
        }

        this._nonVolMode = mode;
    }

    /**
     * Updates the cache to the wiper's value.
     * @returns {Number} the wiper's current value.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     * @override
     */
    updateCacheFromDevice() {
        this._currentValue = this._controller.getValue(DeviceControlChannel.valueOf(this._channel), false);
        return this._currentValue;
    }

    /**
     * Gets the non-volatile wiper's value.
     * @returns {Number} The non-volatile wiper's value.
     * @throws {IOException} if communication with the device failed or a malformed result.
     * @throws {InvalidOperationException} The device is not capable of non-volatile wipers.
     * @protected
     */
    _getNonVolatileValue() {
        if (!this.isNonVolatileWiperCapable) {
            throw new InvalidOperationException("This device is not capable of non-volatile wipers!");
        }

        return this._controller.getValue(DeviceControlChannel.valueOf(this._channel), true);
    }

    /**
     * Determines whether or not the specified channel is supported by
     * the underlying device.
     * @param {MicrochipPotChannel|Number} channel The channel to check.
     * @returns {Boolean} true if the channel is supported; otherwise, false.
     * @override
     */
    isChannelSupported(channel) {
        let supported = false;
        for (let chan of this.supportedChannels) {
            if (channel === chan) {
                supported = true;
                break;
            }
        }
        return supported;
    }

    /**
     * Initializes the wiper to a defined status. For devices capable of non-volatile
     * wipers, the non-volatile value is loaded. For devices not capable, the given
     * value is set in the device.
     * @param {Number} initialValForNonVolWipers The initial value for devices not capable of non-volatile wipers.
     * @throws {IOException} if communication with the device failed or a malformed result.
     * @protected
     */
    _initialize(initialValForNonVolWipers) {
        const chan = DeviceControlChannel.valueOf(this._channel);
        if (this.isNonVolatileWiperCapable) {
            this._currentValue = this._controller.getValue(chan, true);
        }
        else {
            const newInitialWiperVal = this._getValueAccordingBoundaries(initialValForNonVolWipers);
            this._controller.setValue(DeviceControlChannel.valueOf(this._channel), newInitialWiperVal, MicrochipPotDeviceController.VOLATILE_WIPER);
            this._currentValue = newInitialWiperVal;
        }
    }

    /**
     * Decreases the wiper's value by the specified number of steps. It is not
     * an error if the wiper hits or already hit the lower boundary (0). In
     * such situations, the wiper sticks to the lower boundary or doesn't change.
     * @param {Number} steps The number of steps to decrease by.
     * @throws {IllegalArgumentException} if 'steps' is not a positive integer value.
     * @throws {InvalidOperationException} if attempting to decrease on a wiper
     * that is not volatile-only.
     * @throws {IOException} if communication with the device failed.
     * @override
     */
    decrease(steps = 1) {
        if (this._currentValue === 0) {
            return;
        }

        if (steps < 0) {
            throw new IllegalArgumentException("only positive integer values are permitted.");
        }

        if (this.nonVolatileMode !== MicrochipPotNonVolatileMode.VolatileOnly) {
            throw new InvalidOperationException("Decrease is only permitted for volatile-only wipers.");
        }

        // Check boundaries.
        let actualSteps = steps;
        if (steps > this._currentValue) {
            actualSteps = this._currentValue;
        }

        const newVal = (this._currentValue - actualSteps);
        if ((newVal === 0) || (steps > 5)) {
            this.currentValue = newVal;
        }
        else {
            this._controller.decrease(DeviceControlChannel.valueOf(this._channel), actualSteps);
            this._currentValue = newVal;
        }
    }

    /**
     * Decreases the wiper's value by the specified number of
     * steps. It is not an error if the wiper hits or already
     * hit the lower boundary (0). In such situations, the
     * wiper sticks to the lower boundary or doesn't change.
     * @param {Number} steps The number of steps to increase by.
     * @throws {IllegalArgumentException} if 'steps' is not a positive integer value.
     * @throws {InvalidOperationException} if attempting to increase on a wiper
     * that is not volatile-only.
     * @throws {IOException} if communication with the device failed.
     * @override
     */
    increase(steps = 1) {
        let maxVal = this.maxValue;
        if (this._currentValue === maxVal) {
            return;
        }

        if (steps < 0) {
            throw new IllegalArgumentException("only positive integer values are permitted.");
        }

        if (this.nonVolatileMode !== MicrochipPotNonVolatileMode.VolatileOnly) {
            throw new InvalidOperationException("Increase is only permitted for volatile-only wipers.");
        }

        // Check boundaries.
        let actualSteps = steps;
        if ((steps + this._currentValue) > maxVal) {
            actualSteps = (maxVal - this._currentValue);
        }

        const newVal = (this._currentValue + actualSteps);
        if ((newVal === maxVal) || (steps > 5)) {
            this.currentValue = newVal;
        }
        else {
            this._controller.increase(DeviceControlChannel.valueOf(this._channel), actualSteps);
            this._currentValue = newVal;
        }
    }

    /**
     * Enables or disables the wiper lock.
     * @param {Boolean} enabled Set true to enable.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     * @override
     */
    setWiperLock(enabled) {
        // TODO we should probably check if disposed here and throw ObjectDisposedException if necessary.
        enabled = enabled || false;
        this._controller.setWiperLock(DeviceControlChannel.valueOf(this._channel), enabled);
    }

    /**
     * In a derived class, Enables or disables write-protection for devices
     * capable of non-volatile memory. Enabling write-protection does not only
     * protect non-volatile wipers, it also protects any other non-volatile
     * information stored (i.e. wiper-locks).
     * @param {Boolean} enabled Set true to enable.
     * @throws {IOException} if communication with the device failed or
     * malformed result.
     */
    setWriteProtection(enabled = false) {
        // TODO we should probably check if disposed here and throw ObjectDisposedException if necessary.
        enabled = enabled || false;
        this._controller.setWriteProtection(enabled);
    }

    /**
     * Builds the I2C bus address of the device based on which which address
     * pins are set.
     * @param {Boolean} pinA0 Whether the device's address pin A0 is high (true) or low (false).
     * @param {Boolean} pinA1 Whether the device's address pin A1 (if available) is high (true) or low (false).
     * @param {Boolean} pinA2 Whether the device's address pin A2 (if available) is high (true) or low (false).
     * @returns {Number} The I2C-address based on the address-pins given.
     * @protected
     * @static
     */
    static _buildI2CAddress(pinA0 = false, pinA1 = false, pinA2 = false) {
        // Constant component.
        let i2cAddress = 0x0101000;

        // Dynamic component if device knows A0.
        if (pinA0) {
            i2cAddress |= 0x0000001;
        }

        // Dynamic component if device knows A1.
        if (pinA1) {
            i2cAddress |= 0x0000010;
        }

        // Dynamic component if device knows A2.
        if (pinA2) {
            i2cAddress |= 0x0000100;
        }
        return i2cAddress;
    }

    /**
     * The value which is used for address-bit if the device's package does
     * not provide a matching address pin.
     * @type {Boolean}
     * @const
     * @protected
     */
    static get _PIN_NOT_AVAILABLE() { return PIN_NOT_AVAILABLE; }

    /**
     * The value which is used for devices capable of non-volatile wipers.
     * For those devices, the initial value is loaded from EEPROM.
     * @type {Number}
     * @const
     * @protected
     */
    static get _INITIALVALUE_LOADED_FROM_EEPROM() { return INITIALVALUE_LOADED_FROM_EEPROM; }
}

module.exports = MicrochipPotentiometerBase;