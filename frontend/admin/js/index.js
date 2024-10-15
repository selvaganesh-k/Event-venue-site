const mainDashboard = document.querySelector('#main-dashboard');
const homeLink = document.querySelector('#homeLink');
const addEventLink = document.querySelector('#addEventLink');
const usersLink = document.querySelector('#usersLink');

function loadHomeContent() {
    mainDashboard.innerHTML = `
                <h2>Welcome to the Dashboard</h2>
            `;
}
function loadAddEventForm() {
    mainDashboard.innerHTML = `
        <div class="form-container">
        <h2>Add New Event</h2>
        <form id="eventForm" enctype="multipart/form-data">
            <!-- Left Side -->
            <div class="form-group">
                <label for="concertName">Concert Name</label>
                <input type="text" id="concertName" name="concertName" placeholder="Concert Name" required>
            </div>

            <div class="form-group">
                <label for="artists">Artists</label>
                <input type="text" id="artists" name="artists" placeholder="Artists" required>
            </div>

            <div class="form-group">
                <label for="eventDateTime">Date and Time</label>
                <input type="datetime-local" id="eventDateTime" name="eventDateTime" required>
            </div>

            <div class="form-group">
                <label for="venue">Venue</label>
                <input type="text" id="venue" name="venue" placeholder="Venue" required>
            </div>

            <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="4" placeholder="Description"></textarea>
            </div>

            <!-- Right Side -->
            <div class="form-group full-width ticket-types">
                <label>Ticket Types:</label>
                <div>
                    <input type="checkbox" id="general" name="ticketType" value="General">
                    <label for="general">General</label>
                </div>
                <div>
                    <input type="checkbox" id="vip1" name="ticketType" value="VIP">
                    <label for="vip">VIP</label>
                </div>
            </div>

            <div class="form-group">
                <label for="totalTickets">Total Selling Tickets</label>
                <input type="number" id="totalTickets" name="totalTickets" placeholder="Total Selling Tickets" required>
            </div>

            <div class="form-group">
                <label for="endDate">End Date</label>
                <input type="date" id="endDate" name="endDate" required>
            </div>

            <div class="form-group">
                <label for="organizer">Organizer</label>
                <input type="text" id="organizer" name="organizer" placeholder="Organizer" required>
            </div>

            <div class="form-group">
                <label for="organizerContact">Organizer Contact</label>
                <input type="tel" id="organizerContact" name="organizerContact" placeholder="Organizer Contact" required>
            </div>
            <div class="form-group">
                        <label for="image">Upload Image</label>
                        <input type="file" id="image" name="image" accept="image/*" onchange='previewImage(event)'>
            </div>
            <div class="form-group image-preview" id="imagePreview" style="display:none"></div>
            <div class="button-container">
                <button type="submit">Add Event</button>
            </div>
        </form>
    </div>
    <div class="data-table">
        <h2>Concert Lists</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Concert Name</th>
                    <th>Artists</th>
                    <th>Description</th>
                    <th>Concert Date</th>
                    <th>Total Tickets</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody class="tbody" id="concertTableBody">

            </tbody>
        </table>
    </div>
    
            `;
    loadShows();
    const imageInput = document.querySelector('#image');
    const imagePreview = document.querySelector('#imagePreview');
    const eventForm = document.querySelector('#eventForm');



    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(eventForm);
        const ticketTypes = [];
        document.querySelectorAll('input[name="ticketType"]:checked').forEach((checkbox) => {
            ticketTypes.push(checkbox.value);
        });
        formData.delete('ticketType');
        ticketTypes.forEach(type => formData.append('ticketType[]', type));

        await axios.post('http://localhost:5000/ems/concerts', formData)
            .then(response => {
                alert(response.data.message);
                eventForm.reset();
                imagePreview.innerHTML = '';
                imagePreview.style.display = 'none';
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data.message);
                }
                else {
                    alert('Server error. Please try again later');
                }
            })
    });

    imageInput.addEventListener('change', (e) => previewImage(e, imagePreview));
}
async function showUpdateForm(concertId) {
    const concert = await getConcertById(concertId);
    if (concert) {
        const mainDashboard = document.querySelector('#main-dashboard');
        mainDashboard.innerHTML = `
            <div class="form-container">
                <h2>Update Concert</h2>
                <form id="updateEventForm" enctype="multipart/form-data">
                    <input type="hidden" id="updateConcertId" value="${concert._id}">
                    <div class="form-group">
                        <label for="updateConcertName">Concert Name</label>
                        <input type="text" id="updateConcertName" name="concertName" value="${concert.concertName}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateArtists">Artists</label>
                        <input type="text" id="updateArtists" name="artists" value="${concert.artists}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateEventDateTime">Date and Time</label>
                        <input type="datetime-local" id="updateEventDateTime" name="eventDateTime" value="${new Date(concert.eventDateTime).toISOString().slice(0, 16)}" required>
                    </div>
                    <div class="form-group">
                        <label for="updateVenue">Venue</label>
                        <input type="text" id="updateVenue" name="venue" value="${concert.venue}" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="updateDescription">Description</label>
                        <textarea id="updateDescription" name="description" rows="4" required>${concert.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="updateTotalTickets">Total Selling Tickets</label>
                        <input type="number" id="updateTotalTickets" name="totalTickets" value="${concert.totalTickets}" required>
                    </div>
                    <div class="button-container">
                        <button type="submit">Update Event</button>
                    </div>
                </form>
            </div>
        `;
        const updateEventForm = document.querySelector('#updateEventForm');
        updateEventForm.addEventListener('submit', (event) => {
            event.preventDefault();
            updateConcert(concertId);
        });
    }
}

