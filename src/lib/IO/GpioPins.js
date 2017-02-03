'use strict';

//
//  GpioPins.js
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
 * The various GPIO pins on the Raspberry Pi Revision 1.0 and 2.0 boards.
 * Refer to http://elinux.org/Rpi_Low-level_peripherals for diagram.
 * P1-01 = bottom left, P1-02 = top left
 * pi connector P1 pin    = GPIOnum
 *                  P1-03 = GPIO0
 *                  P1-05 = GPIO1
 *                  P1-07 = GPIO4
 *                  P1-08 = GPIO14 - alt function (UART0_TXD) on boot-up
 *                  P1-10 = GPIO15 - alt function (UART0_TXD) on boot-up
 *                  P1-11 = GPIO17
 *                  P1-12 = GPIO18
 *                  P1-13 = GPIO21
 *                  P1-15 = GPIO22
 *                  P1-16 = GPIO23
 *                  P1-18 = GPIO24
 *                  P1-19 = GPIO10
 *                  P1-21 = GPIO9
 *                  P1-22 = GPIO25
 *                  P1-23 = GPIO11
 *                  P1-24 = GPIO8
 *                  P1-26 = GPIO7
 * So to turn on Pin7 on the GPIO connector, pass in enum GpioPins.GPIO04 as
 * the pin parameter.
 * @enum {Number}
 */
