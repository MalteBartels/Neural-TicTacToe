echo "Installing node modules..."
npm install
echo "Finished!"
echo "Installing browserify globally... (Needed to run in the browser!)"
sudo npm install browserify -g
echo "Finished!"
echo "Running browserify.."
browserify TicTacToe.js -o script.js
echo "Finished! You're ready to go now!"
