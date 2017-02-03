#!/bin/sh

pushd `dirname $0` > /dev/null
HOME=`pwd`
popd > /dev/null
cd '$HOME'
npm run build
exit