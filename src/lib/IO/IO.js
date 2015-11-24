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
  FileInfo : require('./FileInfo.js'),
  Gpio : require('./Gpio.js'),
  GpioBase : require('./GpioBase.js'),
  GpioPins : require('./GpioPins.js'),
  GpioStandard : require('./GpioStandard.js'),
  InvalidPinModeException : require('./InvalidPinModeException.js'),
  IOException : require('./IOException.js'),
  PiFaceGpio : require('./PiFaceGPIO.js'),
  PiFaceGpioBase : require('./PiFaceGpioBase.js'),
  PiFacePins : require('./PiFacePins.js'),
  PiFacePinFactory : require('./PiFacePinFactory.js'),
  PiFaceGpioDigital : require('./PiFaceGpioDigital.js'),
  PinPullResistance : require('./PinPullResistance.js'),
  Pin : require('./Pin.js'),
  PinMode : require('./PinMode.js'),
  PinPollFailEvent : require('./PinPollFailEvent.js'),
  PinState : require('./PinState.js'),
  PinStateChangeEvent : require('./PinStateChangeEvent'),
  PinUtils : require('./PinUtils.js'),
  PwmChannel : require('./PwmChannel.js'),
  PwmClockDivider : require('./PwmClockDivider.js'),
  PwmMode : require('./PwmMode.js'),
  RaspiGpio : require('./RaspiGpio.js'),
  UnrecognizedPinFoundEvent : require('./UnrecognizedPinFoundEvent.js'),
  Serial : require('./Serial/Serial.js')
};
