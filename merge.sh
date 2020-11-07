index=0
for f in data/fruits-360/Training/*
do
 fruitFolder=$(echo $f | rev | cut -d'/' -f 1 | rev )
 fruitFolderName=$(echo $fruitFolder | cut -d' ' -f1)
 mkdir -p mergedData/"$fruitFolderName"
 rsync -a --backup --suffix="$index" "$f"/ mergedData/"$fruitFolderName"
 index=$((index+1))
done
