"use strict";

//
//  NetworkInfo.js
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
//

/**
 * This module provides methods for getting network-specific info about the
 * local host and its integrated and/or attached network hardware.
 */

/**
 * @fileOverview Provides network-related utility methods.
 *
 * @module NetworkInfo
 * @requires os
 * @requires dns
 * @requires ExecUtils
 */

var os = require('os');
var dns = require('dns');
var ExecUtils = require("../ExecUtils.js");

/**
 * Gets the name of the host.
 * @return {String} The host name.
 */
var getHostName = function() {
  return os.hostname();
};

/**
 * Get the fully-qualified domain name of the local host.
 * @return {String} The fully-qualified domain name (FQDN).
 */
var getFQDN = function() {
  var result = ExecUtils.executeCommand("hostname -f");
  if (result != null) {
    return result[0];
  }

  return getHostName();
};

/**
 * Gets an array of all the IP addresses assigned to all the network interfaces.
 * @return {Array} An array of IPv4/IPv6 addresses assigned to the local host.
 */
var getIPAddresses = function() {
  var addrs = [];
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function(ifname) {
    ifaces[ifname].forEach(function(iface) {
      if (((iface.family !== 'IPv4') && (iface.family !== 'IPv6')) ||
          (!iface.internal)) {
        // Skip loopback and non-IPv4 and non-IPv6 interfaces.
        return;
      }
      addrs.push(iface.address);
    });
  });
  return addrs;
};

/**
 * Gets the IP address of the local system's hostname. This only works if the
 * hostname can be resolved.
 * @return {String} The IP address.
 */
var getIPAddress = function() {
  return ExecUtils.executeCommand("hostname --ip-address")[0];
};

/**
 * Gets all FQDNs of the machine. This enumerates all configured network
 * addresses on all configured network interfaces, and translates them to DNS
 * domain names. Addresses that cannot be translated (i.e. because they do not
 * have an appropriate reverse DNS entry) are skipped. Note that different
 * addresses may resolve to the same name, therefore the return value may
 * contain duplicate entries. Do not make any assumptions about the order of the
 * items in the array.
 * @return {Array} The FQDNs.
 */
var getAllFQDNs = function() {
  var names = ExecUtils.executeCommand("hostname --all-fqdns")[0];
  return names.split(' ');
};

/**
 * Gets an array of all available name servers.
 * @return {Array} The name servers.
 */
var getNameServers = function() {
  return dns.getServers();
};

module.exports.getHostName = getHostName;
module.exports.getFQDN = getFQDN;
module.exports.getIPAddresses = getIPAddresses;
module.exports.getIPAddress = getIPAddress;
module.exports.getAllFQDNs = getAllFQDNs;
module.exports.getNameServers = getNameServers;
