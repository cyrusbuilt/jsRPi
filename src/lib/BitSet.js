"use strict";
//
//  BitSet.js
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
 * Module dependencies.
 */
var util = require('util');
var IllegalArgumentException = require("./IllegalArgumentException.js");
var ArgumentNullException = require("./ArgumentNullException.js");
var StringBuilder = require("string-builder");
var Assert = require('assert');

/**
 * The number of address bits per word.
 * @const {Number}
 * @package
 */
var ADDRESS_BITS_PER_WORD = 6;

/**
 * The number of bits per word.
 * @const {Number}
 * @package
 */
var BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD;

/**
 * Given the specified bit index, returns the word index containing it.
 * @param  {Number} bitIndex The bit index.
 * @return {Number}          The word index containing the specified bit index.
 */
var wordIndex = function(bitIndex) {
  return (bitIndex >> ADDRESS_BITS_PER_WORD);
};

/**
 * Checks to see if the specified "from" index and "to" index are a valid range
 * of bit indices and throws an exception if not.
 * @param  {Number} fromIndex The starting index.
 * @param  {Number} toIndex   The ending index.
 * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
 * @throws {IllegalArgumentException} if either parameter is not a number.
 * @throws {RangeError} if either parameter is less than zero.
 */
var checkRange = function(fromIndex, toIndex) {
  if (util.isNullOrUndefined(fromIndex)) {
    throw new ArgumentNullException("fromIndex cannot be null.");
  }

  if (util.isNullOrUndefined(toIndex)) {
    throw new ArgumentNullException("toIndex cannot be null.");
  }

  if (typeof fromIndex !== 'number') {
    throw new IllegalArgumentException("fromIndex MUST be a number.");
  }

  if (typeof toIndex !== 'number') {
    throw new IllegalArgumentException("toIndex MUST be a number.");
  }

  if (fromIndex < 0) {
    throw new RangeError("fromIndex cannot be less than zero.");
  }

  if (toIndex < 0) {
    throw new RangeError("toIndex cannot be less than zero.");
  }

  if (fromIndex > toIndex) {
    throw new RangeError("fromIndex cannot be greater than toIndex.");
  }
};

/**
 * Gets the number of trailing zeros in the specified number.
 * @param  {Number} n The number value to inspect.
 * @return {Number}   The number of trailing zeros.
 * @throws {IllegalArgumentException} if 'n' parameter is not a number.
 */
var numberOfTrailingZeros = function(n) {
  if (util.isNullOrUndefined(n)) {
    return 0;
  }

  if (typeof n !== 'number') {
    throw new IllegalArgumentException("param 'n' must be a number.");
  }

  var mask = 1;
  var result = 64;
  for (var i = 0; i < 64; i++, mask <<= 1) {
    if ((n & mask) !== 0) {
      result = i;
      break;
    }
  }
  return result;
};

/* jshint latedef: false */
/**
 * Gets a new BitSet from the specified word array.
 * @param  {Array} words An array of bits to convert into a BitSet.
 * @return {BitSet}      A new BitSet containing the specified bits.
 */
var fromWordArray = function(words) {
  if (!util.isArray(words)) {
    return null;
  }
  return new BitSet(words);
};

/**
 * An implementation of a vector of bits that grows as needed. Each component of
 * the bit set has a Boolean value. The bits of a BitSet are indexed by
 * non-negative integers. Individual indexed bits can be examined, set, or
 * cleared. One BitSet may be used to modify the contents of another through
 * logical AND, logical inclusive OR, and logical exclusive OR operations. By
 * default, all bits in the set initially have the value of false. Every BitSet
 * has a current size, which is the number of bits of space currently in use by
 * the BitSet. Note that the size is related to the implementation of a BitSet,
 * so it may change with implementation. The length of a BitSet relates to the
 * logical length of a BitSet and is defined independently of implementation.
 * Unless otherwise noted, passing a null parameter to any of the methods in a
 * BitSet will result in a ArgumentNullException.
 * @param {Number|Array} bits The initial size of the BitSet - or - an array
 * (words) to compose this instance from.
 * @throws {IllegalArgumentException} if 'bits' param is not a valid type (must
 * be a number or array of bits).
 * @throws {RangeError} if 'bits' is a number but is less than zero.
 * @constructor
 */
