#! /bin/bash

front="---\nlayout: base\ntitle: Home\n---"


for f in $(find . -name '*.md'); do
  echo -e $front | cat - "${f}" > temp && mv temp "${f}"
done
