"use strict";
//
//  IO.js
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
 * @fileOverview Provides objects for interfacing with onboard GPIO pins, PiFace
 * GPIO pins and other I/O buses/devices. This is the core namespace of jsRPi.
 *
 * @module IO
 */

module.exports = {
  'fileInfo' : require('./FileInfo.js'),
  'gpio' : require('./Gpio.js'),
  'gpioBase' : require('./GpioBase.js'),
  'gpioPins' : require('./GpioPins.js'),
  'gpioStandard' : require('./GpioStandard.js'),
  'invalidPinModeException' : require('./InvalidPinModeException.js'),
  'ioException' : require('./IOException.js'),
  'piFaceGpio' : require('./PiFaceGPIO.js'),
  'piFaceGpioBase' : require('./PiFaceGpioBase.js'),
  'piFacePins' : require('./PiFacePins.js'),
  'piFacePinFactory' : require('./PiFacePinFactory.js'),
  'piFaceGpioDigital' : require('./PiFaceGpioDigital.js'),
  'pinPullResistance' : require('./PinPullResistance.js'),
  'pin' : require('./Pin.js'),
  'pinMode' : require('./PinMode.js'),
  'pinPollFailEvent' : require('./PinPollFailEvent.js'),
  'pinState' : require('./PinState.js'),
  'pinStateChangeEvent' : require('./PinStateChangeEvent'),
  'pinUtils' : require('./PinUtils.js'),
  'pwmChannel' : require('./PwmChannel.js'),
  'pwmClockDivider' : require('./PwmClockDivider.js'),
  'pwmMode' : require('./PwmMode.js'),
  'raspiGpio' : require('./RaspiGpio.js'),
  'unrecognizedPinFoundEvent' : require('./UnrecognizedPinFoundEvent.js'),
  'serial' : require('./Serial/Serial.js')
};