const GpioPins = {
  /**
   * No pin (null).
   * @type {Object}
   */
  GPIO_NONE : { value: -1, name: "GPIO_NONE" },

  /**
   * GPIO 00 (pin P1 - 03).
   * @type {Object}
   */
  GPIO00 : { value: 0, name: "GPIO00" },

  /**
   * GPIO 01 (pin P1-05).
   * @type {Object}
   */
  GPIO01 : { value: 1, name: "GPIO01" },

  /**
   * GPIO 04 (pin P1-07).
   * @type {Object}
   */
  GPIO04 : { value: 4, name: "GPI04" },

  /**
   * GPIO 07 (pin P1-26).
   * @type {Number}
   */
  GPIO07 : { value: 7, name: "GPIO07" },

  /**
   * GPIO 08 (pin P1-24).
   * @type {Number}
   */
  GPIO08 : { value: 8, name: "GPIO08" },

  /**
   * GPIO pin 09 (pin P1-21).
   * @type {Number}
   */
  GPIO09 : { value: 9, name: "GPIO09" },

  /**
   * GPIO pin 10 (pin P1-19).
   * @type {Number}
   */
  GPIO10 : { value: 10, name: "GPIO10" },

  /**
   * GPIO pin 11 (pin P1-23).
   * @type {Number}
   */
  GPIO11 : { value: 11, name: "GPIO11" },

  /**
   * GPIO pin 14 (pin P1-08).
   * @type {Number}
   */
  GPIO14 : { value: 14, name: "GPIO14" },

  /**
   * GPIO pin 15 (pin P1-10).
   * @type {Number}
   */
  GPIO15 : { value: 15, name: "GPIO15" },

  /**
   * GPIO pin 17 (pin P1-11).
   * @type {Number}
   */
  GPIO17 : { value: 17, name: "GPIO17" },

  /**
   * GPIO pin 18 (pin P1-12).
   * @type {Number}
   */
  GPIO18 : { value: 18, name: "GPIO18" },

  /**
   * GPIO pin 21 (pin P1-13).
   * @type {Number}
   */
  GPIO21 : { value: 21, name: "GPIO21" },

  /**
   * GPIO pin 22 (pin P1-15).
   * @type {Number}
   */
  GPIO22 : { value: 22, name: "GPIO22" },

  /**
   * GPIO pin 23 (pin P1-16).
   * @type {Number}
   */
  GPIO23 : { value: 23, name: "GPIO23" },

  /**
   * GPIO pin 24 (pin P1-18).
   * @type {Number}
   */
  GPIO24 : { value: 24, name: "GPIO24" },

  /**
   * GPIO pin 25 (pin P1-22).
   * @type {Number}
   */
  GPIO25 : { value: 25, name: "GPIO25" },

  /**
   * Pin 3.
   * @type {Number}
   */
  Pin03 : { value: 0, name: "Pin03" },

  /**
   * Pin 5.
   * @type {Number}
   */
  Pin05 : { value: 1, name: "Pin05" },

  /**
   * Pin 7.
   * @type {Number}
   */
  Pin07 : { value: 4, name: "Pin07" },

  /**
   * Pin 8.
   * @type {Number}
   */
  Pin08 : { value: 14, name: "Pin08" },

  /**
   * Pin 10.
   * @type {Number}
   */
  Pin10 : { value: 15, name: "Pin10" },

  /**
   * Pin 11.
   * @type {Number}
   */
  Pin11 : { value: 17, name: "Pin11" },

  /**
   * Pin 12.
   * @type {Number}
   */
  Pin12 : { value: 18, name: "Pin12" },

  /**
   * Pin 13.
   * @type {Number}
   */
  Pin13 : { value: 21, name: "Pin13" },

  /**
   * Pin 15.
   * @type {Number}
   */
  Pin15 : { value: 22, name: "Pin15" },

  /**
   * Pin 16.
   * @type {Number}
   */
  Pin16 : { value: 23, name: "Pin16" },

  /**
   * Pin 18.
   * @type {Number}
   */
  Pin18 : { value: 24, name: "Pin18" },

  /**
   * Pin 19.
   * @type {Number}
   */
  Pin19 : { value: 10, name: "Pin19" },

  /**
   * Pin 21.
   * @type {Number}
   */
  Pin21 : { value: 9, name: "Pin21" },

  /**
   * Pin 22.
   * @type {Number}
   */
  Pin22 : { value: 25, name: "Pin22" },

  /**
   * Pin 23.
   * @type {Number}
   */
  Pin23 : { value: 11, name: "Pin23" },

  /**
   * Pin 24.
   * @type {Number}
   */
  Pin24 : { value: 8, name: "Pin24" },

  /**
   * Pin 26.
   * @type {Number}
   */
  Pin26 : { value: 7, name: "Pin26" },

  /**
   * LED driver pin.
   * @type {Number}
   */
  LED : { value: 16, name: "LED" },

  /* Board Revision 2 pins */

  /**
   * Rev2 GPIO 02 (P1-03).
   * @type {Number}
   */
  V2_GPIO02 : { value: 2, name: "V2_GPIO02" },

  /**
   * Rev2 GPIO 03 (P1-05).
   * @type {Number}
   */
  V2_GPIO03 : { value: 3, name: "V2_GPIO03" },

  /**
   * Rev2 GPIO 04 (P1-07).
   * @type {Number}
   */
  V2_GPIO04 : { value: 4, name: "V2_GPIO04" },

  /**
   * Rev2 GPIO 07 (P1-26).
   * @type {Number}
   */
  V2_GPIO07 : { value: 7, name: "V2_GPIO07" },

  /**
   * Rev2 GPIO 08 (P1-24).
   * @type {Number}
   */
  V2_GPIO08 : { value: 8, name: "V2_GPIO08" },

  /**
   * Rev2 GPIO 09 (P1-21).
   * @type {Number}
   */
  V2_GPIO09 : { value: 9, name: "V2_GPIO09" },

  /**
   * Rev2 GPIO 10 (P1-19).
   * @type {Number}
   */
  V2_GPIO10 : { value: 10, name: "V2_GPIO10" },

  /**
   * Rev2 GPIO 11 (P1-23).
   * @type {Number}
   */
  V2_GPIO11 : { value: 11, name: "V2_GPIO11" },

  /**
   * Rev2 GPIO 14 (P1-08).
   * @type {Number}
   */
  V2_GPIO14 : { value: 14, name: "V2_GPIO14" },

  /**
   * Rev2 GPIO 15 (P1-10).
   * @type {Number}
   */
  V2_GPIO15 : { value: 15, name: "V2_GPIO15" },

  /**
   * Rev2 GPIO 17 (P1-11).
   * @type {Number}
   */
  V2_GPIO17 : { value: 17, name: "V2_GPIO17" },

  /**
   * Rev2 GPIO 18 (P1-12).
   * @type {Number}
   */
  V2_GPIO18 : { value: 18, name: "V2_GPIO18" },

  /**
   * Rev2 GPIO 22 (P1-15).
   * @type {Number}
   */
  V2_GPIO22 : { value: 22, name: "V2_GPIO22" },

  /**
   * Rev2 GPIO 23 (P1-16).
   * @type {Number}
   */
  V2_GPIO23 : { value: 23, name: "V2_GPIO23" },

  /**
   * Rev2 GPIO 24 (P1-18).
   * @type {Number}
   */
  V2_GPIO24 : { value: 24, name: "V2_GPIO24}" },

  /**
   * Rev2 GPIO 25 (P1-22).
   * @type {Number}
   */
  V2_GPIO25 : { value: 25, name: "V2_GPIO25" },

  /**
   * Rev2 GPIO 27 (P1-13).
   * @type {Number}
   */
  V2_GPIO27 : { value: 27, name: "V2_GPIO27" },

  /**
   * Rev2 Pin 3 (GPIO 02).
   * @type {Number}
   */
  V2_Pin03 : { value: 2, name: "V2_Pin03" },

  /**
   * Rev2 Pin 5 (GPIO 03).
   * @type {Number}
   */
  V2_Pin05 : { value: 3, name: "V2_Pin05" },

  /**
   * Rev2 Pin 7 (GPIO 04).
   * @type {Number}
   */
  V2_Pin07 : { value: 4, name: "V2_Pin07" },

  /**
   * Rev2 Pin 8 (GPIO 14).
   * @type {Number}
   */
  V2_Pin08 : { value: 14, name: "V2_Pin08" },

  /**
   * Rev2 Pin 10 (GPIO 15).
   * @type {Number}
   */
  V2_Pin10 : { value: 15, name: "V2_Pin10" },

  /**
   * Rev2 Pin 11 (GPIO 17).
   * @type {Number}
   */
  V2_Pin11 : { value: 17, name: "V2_Pin11" },

  /**
   * Rev2 Pin 12 (GPIO 18).
   * @type {Number}
   */
  V2_Pin12 : { value: 18, name: "V2_Pin12" },

  /**
   * Rev2 Pin 13 (GPIO 27).
   * @type {Number}
   */
  V2_Pin13 : { value: 27, name: "V2_Pin13" },

  /**
   * Rev2 Pin 15 (GPIO 22).
   * @type {Number}
   */
  V2_Pin15 : { value: 22, name: "V2_Pin15" },

  /**
   * Rev2 Pin 16 (GPIO 23).
   * @type {Number}
   */
  V2_Pin16 : { value: 23, name: "V2_Pin16" },

  /**
   * Rev2 Pin 18 (GPIO 24).
   * @type {Number}
   */
  V2_Pin18 : { value: 24, name: "V2_Pin18" },

  /**
   * Rev2 Pin 19 (GPIO 10).
   * @type {Number}
   */
  V2_pin19 : {value: 10, name: "V2_Pin19"},

  /**
   * Rev2 Pin 21 (GPIO 09).
   * @type {Number}
   */
  V2_Pin21 : { value: 9, name: "V2_Pin21" },

  /**
   * Rev2 Pin 22 (GPIO 25).
   * @type {Number}
   */
  V2_Pin22 : { value: 25, name: "V2_Pin22" },

  /**
   * Rev2 Pin 23 (GPIO 11).
   * @type {Number}
   */
  V2_Pin23 : { value: 11, name: "V2_Pin23" },

  /**
   * Rev2 Pin 24 (GPIO 08).
   * @type {Number}
   */
  V2_Pin24 : { value: 8, name: "V2_Pin24" },

  /**
   * Rev2 Pin 26 (GPIO 07).
   * @type {Number}
   */
  V2_Pin26 : { value: 7, name: "V2_Pin26" },
  /* End Board Reveision 2 pins */

  /* Board Revision 2 New Plug P5 */

  /**
   * Rev2 P5 header GPIO 28 (P5-03).
   * @type {Number}
   */
  V2_P5_Pin03 : { value: 28, name: "V2_P5_Pin03" },

  /**
   * Rev2 P5 header GPIO 29 (P5-04).
   * @type {Number}
   */
  V2_P5_Pin04 : { value: 29, name: "V2_P5_Pin04" },

  /**
   * Rev2 P5 header GPIO 30 (P5-05).
   * @type {Number}
   */
  V2_P5_Pin05 : { value: 30, name: "V2_P5_Pin05" },

  /**
   * Rev2 P5 header GPIO 31 (P5-06).
   * @type {Number}
   */
  V2_P5_Pin06 : { value: 31, name: "V2_P5_Pin06" }
  /* End Board Revision 2 New Plug P5 */
};

module.exports = GpioPins;
