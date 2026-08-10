function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    let encodedValue = params.get(name);
    let decodedValue = decodeURIComponent(encodedValue);
    return decodedValue;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || 'N/A';
    }
}

function initDetailPage() {
    const name = decodeURIComponent(getQueryParam('name') || '');
    const officialName = decodeURIComponent(getQueryParam('officialName') || '');
    const capital = decodeURIComponent(getQueryParam('capital') || '');
    const region = decodeURIComponent(getQueryParam('region') || '');
    const subregion = decodeURIComponent(getQueryParam('subregion') || '');
    const population = decodeURIComponent(getQueryParam('population') || '');
    const currencies = decodeURIComponent(getQueryParam('currencies') || '');
    const languages = decodeURIComponent(getQueryParam('languages') || '');
    const flag = decodeURIComponent(getQueryParam('flag') || '');

    const hasData = name || officialName || capital || region || subregion || population || currencies || languages || flag;

    if (!hasData) {
        document.getElementById('details-content').style.display = 'none';
        document.getElementById('no-data-message').classList.remove('hidden');
        return;
    }

    setText('country-name', name);
    setText('country-official-name', officialName);
    setText('country-capital', capital);
    setText('country-region', region);
    setText('country-subregion', subregion);
    setText('country-population', population ? Number(population).toLocaleString() : 'N/A');
    setText('country-currencies', currencies);
    setText('country-languages', languages);

    const flagImg = document.getElementById('country-flag');
    if (flag && flagImg) {
        flagImg.src = flag;
        flagImg.alt = `Flag of ${name}`;
    } else if (flagImg) {
        flagImg.style.display = 'none';
    }

    document.getElementById('back-btn').addEventListener('click', backButtonHandler);
}

function backButtonHandler() {
    window.location.href = 'index.html';
}

window.addEventListener('DOMContentLoaded', initDetailPage);
