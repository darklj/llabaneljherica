import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY3wbTujFWX0W774FtNnG74qk5hiT_Qqo",
  authDomain: "fir-709b6.firebaseapp.com",
  projectId: "fir-709b6",
  storageBucket: "fir-709b6.appspot.com",
  messagingSenderId: "674222738457",
  appId: "1:674222738457:web:78ffffcb945162c44c6e88",
  measurementId: "G-3FGXGG9XY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to submit Lakorn series information to Firebase
document.getElementById('LakornForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const seriesName = document.getElementById('seriesName').value;
  const episodeNumber = document.getElementById('episodeNumber').value;
  const numberWatched = document.getElementById('numberWatched').value;

  const seriesRef = ref(db, 'lakornSeries/' + episodeNumber);

  set(seriesRef, {
      seriesName: seriesName,
      episodeNumber: episodeNumber,
      numberWatched: numberWatched,
  }).then(() => {
      alert('Series information added successfully!');
      document.getElementById('LakornForm').reset();
  }).catch((error) => {
      console.error('Error adding series information:', error);
      alert('Failed to add series information.');
  });
});

// Function to download Firebase Lakorn data as an Excel file
function downloadLakornData(filteredEpisodeNumber = null) {
  let seriesRef = ref(db, 'lakornSeries/');

  if (filteredEpisodeNumber) {
      seriesRef = query(seriesRef, orderByChild('episodeNumber'), equalTo(filteredEpisodeNumber));
  }

  get(seriesRef).then((snapshot) => {
      if (snapshot.exists()) {
          const data = snapshot.val();
          const rows = Object.values(data).map(item => ({
              Series_Name: item.seriesName,
              Episode_Number: item.episodeNumber,
              Number_Watched: item.numberWatched
          }));

          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "LakornInformation");

          // Generate Excel file and trigger the download
          const fileName = filteredEpisodeNumber ? '${filteredEpisodeNumber}_Series_information.xlsx : Series_information.xlsx':
          XLSX.writeFile(wb, fileName);
      } else {
          alert('No data available to download.');
      }
  }).catch((error) => {
      console.error('Error fetching data: ', error.message);
      alert('Failed to download data: ' + error.message);
  });
}

// Event listener for downloading all data
document.getElementById('downloadAllBtn').addEventListener('click', function() {
  downloadLakornData();
});

// Event listener for downloading data filtered by episode number
document.getElementById('downloadByEpisodeNumberBtn').addEventListener('click', function() {
  const episodeNumber = prompt("Enter the episode number to download data for:");
  if (episodeNumber) {
      downloadLakornData(episodeNumber);
  }
});
www.gstatic.com
  
  