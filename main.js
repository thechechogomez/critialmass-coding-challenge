let city_links;

/**
 * On load event fired when the page has loaded. When the event is fired an HTTP call is made (simulated)
 * to get the cities to display. Once the cities are retrieved the cities list item elements are created and added to 
 * the unordered list. Finally a click event if fired on the first item to be selected as default. 
 */

window.onload = async () => {
  let cities
  try {
    cities = await getCities();
  } catch {
    window.alert("An error ocurred!")
  }
  if (cities) {
    const navbar_ul = document.getElementById("navbar_list");
    cities.forEach((city) => createCityItem(city, navbar_ul));
    city_links = document.querySelectorAll("li.navbar__item");
    city_links[0].click();
  }
};

// This funtion simulates a backend call to get the citites
const getCities = async () => {
  const response = await fetch("./navigation.json")
    .then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error("error")
      }
      return response
    })
    .catch(() => {
      throw new Error("Error")
    });
  const cities = await response.json();
  return cities.cities;
};

/**
 * This function creates an list item element with a anchor element child containing 
 * the city name and a hyperlink reference with the corresponding section. 
 *
 * @param {Object} city - City object containing the city name and the city section/id
 * @param {HTMLElement} navbar_ul - The navbar unorder list element that will contain the city list items
 */

const createCityItem = (city, navbar_ul) => {
  // The list item and the anchor elements are created
  const city_li = document.createElement("li");
  const city_a = document.createElement("a");

  // The properties of the anchor element are set with the city object and corresponding class names
  city_a.innerText = city.label;
  city_a.href = `#${city.section}`;
  city_a.classList.add("navbar__link");

  // The anchor element is added inside the list item element, the list item class name is set,
  // and the onlick property 
  city_li.appendChild(city_a);
  city_li.classList.add("navbar__item");

  // The onlick callback function is set on the list element
  city_li.onclick = (event) => handleClickCityItem(event, city_li);

  // The list element is added to the unordered list element
  navbar_ul.appendChild(city_li);
};

/**
 * This function handles the click event fired when the user clicks on a list item.
 * 
 * @param event - The default event passed to the function when the users clicks on the list item
 * @param {HTMLElement} city_li - The list element of the city that the user clicked on
 */
const handleClickCityItem = (event, city_li) => {
  event.preventDefault();
  removeActiveLink();
  addActiveLink(city_li);
  setMovingBorderPosition(city_li);
};

// This funciton removes the active class from all links to enusure only one link is active a time
const removeActiveLink = () => {
  city_links.forEach((link) => {
    link.classList.remove("navbar__item--active");
  });
};

/**
 * This function adds the active class to the list item the user clicked on
 * 
 * @param {HTMLElement} city_li - The city list item the user clicked
 */
const addActiveLink = (city_li) => {
  city_li.classList.add("navbar__item--active");
};

/**
 * This function sets the postion of the moving border / slider at the bottom of the navbar using the
 * list item the user clicked on as a reference. 
 * 
 * @param {HTMLElement} city_li - The city list item the user clicked
 */
const setMovingBorderPosition = (city_li) => {
  // The slider / moving border element is selected using the element's id
  const slider = document.getElementById("navbar__slider");
  // The slider's height and width is set using the city list item's offset properties
  slider.style.left = `${city_li.offsetLeft}px`;
  slider.style.width = `${city_li.offsetWidth}px`;
};

/**
 * This funciton debounces a callback funtion so as to minimize the ammount of times the callback function is 
 * fired. 
 * 
 * @param {Function} callback - The callback funtion that should be debounced
 * @param {number} timeout - Optional param that sets the debounce time. 
 * 
 */
const debounce = (callback, timeout = 100) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(callback, timeout);
  };
};

/**
 * Window resize event fired when the screen is resized. When the event is fired, the position of the slider / moving border
 * is reset using the updated position of the selected list item. 
 */
window.onresize = debounce(() => {
  const city_li = document.querySelector(".navbar__item--active");
  setMovingBorderPosition(city_li);
});
