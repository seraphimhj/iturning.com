for file in 1 2 3 4
do
    file=hr00$file
    cd $file;
    mv $file.jpg origin.jpg 
    mv ${file}_350.jpg size_350.jpg 
    mv ${file}_800.jpg size_800.jpg 
    cd -
done
