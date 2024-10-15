const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const content = document.querySelector('#content');

getConcert(id);

async function getConcert(concertId) {
    try {
        const response = await axios.get(`http://localhost:5000/ems/concerts/${concertId}`);
        const concert = response.data;
        content.innerHTML = `
            <div class="contentDiv">
                <div class="head">
                <h2>${concert.concertName}</h2>
                <p> ${new Date(concert.eventDateTime).toLocaleString()} || Cypher city</p>
                <p>${concert.description}</p>
                </div>
                <div class="img">
                    <img src="http://localhost:5000/${concert.image}" alt="${concert.concertName}">
                </div>
                <div class="form">
                <div class="timeandlocation">
                    <h2>Time & Location</h3>
                    <p>${new Date(concert.eventDateTime).toLocaleString()}</p>
                    <p>${concert.venue}</p>
                </div>
                <h3>Ticket Booking</h3>
                    <form id="bookingForm" method="post">
                        <div class="form-group">
                            <label for="ticketType">Ticket Type</label>
                            <select id="ticketType" name="ticketType" required>
                                ${concert.ticketType.map(type =>
                            `<option value="${type}">${type}</option>`
                        ).join('')}
                            </select>
                        </div>
                    <div class="form-group">
                        <label for="numTickets">Number of Tickets</label>
                        <input type="number" id="numTickets" name="numTickets" min="1" max="10" required>
                     </div>
                     <div>
                        <button type="submit">Book Now</button>
                     </div>   
                    </form>
                </div>
            </div>
        `;
        document.querySelector('#bookingForm').addEventListener('submit', handleBooking);
    } catch (error) {
        console.error('Error fetching concert details:', error);
    }
}

async function handleBooking(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const ticketTypeSelect = document.querySelector('#ticketType');
    const ticketType = ticketTypeSelect.value;
    const numTickets = parseInt(document.querySelector('#numTickets').value);
    function checkRate(ticketType, numTickets){
        if(ticketType==='VIP'){
            return 1000*numTickets;
        }
        else{
            return 100 * numTickets;
        }
    }
    const formData = {
        name: user.name,
        email: user.email,
        ticketType,
        ticketRate: checkRate(ticketType,numTickets),
        numTickets,
        concertId: id
    };
    console.log(formData);

    await axios.post('http://localhost:5000/ems/booking', formData)
    .then(response=>{
        alert(response.data.message);
    })
    .catch(error=>{
        if(error.response){
            alert(error.response.data.message);
        }
        else{
            alert("Booking failed, please try again later");
        }
    })
}