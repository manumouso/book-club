clear
echo " ____              _     ____ _       _     "
echo "| __ )  ___   ___ | | __/ ___| |_   _| |__  "
echo "|  _ \ / _ \ / _ \| |/ / |   | | | | | '_ \ "
echo "| |_) | (_) | (_) |   <| |___| | |_| | |_) |"
echo "|____/ \___/ \___/|_|\_\\____|_|\__,_|_.__/ "
echo ""
cd back
echo "**********************************************************"
echo "          Installing dependencies for backend..."
echo "**********************************************************"
npm install
npm i yarn --global
yarn
echo "**********************************************************"
echo "              Starting docker db container..."
echo "**********************************************************"
yarn db:dev:restart
echo "**********************************************************"
echo "              Filling database with data..."
echo "**********************************************************"
npx prisma db seed
echo "**********************************************************"
echo "              Starting backend server..."
echo "**********************************************************"
START yarn start:dev
cd ../front/bc-front
echo "**********************************************************"
echo "              Installing dependencies for frontend..."
echo "**********************************************************"
npm install
echo "**********************************************************"
echo "              Starting frontend server..."
echo "**********************************************************"
START npm start
echo ""
echo "Starting went succesfull!"