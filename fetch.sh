pip install kaggle
apt-get install unzip

export KAGGLE_USERNAME=kristerlooga
export KAGGLE_KEY=495251af0bb98c453b3b862f44c0dee5

echo here
kaggle datasets download moltean/fruits

unzip fruits.zip -d data
