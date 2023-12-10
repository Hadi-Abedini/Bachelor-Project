const filterMain = document.querySelector('main');
const filterTitle = document.getElementById('filter-title');
const search = document.getElementById('search');
const urlParams = new URLSearchParams(window.location.search);
const yearRangeInput = document.getElementById('year-range');
const filterType = urlParams.get('filterType');
const filterValue = urlParams.get('filterValue');

filterTitle.innerHTML = filterValue;
document.getElementById('year-range-label').innerHTML = `سال برگزاری : ${yearRangeInput.value}`

let url = `http://localhost:3000/course?${encodeURIComponent(filterType)}=${encodeURIComponent(filterValue)}&year_gte=${1388}&year_lte=${1401}`;

renderFilterPage(url);

function renderFilterPage(url) {
    fetch(url)
        .then((Response) => Response.json())
        .then((data) => {
            // console.log(data);
            itemBuilder(data, filterMain);
        })
        .catch((error) => {
            console.error("Error:", error);
        })
}

function itemBuilder(data, element) {
    let items = "";
    data.sort((a, b) => b.year - a.year)
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].isEmployees);
            items += `<div id="item" class="${data[i].isEmployees == true ? "bg-[#b9bee4]" : "bg-white"}  max-h-[181px] rounded-3xl p-6 flex items-center justify-center w-[100%] gap-5 border-[3px] border-gray-900">
            <div class=" bg-[#F3F3F3] flex items-center justify-center rounded-3xl p-5">
                <img class="w-20" src="${data[i].image}" alt="">
            </div>
            <div class="flex flex-col items-start w-full gap-2">
                    <span class="line-clamp-1 text-xl font-bold">${data[i].field}</span>
                    <span class="line-clamp-1 text-lg font-bold">${data[i].university}</span>
                    <span class="line-clamp-1 text-lg ">${data[i].major}</span>
                    ${data[i].isEmployees ? '<span class="line-clamp-1 ">مخصوص شاغلین</span>' : ""}
                    <span class="text[#706E6B]">سال:${data[i].year} | ظرفیت: ${data[i].capacity} نفر</span>
            </div>
        </div>`
        }
    }
    else {

        items = `<span class="text-xl font-bold">چیزی برای نمایش وجود ندارد!</span>`
    }
    element.innerHTML = items;
}


let debounceTimeout;
const debounce = (func, delay) => {
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(context, args), delay);
    }
}

search.addEventListener('input', debounce((e) => {

    renderFilterPage(url + `&q=${e.target.value}`);
}, 300));

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
    window.location.href = `/main.html`;
})

yearRangeInput.addEventListener('input', function () {
    document.getElementById('year-range-label').innerHTML = `سال برگزاری : ${this.value}`
});


renderFilterSection("fields", "major-checkboxes");
renderFilterSection("universities", "uni-checkboxes");

function renderFilterSection(type, id) {
    fetch("http://localhost:3000/" + type)
        .then((Response) => Response.json())
        .then((data) => {
            console.log(data);
            filterItemBuilder(id, data, type);
        })
        .catch((error) => {
            console.error("Error:", error);
        })
}
function filterItemBuilder(id, data, type) {
    const elem = document.getElementById(id);
    let items = "";
    if (type === "universities") {
        for (let i = 0; i < data.length; i++) {
            items += `<div id=${data[i].id + type} class="flex items-center mb-4">
            <input id="default-checkbox" type="checkbox" value="${data[i].university}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${data[i].university}</label>
        </div>`
        }
    }
    else if (type === "fields") {
        for (let i = 0; i < data.length; i++) {
            items += `<div id=${data[i].id + type} class="flex items-center mb-4">
            <input id="default-checkbox" type="checkbox" value="${data[i].field}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${data[i].field}</label>
        </div>`
        }
    }
    elem.innerHTML = items;
}

function getCheckedValues(containerId) {
    const checkboxes = document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}
document.getElementById('apply-filters-btn').addEventListener('click', function () {
    // Array to store selected values
    const selectedUni = [];
    const selectedMajor = [];

    function handleCheckboxChange(containerId, type) {
        if (type === "uni") {
            selectedUni.push(...getCheckedValues(containerId));
        }
        else {
            selectedMajor.push(...getCheckedValues(containerId));
        }
    }

    handleCheckboxChange('major-checkboxes', 'major');
    handleCheckboxChange('uni-checkboxes', 'uni');

    for (let i = 0; i < selectedUni.length; i++) {
        selectedUni[i] = `university=${encodeURIComponent(selectedUni[i])}`
    } for (let i = 0; i < selectedMajor.length; i++) {
        selectedMajor[i] = `field=${encodeURIComponent(selectedMajor[i])}`
    }

    const filterUni = selectedUni.join('&');
    const filterMajor = selectedMajor.join('&');
    const uniQuery = filterUni;
    const majorQuery = filterMajor;

    const queries = [uniQuery, majorQuery];


    url = `http://localhost:3000/course?${queries.join('&')}&year_gte=1388&year_lte=${yearRangeInput.value}`;
    renderFilterPage(url);
    filterTitle.innerHTML = 'رشته ها';
});

