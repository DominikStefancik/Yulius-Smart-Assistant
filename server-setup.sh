wget -O yul https://github.com/DominikStefancik/Yulius-Smart-Assistant/archive/master.zip
unzip yul -d yulius
cd yulius/Yulius-Smart-Assistant-master/web-client/
yarn && yarn build
cd ../node-server/
yarn
