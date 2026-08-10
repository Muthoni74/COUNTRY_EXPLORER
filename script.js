// script.js - Country Explorer logic

const PAGE_SIZE = 12;
let displayCount = PAGE_SIZE;

const searchInput = document.getElementById('search-input');
const regionSelect = document.getElementById('region-select');
const populationInput = document.getElementById('population-input');
const countryCardsContainer = document.getElementById('country-cards-container');
const showMoreBtn = document.getElementById('show-more-btn');

// Populate region dropdown with unique regions found in the data
function populateRegions() {
    const regions = [...new Set(data.map(country => country.region).filter(Boolean))].sort();
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

// Apply search, region, and population filters
function getFilteredCountries() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedRegion = regionSelect.value;
    const minPopulation = Number(populationInput.value);

    if (isNaN(minPopulation) || minPopulation < 0) {
        return null;
    }

    return data.filter(country => {
        const commonName = (country.name.common || '').toLowerCase();
        const officialName = (country.name.official || '').toLowerCase();

        const matchesSearch =
            searchTerm === '' ||
            commonName.includes(searchTerm) ||
            officialName.includes(searchTerm);

        const matchesRegion =
            selectedRegion === 'all' || country.region === selectedRegion;

        const matchesPopulation = (country.population || 0) >= minPopulation;

        return matchesSearch && matchesRegion && matchesPopulation;
    });
}

function populateCountryCards(countries) {
    countryCardsContainer.innerHTML = '';

    if (!countries || countries.length === 0) {
        countryCardsContainer.innerHTML = '<p style="padding:20px;">No country found matching the search criteria.</p>';
        showMoreBtn.style.display = 'none';
        return;
    }

    const toShow = countries.slice(0, displayCount);
    toShow.forEach(country => {
        const card = createCard(country);
        card.addEventListener('click', () => countryCardHandler(country));
        countryCardsContainer.appendChild(card);
    });

    const remaining = countries.length - toShow.length;
    showMoreBtn.style.display = remaining > 0 ? 'inline-block' : 'none';
}

function filterData() {
    const filteredCountries = getFilteredCountries();
    populateCountryCards(filteredCountries);
}

function showMoreHandler() {
    displayCount += 10;
    filterData();
}

function getFormattedNames(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
        return '';
    }

    return items
        .map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            return item.name || '';
        })
        .filter(Boolean)
        .join(', ');
}

function countryCardHandler(country) {
    const currencies = getFormattedNames(country.currencies);
    const languages = getFormattedNames(country.languages);
    const name = country.name.common || '';
    const officialName = country.name.official || '';
    const capital = country.capital || '';
    const region = country.region || '';
    const subregion = country.subregion || '';
    const population = country.population != null ? String(country.population) : '';
    const flag = country.flags.png || country.flags.svg || '';

    const queryString = [
        `name=${encodeURIComponent(name)}`,
        `officialName=${encodeURIComponent(officialName)}`,
        `capital=${encodeURIComponent(capital)}`,
        `region=${encodeURIComponent(region)}`,
        `subregion=${encodeURIComponent(subregion)}`,
        `population=${encodeURIComponent(population)}`,
        `currencies=${encodeURIComponent(currencies)}`,
        `languages=${encodeURIComponent(languages)}`,
        `flag=${encodeURIComponent(flag)}`
    ].join('&');

    window.location.href = `details.html?${queryString}`;
}

// Build a single card for a country
function createCard(country) {
    const card = document.createElement('div');
    card.className = 'country-card';

    const flagSrc = country.flags.png || country.flags.svg || '';
    const officialName = country.name.official || country.name.common || 'Unknown';

    card.innerHTML = `
        <img class="flag" src="${flagSrc}" alt="Flag of ${officialName}" onerror="this.style.display='none'">
        <h3>${officialName}</h3>
        <p><strong>Population:</strong>${(country.population || 0).toLocaleString()}</p>
        <p><strong>Capital:</strong>${country.capital || 'N/A'}</p>
        <p><strong>Region:</strong>${country.region || 'N/A'}</p>
    `;

    card.addEventListener('click', () => countryCardHandler(country));
    return card;
}

// Render the current page of filtered countries
function render() {
    filterData();
}

function resetAndRender() {
    displayCount = PAGE_SIZE;
    filterData();
}

// Event listeners
searchInput.addEventListener('input', resetAndRender);
regionSelect.addEventListener('change', resetAndRender);
populationInput.addEventListener('input', resetAndRender);
showMoreBtn.addEventListener('click', showMoreHandler);

// Init
populateRegions();
render();

