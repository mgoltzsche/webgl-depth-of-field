#!/bin/bash

#tar cjf SphereTesselation.tar.bz2 ./
#ssh -t -p23232 max@algorythm.de 'rm -rf /home/max/WebGLSceneGraph | mkdir /home/max/WebGLSceneGraph'
rsync -r --progress --rsh='ssh -p23232' ./ algorythm.de:~/WebGLSceneGraph
ssh -t -p23232 max@algorythm.de 'sudo rm -rf /var/www/WebGLSceneGraph | sudo mv /home/max/WebGLSceneGraph /var/www/WebGLSceneGraph; chmod -R 755 /var/www/WebGLSceneGraph'
