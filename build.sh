#!/bin/sh

pushd `dirname $0` > /dev/null
HOME=`pwd`
popd > /dev/null
cd '$HOME'
grunt --force -v
exit