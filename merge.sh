#!/bin/bash
array=("Training" "Test")
index=0
for i in "${array[@]}"
do
	for f in data/fruits-360/"$i"/*
	do
	 fruitFolder=$(echo $f | rev | cut -d'/' -f 1 | rev )
	 fruitFolderName=$(echo $fruitFolder | cut -d' ' -f1)
	 mkdir -p mergedData/"$i"/"$fruitFolderName"
	 rsync -a --backup --suffix="$index" "$f"/ mergedData/"$i"/"$fruitFolderName"
	 index=$((index+1))
	done
done
