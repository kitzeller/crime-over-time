#!/bin/bash

CURRDIR=$(pwd)

for i in $CURRDIR/data/*.zip; do
  unzip -o $i -d $CURRDIR/data
  ##  find the next zip folder relating to v|   replace the WSL path with a windows path (to run within psql) |  run the command in psql
  find $CURRDIR/data/ascii -iname drug*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy drug from '"%"' with header csv delimiter E'$'"
  find $CURRDIR/data/ascii -iname demo*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy demo from '"%"' with header csv delimiter E'$'"
  find $CURRDIR/data/ascii -iname indi*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy indi from '"%"' with header csv delimiter E'$'"
  find $CURRDIR/data/ascii -iname outc*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy outc from '"%"' with header csv delimiter E'$'"
  find $CURRDIR/data/ascii -iname rpsr*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy rpsr from '"%"' with header csv delimiter E'$'"
  find $CURRDIR/data/ascii -iname ther*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy ther from '"%"' with header csv delimiter E'$'" 
  find $CURRDIR/data/ascii -iname reac*.txt | sed -r 's/\/mnt\/c\//\C\:\//' |xargs -I % sudo -u qwertey6 /mnt/c/Program\ Files/PostgreSQL/10/bin/psql.exe --dbname=faers2 -U qwertey6 --command="\copy reac from '"%"' with header csv delimiter E'$'"
  rm -rf $CURRDIR/data/ascii
  rm $CURRDIR/data/ascii/*.pdf
done