async function getConcertById(concertId) {
    await axios.get(`http://localhost:5000/ems/concerts/${concertId}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching concert:', error);
        })
}

async function updateConcert(concertId) {
    const updatedData = {
        concertName: document.querySelector('#updateConcertName').value,
        artists: document.querySelector('#updateArtists').value,
        eventDateTime: document.querySelector('#updateEventDateTime').value,
        venue: document.querySelector('#updateVenue').value,
        description: document.querySelector('#updateDescription').value,
        totalTickets: document.querySelector('#updateTotalTickets').value,
    };

    await axios.put(`http://localhost:5000/ems/concerts/${concertId}`, updatedData)
        .then(response => {
            if (response.status === 200) {
                alert('Concert updated successfully');
                mainDashboard.innerHTML = '';
                loadAddEventForm();
            }
        })
        .catch(error => {
            console.error('Update concert error:' + error);
        });
}


async function loadShows() {
    await axios.get('http://localhost:5000/ems/allConcerts')
        .then(response => {
            if (response.status === 200) {
                displayConcertData(response.data);
            }
        })
        .catch(error => {
            console.error('Fetching data error' + error);
        })
}

async function deleteConcert(concertId) {
    await axios.delete(`http://localhost:5000/ems/concerts/${concertId}`)
        .then(response => {
            if (response.status === 200) {
                alert('Concert deleted successfully');
                loadShows();
            }
        })
        .catch(error => {
            console.error('Error deleting concert' + error);
        })
}

function displayConcertData(concerts) {
    const concertTableBody = document.querySelector('#concertTableBody');
    if(!concerts){
        concertTableBody.innerHTML = '<tr><td colspan="5">No concerts found</td></tr>';
    }
    else{
    concertTableBody.innerHTML = '';

    concerts.forEach((concert, index) => {
        console.log(concert._id)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="http://localhost:5000/${concert.image}" alt="${concert.concertName}" style="width: 30px; height: auto;"></td>
            <td>${concert.concertName}</td>
            <td>${concert.artists}</td>
            <td>${concert.description}</td>
            <td>${new Date(concert.eventDateTime).toLocaleString()}</td>
            <td>${concert.totalTickets}</td>
            <td>
                <button class="edit-btn" onclick="showUpdateForm('${concert._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteConcert('${concert._id}')">Delete</button>
            </td>
        `;
        concertTableBody.appendChild(row);
    });
}
}
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.style.display = 'block';
        imagePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = reader.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
}

function loadUsers(){
    mainDashboard.innerHTML=`<div class="data-table">
        <h2>Users Lists</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody class="tbody" id="usersTableBody">

            </tbody>
        </table>
    </div>`;
    loadUserDetails();
}
async function loadUserDetails() {
    await axios.get('http://localhost:5000/ems/getUsers')
        .then(response => {
            if (response.status === 200) {
                displayAllusers(response.data);
            }
        })
        .catch(error => {
            
            console.error('Fetching data error' + error);
        })
}
function displayAllusers(users){
    const usersTableBody = document.querySelector('#usersTableBody');
    if(!users){
        usersTableBody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
    }
    else{
    usersTableBody.innerHTML = '';
    users.forEach((user, index) => {
        console.log(user._id)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phoneno}</td>
            <td>
                <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}
}
async function deleteUser(userId){
    await axios.delete(`http://localhost:5000/ems/users/${userId}`)
        .then(response => {
            if (response.status === 200) {
                alert('User deleted successfully');
                loadShows();
            }
        })
        .catch(error => {
            console.error('Error deleting user' + error);
        })
}
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadHomeContent();
});

addEventLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadAddEventForm();
});

usersLink.addEventListener('click',(e)=>{
    e.preventDefault();
    loadUsers();
})

window.onload = loadHomeContent;

function logout(){
    localStorage.removeItem('loggedInUser');
    window.location.href = '../auth.html';
}