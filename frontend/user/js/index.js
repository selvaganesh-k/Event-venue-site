document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const authLink = document.querySelector('#authLink');
    const userIcon = document.querySelector('#userIcon');

    if (loggedInUser) {
        if (loggedInUser.isAdmin) {
            window.location.href = '../admin/index.html';
        } else {
            userIcon.innerHTML = `${loggedInUser.name.charAt(0).toUpperCase()}`;
            userIcon.style.color = 'white';
            userIcon.style.padding = '5px 7px';
            userIcon.style.backgroundColor = "#DF3311";
            userIcon.style.border = '2px solid #DF3311';
            userIcon.style.borderRadius = '50%';
            userIcon.style.marginRight = "5px";

            authLink.textContent = 'Logout';
            authLink.href = '#'
            authLink.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                alert('Logged out successfully!');
                window.location.href = '../auth.html';
            });
        }
    }
});

function checkValidUser(loggedInUser){
    if(loggedInUser){
        window.location.href='./booknow.html';
    }
    else{
        window.location.href='../auth.html';
    }
}
const showsList = document.querySelector('#Upcoming-shows-list');
function displayConcertCards(concerts) {
    showsList.innerHTML = '';

    if (concerts.length === 0) {
        showsList.innerHTML = `<p>No concerts available.</p>`;
        return;
    }
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    concerts.forEach(concert => {
        const showCard = document.createElement('div');
        showCard.classList.add('card');
        console.log(`Image URL: http://localhost:5000/${concert.image}`);
        showCard.innerHTML = `
            <div class="card-img"><img src="http://localhost:5000/${concert.image}" alt="${concert.concertName}"></div>
            <div class="card-text">
                <h3>${concert.concertName}</h3>
                <p><strong>Artists:</strong> ${concert.artists}</p>
                <p>${concert.description}</p>
            </div>
            <div class="card-footer">
            <div class="left">
                <p><strong>Start Date:</strong> ${new Date(concert.eventDateTime).toLocaleString()}</p>
                <p class="end-date"><strong>Ticket Closing Date:</strong> ${new Date(concert.endDate).toLocaleDateString()}</p>
            </div>
            <div class="right">
                <a href="./booknow.html?id=${concert._id}" onclick="checkValidUser(${loggedInUser})" target="_blank" class="book-now-btn">Book Now</a>
            </div>
            </div>
            
        `;
        showsList.appendChild(showCard);
    });
}

async function loadShows() {
    await axios.get('http://localhost:5000/ems/allConcerts')
        .then(response => {
            if (response.status === 200) {
                displayConcertCards(response.data);
            }
            else {
                showsList.innerHTML = 'Failed to load shows';
            }
        })
        .catch(error => {
            showsList.innerHTML = 'Error fetching data';
            console.error('Fetching data error :' + error);
        })
}

loadShows();