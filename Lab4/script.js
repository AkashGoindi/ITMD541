const searchInput = document.getElementById("searchInput");
const resultsDropdown = document.getElementById("results-dropdown");
const resultsList = resultsDropdown.querySelector("ul");
const locationSearch = document.getElementById("locationSearch");
const errorMsg = document.getElementById("error_msg");
const loadingMsg = document.getElementById("loading_msg");
let selectedLocation = {};


  // Debounce function
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    // Event listener with debounce on input changes
    const debouncedSearch = debounce(async () => {
      const searchTerm = searchInput.value.trim();
      // Clear previous results
      resultsList.innerHTML = '';

      if (searchTerm.length === 0) {
        resultsDropdown.style.display = 'none';
        errorMsg.innerHTML="";
        return;
      }
      if(errorMsg.innerHTML.length) {
        errorMsg.innerHTML="";
      }
      try {
        // Make API call to geolocation API
        const results = await searchLatLon();
    
        // Display results in the dropdown
  
      } catch (error) {
        console.error('Error:', error);
      }
    }, 1000); // Debounce for 1 second

  searchInput.addEventListener("input", debouncedSearch);

function displayResults(results) {
  results.forEach(result => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.textContent = result.display_name;

    listItem.addEventListener("click", async() => {
      document.getElementById('loader').style.display = 'block';
      selectedLocation = result;
      locationSearch.innerHTML= " "+ result.display_name;
      document.getElementById('ss_info_blank').style.display = 'none';
      document.getElementById('ss_info').style.display = 'block';

      // Handle selection (you can update the UI or perform other actions here)
      const { lat, lon } = selectedLocation;
      const today = await apicall(lat, lon, 'today');
      const tomorrow = await apicall(lat, lon, 'tomorrow');
      displayLatLan(today, 'today');
      displayLatLan(tomorrow, 'tomorrow');
      document.getElementById('loader').style.display = 'none';
      // Hide the dropdown
      resultsDropdown.style.display = 'none';

      // Clear the input field
      searchInput.value = '';
    });

    resultsList.appendChild(listItem);
  });
  // Show the dropdown
  resultsDropdown.style.display = 'block';
}

async function apicall(latitude, longitude, day) {
  let res = await getDetails(latitude, longitude, day);
  if (res.status) {
    return res.data;
  } else {
    // return {data: null, status: false, message: res.body};
    console.log("jhb");
  }
}


function fetchCurrentLoc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const today = await apicall(lat, lon, 'today');
      const tomorrow = await apicall(lat, lon, 'tomorrow');
      displayLatLan(today, 'today');
      displayLatLan(tomorrow, 'tomorrow');
      document.getElementById('ss_info_blank').style.display = 'none';
      document.getElementById('ss_info').style.display = 'block';
      locationSearch.innerHTML = " Current Location";
    });
  } else {
    alert("Geolocation is not supported by this browser.");
    document.getElementById('loader').style.display = 'none';
  }
}

async function searchLatLon() {
  const str = document.getElementById('searchInput').value;
  if (!str) return alert("Please Enter Valid Location !");
  let res = await searchPlace(str);
  const { data, status } = res;
  if (status) {
    if (data && data.length) {
      displayResults(res.data);
    } else {
      // alert(`Nothing found for search ${str}`)
      // const listItem = document.createElement("li");
      // listItem.classList.add("list-group-item");
      // listItem.textContent = `Nothing found for search ${str}`;
      // resultsList.appendChild(listItem);
      errorMsg.innerHTML = `Nothing found for search: ${str}`;
    }
  } else {
    errorMsg.innerHTML = `Unable to fetch location: ${res.message}`;
  }
}


function displayLatLan(data, key) {
  document.getElementById(`${key}_sunrise`).innerHTML = data.sunrise;
  document.getElementById(`${key}_sunset`).innerHTML = data.sunset;
  document.getElementById(`${key}_dawn`).innerHTML = data.dawn;
  document.getElementById(`${key}_dusk`).innerHTML = data.dusk;
  // document.getElementById(`${key}_length`).innerHTML = data.day_length;
  // document.getElementById(`${key}_timezone`).innerHTML = data.timezone;
}