function BitSet(bits) {
  var BIT_INDEX_MASK = BITS_PER_WORD - 1;
  var LONG_MASK = 0x3f;

  var that = this;
  var _bits = [];
  var _wordsInUse = 0;
  var _sizeIsSticky = false;
  var self = this;

  this.name = "BitSet";

  /**
   * Every public method must preserve invariants. This method checks to see if
   * this is true using assertions. Assertion errors are thrown if any of the
   * assertions fail.
   * @private
   */
  var checkInvariants = function() {
    Assert.ok((_wordsInUse === 0) || (_bits[_wordsInUse - 1] !== 0));
    Assert.ok((_wordsInUse >= 0) && (_wordsInUse <= _bits.length));
    Assert.ok((_wordsInUse === _bits.length) || (_bits[_wordsInUse] === 0));
  };

  // Main constructor logic.
  if (util.isNullOrUndefined(bits)) {
    _bits = new Array(BITS_PER_WORD);
  }
  else {
    if (typeof bits === 'number') {
      if (bits < 0) {
        throw new RangeError("'bits' param must not be negative.");
      }
      _bits = new Array(wordIndex(bits - 1) + 1);
      _sizeIsSticky = true;
    }
    else if (util.isArray(bits)) {
      _bits = bits;
      _wordsInUse = _bits.length;
      checkInvariants();
    }
    else {
      throw new IllegalArgumentException("param 'bits' must be a number or an array of bits.");
    }
  }

  /**
   * Gets a value indicating whether is BitSet is empty.
   * @return {Boolean} true if empty; Otherwise, false.
   */
  this.isEmpty = function() {
    return (_wordsInUse === 0);
  };

  /**
   * Gets the "logical size" of this bit set: the index of the highest set bit
   * in the BitSet plus one.
   * @return {Number} The logical size of this BitSet or zero if this instance
   * contains no bits.
   */
  this.length = function() {
    if (_wordsInUse === 0) {
      return 0;
    }

    if ((_bits === null) || (_bits.length === 0)) {
      _wordsInUse = 0;
      return _wordsInUse;
    }

    var positions = numberOfTrailingZeros(_bits[_wordsInUse - 1]);
    return (BITS_PER_WORD * (_wordsInUse - 1) + (BITS_PER_WORD - positions));
  };

  /**
   * Gets the number of bits of space actually in use by this BitSet to
   * represent bit values. The maximum element in the set is the size minus the
   * first element.
   * @return {Number} The number of bits currently in this BitSet.
   */
  this.size = function() {
    return (_bits.length * BITS_PER_WORD);
  };

  /**
   * Sets the internal word count field to the logical size in words of the
   * BitSet. WARNING: This method assumes that the number of words actually in
   * use is less than or equal to the current value of the words in use field!!!
   * @private
   */
  var recalcualteWordsInUse = function() {
    var i = 0;
    for (i = _wordsInUse - 1; i >= 0; i--) {
      if (_bits[i] !== 0) {
        break;
      }
    }
    _wordsInUse = i + 1;
  };

  /**
   * Ensures that this BitSet can hold enough words.
   * @param  {Number} lastElt The minimum acceptable number of words.
   * @private
   */
  var ensureCapacity = function(lastElt) {
    var nd = [];
    if (lastElt >= _bits.length) {
      nd = new Array(lastElt + 1);
      nd = (_bits || []).concat();
      _bits = nd;
      _sizeIsSticky = false;
    }
  };

  /**
   * Ensures that the BitSet can accomodate a given word index, temporarily
   * violating the invariants. The caller must restore the invariants before
   * returning to the user, possibly using recalcualteWordsInUse().
   * @param  {Number} wordIndex The index to be accomodated.
   * @private
   */
  var expandTo = function(wordIndex) {
    var required = (wordIndex + 1);
    if (_wordsInUse < required) {
      ensureCapacity(required);
      _wordsInUse = required;
    }
  };

  /**
   * Attempts to reduce internal storage used for the bits in this BitSet.
   * Calling this method may, but is not required to, affect the value returned
   * by a subsequent call to the size() property.
   * @private
   */
  var trimToSize = function() {
    if (_wordsInUse !== _bits.length) {
      var copy = (_bits || []).concat().slice(0, _wordsInUse);
      _bits = copy;
      checkInvariants();
    }
  };

  /**
   * Gets the number of words in use.
   * @return {Number} The number of words in use.
   */
  this.getWordsInUse = function() {
    return _wordsInUse;
  };

  /**
   * Gets the internal bit array.
   * @return {Array} The internal bit array.
   */
  this.getBits = function() {
    return _bits;
  };

  /**
   * Returns the number of bits set to true in this BitSet.
   * @return {Number} The number of bits set.
   */
  this.cardinality = function() {
    var card = 0;
    var a = 0;
    var b = 0;
    for (var i = _bits.length - 1; i >= 0; i--) {
      a = _bits[i];
      // Take care of common cases.
      if (a === 0) {
        continue;
      }

      if (a === -1) {
        card += 64;
        continue;
      }

      // Successively collapse alternating bit groups into a sum.
      a = ((a >> 1) & 0x5555555555555555) + (a & 0x5555555555555555);
      a = ((a >> 2) & 0x3333333333333333) + (a & 0x3333333333333333);
      b = ((a >> 32) + a);
      b = ((b >> 4) & 0x0f0f0f0f) + (b & 0x0f0f0f0f);
      b = ((b >> 8) & 0x00ff00ff) + (b & 0x00ff00ff);
      card += ((b >> 16) & 0x0000ffff) + (b & 0x0000ffff);
    }
    return card;
  };

  /**
   * Performs a logical AND of this target BitSet with the argument BitSet. This
   * BitSet is modified so that each bit in it has the value ture if (and only
   * if) it both initially had the value true and the corresponding bit in the
   * specified BitSet also had the value true.
   * @param  {BitSet} bs A BitSet. Throws ArgumentNullException if null.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  this.and = function(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (this === bs) {
      return;
    }

    if (!(bs instanceof 'BitSet')) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    while (_wordsInUse > bs.getWordsInUse()) {
      _bits[--_wordsInUse] = 0;
    }

    for (var i = 0; i < _wordsInUse; i++) {
      _bits[i] &= bs.getBits()[i];
    }

    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Clears all of the bits in this BitSet whose corresponding bit is set in the
   * specified BitSet.
   * @param  {BitSet} bs The BitSet with which to mask this instance.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  this.andNot = function(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (!(bs instanceof 'BitSet')) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    var i = Math.min(_bits.length, bs.getBits().length);
    while (--i >= 0) {
      _bits[i] &= ~bs.getBits()[i];
    }

    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Performs a logical OR of this BitSet with the specified BitSet. This BitSet
   * is modified so that a bit in it has the value true if (and only if) it
   * either already had the value ture or the corresponding bit in the specified
   * BitSet has the value true.
   * @param  {BitSet} bs A BitSet.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  this.or = function(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (this === bs) {
      return;
    }

    if (!(bs instanceof 'BitSet')) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    var wordsInCommon = Math.min(_wordsInUse, bs.getWordsInUse());
    if (_wordsInUse < bs.getWordsInUse()) {
      ensureCapacity(bs.getWordsInUse());
      _wordsInUse = bs.getWordsInUse();
    }

    for (var i = 0; i < wordsInCommon; i++) {
      _bits[i] |= bs.getBits()[i];
    }

    if (wordsInCommon < bs.getWordsInUse()) {
      _bits = (_bits || []).concat().slice(0, _wordsInUse - wordsInCommon);
    }

    checkInvariants();
  };

  /**
   * Performs a logical XOR of this BitSet with the specified BitSet. This
   * BitSet is modified so that bit in it has the value true if (and only if)
   * one of the following statements holds true:
   * - The bit initially has the value true, and the corresponding bit in the
   * specified BitSet has the value false.
   * - The bit initially has the value false, and the corresponding bit in the
   * specified BitSet has the value true.
   * @param  {BitSet} bs A BitSet.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  this.xOr = function(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (!(bs instanceof 'BitSet')) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    // Calculate how many words which have in common with the other bit set.
    var wordsInCommon = Math.min(_wordsInUse, bs.getWordsInUse());
    if (_wordsInUse < bs.getWordsInUse()) {
      ensureCapacity(bs.getWordsInUse());
      _wordsInUse = bs.getWordsInUse();
    }

    // Perform logical XOR on words in common.
    for (var i = 0; i < wordsInCommon; i++) {
      _bits[i] ^= bs.getBits()[i];
    }

    // Copy any remaining words.
    if (wordsInCommon < bs.getWordsInUse()) {
      _bits = (_bits || []).concat().slice(0, bs.getWordsInUse() - wordsInCommon);
    }

    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Sets the bit at the specified position (index) to false, or clears the
   * entire BitSet if no value given.
   * @param  {Number} pos The index of the bit to be cleared. If null or less
   * than one, clears the entire BitSet.
   * @throws {RangeError} if pos is greater than the last index.
   */
  this.clear = function(pos) {
    if ((util.isNullOrUndefined(pos)) || (pos < 1)) {
      for (var i = 0; i < _bits.length; i++) {
        _bits[i] = 0;
      }
      _wordsInUse = 0;
    }
    else {
      if (pos > _bits.length - 1) {
        throw new RangeError("param 'pos' cannot be greater than the last index.");
      }

      var offset  = wordIndex(pos);
      if (offset >= _wordsInUse) {
        return;
      }

      _bits[offset] &= ~(1 << pos);
      recalcualteWordsInUse();
      checkInvariants();
    }
  };

  /**
   * Sets the bits from the specified 'from' index (inclusive) to the specified
   * 'to' index (exclusive) to false.
   * @param  {Number} fromIndex The starting index. Throws ArgumentNullException
   * if null. Throws IllegalArgumentException if not a number. Throws RangeError
   * if less than zero or greater than toIndex.
   * @param  {Number} toIndex   The ending index. Throws ArgumentNullException if
   * null. Throws IllegalArgumentException if not a number. Throws RangeError if
   * less than zero.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  this.clearFromTo = function(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    var startWordIndex = wordIndex(fromIndex);
    if (startWordIndex >= _wordsInUse) {
      return;
    }

    var endWordIndex = wordIndex(toIndex - 1);
    if (endWordIndex >= _wordsInUse) {
      toIndex = self.length();
      endWordIndex = _wordsInUse - 1;
    }

    var firstWordMask = LONG_MASK << fromIndex;
    var lastWordMask = LONG_MASK >> -toIndex;
    if (startWordIndex === endWordIndex) {
      // Case 1: Single word.
      _bits[startWordIndex] &= ~(firstWordMask & lastWordMask);
    }
    else {
      // Case 2: Multiple words.
      // Handle first word.
      _bits[startWordIndex] &= ~firstWordMask;

      // Handle intermediate words, if any.
      for (var i = startWordIndex + 1; i < endWordIndex; i++) {
        _bits[i] = 0;
      }

      // Handle last word.
      _bits[endWordIndex] &= ~lastWordMask;
    }

    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Public method for performing invariant checks. Every public method must
   * preserve the invariants. This method checks to see if this is true using
   * assertions. Assertion errors are thrown if any of the assertions fail.
   */
  this.doCheckInvariants = function() {
    checkInvariants();
  };

  /**
   * Creates a new object that is a copy of the current instance.
   * @return {BitSet} A new BitSet that is a copy of this instance.
   */
  this.clone = function() {
    if (_sizeIsSticky) {
      trimToSize();
    }

    try {
      return fromWordArray(_bits);
    }
    catch(e) {
      return null;
    }
  };

  /**
   * Determines whether the specified object is equal to the current BitSet.
   * @param  {Object} obj The object to compare with the current BitSet.
   * Generally, this method should be used to check against other BitSet
   * instances.
   * @return {Boolean}     true if equal; Otherwise, false.
   */
  this.equals = function(obj) {
    if (util.isNullOrUndefined(obj)) {
      return false;
    }

    if (!(obj instanceof 'BitSet')) {
      return false;
    }

    checkInvariants();
    obj.doCheckInvariants();

    if (_wordsInUse !== obj.getWordsInUse()) {
      return false;
    }

    var result = true;
    for (var i = 0; i < _wordsInUse; i++) {
      if (_bits[i] !== obj.getBits()[i]) {
        result = false;
        break;
      }
    }

    return result;
  };

  /**
   * Sets the bit at the specified index to the compliment of its current value.
   * @param  {Number} index The index of the bit to flip.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  this.flip = function(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    var offset = wordIndex(index);
    expandTo(offset);
    _bits[offset] ^= 1 << index;
    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Sets each bit from the specified "from" (inclusive) index to the specified
   * "to" (exclusive) index to the compliment of its current value.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * flip.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to flip.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  this.flipFromTo = function(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    var startWordIndex = wordIndex(fromIndex);
    var lastWordIndex = wordIndex(toIndex - 1);
    expandTo(lastWordIndex);

    var firstWordMask = LONG_MASK << fromIndex;
    var lastWordMask = LONG_MASK >> -toIndex;
    if (startWordIndex === lastWordIndex) {
      // Case 1: single word.
      _bits[startWordIndex] ^= (firstWordMask & lastWordMask);
    }
    else {
      // Case 2: multiple words.
      // Handle first word.
      _bits[startWordIndex] ^= firstWordMask;

      // Handle intermediate words, if any.
      for (var i = startWordIndex + 1; i < lastWordIndex; i++) {
        _bits[i] ^= LONG_MASK;
      }

      // Handle last word.
      _bits[lastWordIndex] ^= lastWordMask;
    }

    recalcualteWordsInUse();
    checkInvariants();
  };

  /**
   * Sets the raw bit value at the specified index. Avoid using this method
   * whenever possible. Instead use either set() or setFromTo() so as to
   * preserve invariants.
   * @param  {Number} index The index at which to set the specified bit.
   * @param  {Number|Boolean} bit   Set true or 1 to set the bit, or false or 0
   * to clear the bit.
   * @throws {IllegalArgumentException} if index is not a number - or - bit is
   * is not a number (0 or 1) or boolean.
   * @throws {RangeError} if index is less than zero or greater than the last
   * index.
   */
  this.setBitValueRaw = function(index, bit) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if ((index < 0) || (index > _bits.length - 1)) {
      throw new RangeError("index must be greater than zero and less than or " +
                            "equal to the last index in the bit set.");
    }

    if (typeof bit === 'number') {
      if (bit < 0) {
        bit = 0;
      }

      if (bit > 1) {
        bit = 1;
      }
    }
    else if (typeof bit === 'boolean') {
      if (bit === true) {
        bit = 1;
      }
      else {
        bit = 0;
      }
    }
    else {
      throw new IllegalArgumentException("bit must be a number (0 or 1) or boolean.");
    }
    _bits[index] = bit;
  };

  /**
   * Gets the value of the bit at the specified index.
   * @param  {Number} index The index at which to get the bit value.
   * @return {Boolean}       true if the requested bit is set; Otherwise, false.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  this.get = function(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    checkInvariants();
    var offset = wordIndex(index);
    return ((offset < _wordsInUse) &&
            ((_bits[index] & (1 << index)) !== 0));
  };

  /**
   * Public method for recalculating the words in use. Sets the internal word
   * count field to the logical size in words of the BitSet. WARNING: This
   * method assumes that the number of words actually in use is less than or
   * equal to the current value of the words in use field!!!
   */
  this.doRecalculateWordsInUse = function() {
    recalcualteWordsInUse();
  };

  /**
   * Returns a new BitSet composed of bits from this BitSet from the specified
   * the specified "from" (inclusive) index to the specified "to" (exclusive)
   * index.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * include.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to include.
   * @return {BitSet}           A new BitSet instance composed of the specified
   * range of bits from this instance.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  this.getFromTo = function(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    checkInvariants();

    // If no set bits in range, then return the empty BitSet.
    var len = self.length();
    if ((len <= fromIndex) || (fromIndex === toIndex)) {
      return fromWordArray(new Array(0));
    }

    // Optimize.
    if (toIndex > len) {
      toIndex = len;
    }

    var bs = new BitSet(toIndex - fromIndex);
    var targetWords = wordIndex(toIndex - fromIndex - 1) + 1;
    var sourceIndex = wordIndex(fromIndex);
    var aligned = ((fromIndex & BIT_INDEX_MASK) === 0);

    // Process all words but the last one.
    var setBit = 0;
    for (var i = 0; i < targetWords - 1; i++, sourceIndex++) {
      setBit = aligned ? _bits[sourceIndex] :
          (_bits[sourceIndex] >> fromIndex) |
          (_bits[sourceIndex + 1] << -fromIndex);
      bs.setBitValueRaw(i, setBit);
    }

    // Process last word.
    var lastWordMask = LONG_MASK >> -toIndex;
    setBit = ((toIndex - 1) & BIT_INDEX_MASK) < (fromIndex & BIT_INDEX_MASK) ?
              ((_bits[sourceIndex] >> fromIndex) |
                (_bits[sourceIndex + 1] & lastWordMask) << -fromIndex) :
                ((_bits[sourceIndex] & lastWordMask) >> fromIndex);

    bs.setBitValueRaw(targetWords - 1, setBit);
    bs.doCheckInvariants();
    bs.doRecalculateWordsInUse();
    return bs;
  };

  /**
   * Sets the bit at the specified index to true.
   * @param  {Number} index The index at which to set the bit.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  this.set = function(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    var offset = wordIndex(index);
    expandTo(offset);
    _bits[offset] |= (1 << index);  // Restores invariants;
    checkInvariants();
  };

  /**
   * Sets the bit at the specified index to the specified value.
   * @param  {Number} index The index at which to set the bit.
   * @param  {Boolean} value The value to set.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  this.setValue = function(index, value) {
    if (value) {
      self.set(index);
    }
    else {
      self.clear(index);
    }
  };

  /**
   * Sets the bits from the specified "from" index (inclusive) to the specified
   * "to" index (exclusive) to true.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * set.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to set.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  this.setFromTo = function(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    var startWordIndex = wordIndex(fromIndex);
    var endWordIndex = wordIndex(toIndex - 1);
    expandTo(endWordIndex);

    var firstWordMask = LONG_MASK << fromIndex;
    var lastWordMask = LONG_MASK >> -toIndex;
    if (startWordIndex === endWordIndex) {
      // Case 1: single word.
      _bits[startWordIndex] |= (firstWordMask & lastWordMask);
    }
    else {
      // Case 2: multiple words.
      // Handle first word.
      _bits[startWordIndex] |= firstWordMask;

      // Handle intermediate words, if any.
      for (var i = startWordIndex + 1; i < endWordIndex; i++) {
        _bits[i] = LONG_MASK;
      }

      // Handle last word (restores invariants).
      _bits[endWordIndex] |= lastWordMask;
    }

    checkInvariants();
  };

  /**
   * Sets the bits from the specified "from" index (inclusive) to the specified
   * "to" index (exclusive) to the specified value.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * set.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to set.
   * @param  {Boolean} value The value to set.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  this.setValueFromTo = function(fromIndex, toIndex, value) {
    if (value) {
      self.setFromTo(fromIndex, toIndex);
    }
    else {
      self.clearFromTo(fromIndex, toIndex);
    }
  };

  /**
   * Gets a hash code value for this BitSet. The hash code depends only on which
   * bits are set within this instance.
   * @return {Number} The hash code value for this BitSet.
   */
  this.getHashCode = function() {
    var h = 1234;
    for (var i = _bits.length; --i >= 0;) {
      h ^= _bits[i] * (i + 1);
    }

    return ((h >> 32) ^ h);
  };

  /**
   * Determines whether or not the specified BitSet has any bits set to true
   * that are also set to true in this BitSet.
   * @param  {BitSet} bs The BitSet to intersect with.
   * @return {Boolean}   true if this instance intersects with the specified
   * BitSet.
   */
  this.intersects = function(bs) {
    if (util.isNullOrUndefined(bs)) {
      return false;
    }

    if (!(bs instanceof 'BitSet')) {
      return false;
    }

    var goodBits = false;
    var i = Math.min(_bits.length, bs.getBits().length);
    while (--i >= 0) {
      if ((_bits[i] & bs.getBits()[i]) !== 0) {
        goodBits = true;
        break;
      }
    }
    return goodBits;
  };

  /**
   * Returns the index of the first bit that is set to false that occurs on or
   * after the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * @return {Number}           The index of the next clear bit; Otherwise, -1
   * if no such bit is found.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  this.nextClearBit = function(fromIndex) {
    if (fromIndex < 0) {
      throw new RangeError("'from' index cannot be less than zero.");
    }

    checkInvariants();
    var offset = wordIndex(fromIndex);
    if (offset >= _wordsInUse) {
      return fromIndex;
    }

    var result = -1;
    var w = ~_bits[offset] & (LONG_MASK << fromIndex);
    while (true) {
      if (w !== 0) {
        result = (offset * BITS_PER_WORD) + numberOfTrailingZeros(w);
        break;
      }

      if (++offset === _wordsInUse) {
        result = _wordsInUse * BITS_PER_WORD;
        break;
      }
      w = ~_bits[offset];
    }
    return result;
  };

  /**
   * Returns the index of the first bit that is set to true that occurs on or
   * after the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if less than zero.
   * @return {Number}           The index of the next set bit after the
   * specified index. If no such bit exists, then returns -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  this.nextSetBit = function(fromIndex) {
    if (fromIndex < 0) {
      throw new RangeError("'from' index cannot be less than zero.");
    }

    checkInvariants();
    var offset = wordIndex(fromIndex);
    if (offset >= _wordsInUse) {
      return -1;
    }

    var result = -1;
    var w = _bits[offset] & (LONG_MASK << fromIndex);
    while (true) {
      if (w !== 0) {
        result = (offset * BITS_PER_WORD) + numberOfTrailingZeros(w);
        break;
      }

      if (++offset === _wordsInUse) {
        break;
      }

      w = _bits[offset];
    }
    return result;
  };

  /**
   * Returns the index of the nearest bit that is set to true that occurs on or
   * before the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if less than zero.
   * @return {Number}           The index of the previous set bit, or -1 if
   * there is no such bit or if fromIndex is set to -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  this.previousSetBit = function(fromIndex) {
    if (fromIndex < 0) {
      if (fromIndex === -1) {
        return -1;
      }
      throw new RangeError("'from' index cannot be less than zero.");
    }

    checkInvariants();
    var offset = wordIndex(fromIndex);
    if (offset >= _wordsInUse) {
      return (self.length() - 1);
    }

    var result = -1;
    var w = _bits[offset] & (LONG_MASK >> -(fromIndex + 1));
    while (true) {
      if (w !== 0) {
        result = (offset + 1) * BITS_PER_WORD - 1 - numberOfTrailingZeros(w);
        break;
      }

      if (offset-- === 0) {
        break;
      }

      w = _bits[offset];
    }
    return result;
  };

  /**
   * Returns the index of the nearest bit that is set to false that occurs on or
   * before the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if fromIndex is less than -1.
   * @return {Number}           The index of the previous clear bit, or -1 if
   * there is no such bit or fromIndex is -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  this.previousClearBit = function(fromIndex) {
    if (fromIndex < 0) {
      if (fromIndex === -1) {
        return -1;
      }
      throw new RangeError("'from' index cannot be less than zero.");
    }

    checkInvariants();
    var offset = wordIndex(fromIndex);
    if (offset >= _wordsInUse) {
      return fromIndex;
    }

    var result = -1;
    var w = ~_bits[offset] & (LONG_MASK >> -(fromIndex + 1));
    while (true) {
      if (w !== 0) {
        result = (offset + 1) * BITS_PER_WORD - 1 - numberOfTrailingZeros(w);
        break;
      }

      if (offset-- === 0) {
        break;
      }

      w = ~_bits[offset];
    }
    return result;
  };

  /**
   * This method is used for efficiency. It checks to see if this instance
   * contains all the same bits as the specified BitSet.
   * @param  {BitSet} otherBS The BitSet to check.
   * @return {Boolean}         true if the specified BitSet contains all the same
   * bits; Otherwise, false.
   */
  this.containsAll = function(otherBS) {
    if (util.isNullOrUndefined(otherBS)) {
      return false;
    }

    var result = true;
    for (var i = 0; i < otherBS.getBits().length; i++) {
      if ((_bits[i] & otherBS.getBits()[i]) !== otherBS.getBits()[i]) {
        result = false;
        break;
      }
    }
    return result;
  };

  /**
   * Returns a String that represents the current BitSet. For every index for
   * which this BitSet contains a bit in the set state, the decimal
   * representation of that index is included in the result. Such indices are
   * listed in order from lowest to highest, separated by a ", " (a comma and a
   * space) and surrounded by braces, resulting in the usual mathematical
   * notation for a set of integers.
   * @return {String} A String that represents the current BitSet.
   */
  this.toString = function() {
    var sb = new StringBuilder();
    sb.append("{");

    var first = true;
    var bit = 0;
    var word = 0;
    for (var i = 0; i < _bits.length; ++i) {
      bit = 1;
      word = _bits[i];
      if (word === 0) {
        continue;
      }

      for (var j = 0; j < 64; ++j) {
        if ((word & bit) !== 0) {
          if (!first) {
            sb.append(", ");
          }
          sb.append((64 * i + j).toString());
          first = false;
        }
        bit <<= 1;
      }
    }

    sb.append("}");
    return sb.toString();
  };

  /**
   * Returns a new array of bits containing all the bits in this BitSet.
   * @return {Array} An array of bits containing little-endian representation of
   * all the bits in this BitSet.
   */
  this.toBitArray = function() {
    return (_bits || []).concat();
  };
}


BitSet.prototype.constructor = BitSet;


/**
 * Returns a new BitSet containing all the bits in the specified array of
 * numbers (bits).
 * @param  {Array} words The array of bits to construct a BitSet from. If null,
 * then this function will return null.
 * @return {BitSet}      A new BitSet containing the specified array of bits.
 * @throws {IllegalArgumentException} if not an array.
 */
var valueOf = function(words) {
  if (util.isNullOrUndefined(words)) {
    return null;
  }

  if (!util.isArray(words)) {
    throw new IllegalArgumentException("param 'words' must be an array of bits.");
  }

  var n = 0;
  for (n = words.length; n > 0 && words[n - 1] === 0; n--) {
  }

  var wordsCopy = (words || []).concat();
  return new BitSet(wordsCopy);
};
/* jshint latedef: true */

module.exports.WordIndex = wordIndex;
module.exports.CheckRange = checkRange;
module.exports.valueOf = valueOf;
module.exports.numberOfTrailingZeros = numberOfTrailingZeros;
module.exports.fromWordArray = fromWordArray;
module.exports.BitSet = BitSet;
