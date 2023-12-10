const main = document.querySelector('main');
const mainPage = document.getElementById("main-page");
const filterByUni = document.querySelectorAll('#filter-btn')
const seeAll = document.getElementById('see-all-new');
const searchBtn = document.getElementById('searchBtn');

filterByUni.forEach((button) => {
    button.addEventListener("click", function () {

        if (this.value !== "all") {
            window.location.href = `/filter-page.html?filterType=university&filterValue=${this.value}`;
        }
        else {
            window.location.href = `/filter-page.html?filterType=all&filterValue=همه دوره ها`;
        }

    });
});

seeAll.addEventListener('click', () => {
    window.location.href = `/filter-page.html?filterType=new&filterValue=جدید ترین دوره ها`;
})

const url = "http://localhost:3000/course"
renderMainPage(url);

function renderMainPage(url) {
    fetch(url)
        .then((Response) => Response.json())
        .then((data) => {
            itemBuilder(data, main);
        })
        .catch((error) => {
            console.error("Error:", error);
        })
}

function itemBuilder(data, element) {
    let items = "";
    data.sort((a, b) => b.year - a.year);
    for (let i = 0; i < 6; i++) {
        items += `<div id="item" class="w-full bg-white rounded-3xl p-6 flex items-center justify-center gap-5 border-[3px] border-gray-900">
        <div class=" bg-[#F3F3F3] flex items-center justify-center rounded-3xl p-5">
            <img class="w-20" src="${data[i].image}" alt="">
        </div>
        <div class="flex flex-col items-end w-full gap-2">
                <span class="w-full  text-xl font-bold">${data[i].field}</span>
                <span class="w-full text-lg font-bold">${data[i].university}</span>
                <span class="w-full text-lg ">${data[i].major}</span>
                <span class="w-full text[#706E6B]">سال:${data[i].year} | ظرفیت: ${data[i].capacity} نفر</span>
        </div>
    </div>`
    }
    element.innerHTML = items;
}

searchBtn.addEventListener('click', () => {
    window.location.href = `/filter-page.html?filterType=all&filterValue=همه دوره ها`;
})