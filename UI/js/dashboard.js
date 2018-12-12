const table = document.createElement('table');

class User {
	static getUserId() {
		return +localStorage.getItem('id');
	}

	static renderUserName() {
		const firstname = localStorage.getItem('firstName');
		const lastname = localStorage.getItem('lastName');
		const username = document.getElementById('username');
		const userIdCont = document.getElementById('user-id');
		username.innerHTML = `${firstname} ${lastname}`;
		userIdCont.innerHTML = `SD0${User.getUserId()}`;
	}
}


class Parcel {
	static getUserParcels() {
		const token = localStorage.getItem('token'),
			userId = User.getUserId(),
			config = {
				method: 'GET',
				headers: new Headers({
					'x-access-token': token
				}),
			};

		fetch(`http://localhost:3000/api/v1/users/${userId}/parcels`, config)
			.then(res => res.json())
			.then(res => {
				Parcel.buildAllParcelCollection(res.data);
				Parcel.populateTable();
				Parcel.renderFilters();
			});
	}

	static getDeliveredUserParcels() {
		const token = localStorage.getItem('token'),
			userId = User.getUserId(),
			config = {
				method: 'GET',
				headers: new Headers({
					'x-access-token': token
				}),
			};

		fetch(`http://localhost:3000/api/v1/users/${userId}/parcels`, config)
			.then(res => res.json())
			.then(res => {
				Parcel.buildDeliveredParcelCollection(res.data);
				Parcel.populateTable();
				Parcel.renderFilters();
			});
	}

	static getTransitUserParcels() {
		const token = localStorage.getItem('token'),
			userId = User.getUserId(),
			config = {
				method: 'GET',
				headers: new Headers({
					'x-access-token': token
				}),
			};

		fetch(`http://localhost:3000/api/v1/users/${userId}/parcels`, config)
			.then(res => res.json())
			.then(res => {
				Parcel.buildTransitParcelCollection(res.data);
				Parcel.populateTable();
				Parcel.renderFilters();
			});
	}

	static createParcel(event) {
		event.preventDefault();
		const token = localStorage.getItem('token'),
			parcelName = document.getElementById('parcelName').value,
			weight = document.getElementById('weight').value,
			pickupLocation = document.getElementById('PickupLocation').value,
			destination = document.getElementById('destination').value,
			receiver = document.getElementById('receiver').value,
			email = document.getElementById('email').value,
			phoneNumber = document.getElementById('phoneNumber').value,
			modal = document.getElementById('parcelmodal'),
			myData = {
				parcelName, 
				weight, 
				pickupLocation, 
				destination, 
				receiver,
				email, 
				phoneNumber
			},
			config = {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
					'x-access-token': token
				}),
				body: JSON.stringify(myData),
			};

		fetch('http://localhost:3000/api/v1//parcels', config)
			.then(handleErrors)
			.then(res => {
        notif.make({text: 'Successfully created parcel', type: 'success' });
				hide(modal);
				document.forms.createParcel.reset()
			})
			.catch((err) => {
				if(err.message === 'Failed to fetch') {
					notif.make({text: 'Create Parcel Failed, You are Offline', type: 'danger' });
				}
			})

	}

	static buildAllParcelCollection(parcels) {
		Parcel.collection = parcels.map((parcel) => new ParcelItem(parcel));
		Parcel.filteredCollection = parcels.map((parcel) => new ParcelItem(parcel));
	}

	static buildDeliveredParcelCollection(parcels) {
		Parcel.collection = parcels.map((parcel) => new ParcelItem(parcel));
		Parcel.filteredCollection = Parcel.collection.filter(parcelItem => parcelItem.isDelivered());
	}

	static buildTransitParcelCollection(parcels) {
		Parcel.collection = parcels.map((parcel) => new ParcelItem(parcel));
		Parcel.filteredCollection = Parcel.collection.filter(parcelItem => parcelItem.isInTransit());
	}

	static populateTable() {
		const table = createTable();

		Parcel.filteredCollection
		.map(parcelItem => {
			table.append(parcelItem.buildRow());
		});
	}

	static renderFilters() {
		const created = document.getElementById('created');
		const inTransit = document.getElementById('in-transit');
		const delivered = document.getElementById('delivered');

		created.innerText = Parcel.collection.filter(parcelItem => parcelItem.isCreated()).length;
		inTransit.innerText = Parcel.collection.filter(parcelItem => parcelItem.isInTransit()).length;
		delivered.innerText = Parcel.collection.filter(parcelItem => parcelItem.isDelivered()).length;
	}
}

Parcel.filteredCollection = [];
Parcel.collection = [];
User.renderUserName()

class ParcelItem  {

	constructor(parcel) {
		this.parcel = parcel
	}

	isInTransit() {
		return this.parcel.status === 'In-transit';
	}

	isCreated() {
		return this.parcel.status === 'Created';
	}

	isDelivered() {
		return this.parcel.status === 'Delivered';
	}

	buildRow() {
		let {
			id,
			parcelname,
			weight,
			metric,
			price,
			destination,
			receiver,
			senton,
			status
		} = this.parcel
		weight = `${weight}${metric}`;
		const datas = [id, parcelname, weight, price, destination, receiver, senton, status];
		const row = document.createElement('tr');

		for (let data of datas) {
			const dataRow = document.createElement('td');
			dataRow.innerText = data;
			row.appendChild(dataRow);
		}
		
		const dataRow = document.createElement('td');
		dataRow.appendChild(this.buildButton());
		row.appendChild(dataRow);

		return row; //Element
	}
	
	buildButton() {
		const anchor = document.createElement('a');
		anchor.href = 'details.html';
		anchor.innerText = 'View';
		const classes = ['btn', 'xsm', 'bg-bright-blue', 'white'];
		for (let clas of classes) {
			anchor.classList.add(clas);
		}
		return anchor;
	}
}

function createTable() {
	const main = document.getElementById('table-cont');
	const tableRow = document.createElement('tr');
	const id = document.createElement('th');
	id.innerText = 'ID';
	const name = document.createElement('th');
	name.innerText = 'Name';
	const weight = document.createElement('th');
	weight.innerText = 'Weight';
	const price = document.createElement('th');
	price.innerText = 'Price';
	const destination = document.createElement('th');
	destination.innerText = 'Destination';
	const receiver = document.createElement('th');
	receiver.innerText = 'Receiver';
	const sentOn = document.createElement('th');
	sentOn.innerText = 'Sent On';
	const status = document.createElement('th');
	status.innerText = 'Status';

	const headers = [id, name, weight, price, destination, receiver, sentOn, status];
	for (let i = 0; i < headers.length; i++) {
		tableRow.appendChild(headers[i]);
	};
	table.appendChild(tableRow);
	main.appendChild(table);

	return table;
}

// Implementing the create parcel modal
let createParcel = document.getElementById("createParcel");
if (createParcel !== null) {
	createParcel.addEventListener('submit', Parcel.createParcel);
}


function handleErrors(res) {
	if(!res.ok) {
    console.log(res);
    if(res.statusText === 'Bad Request') {
      notif.make({text: 'Create Parcel Failed, You are Offline', type: 'danger' })
    }
		throw new Error(res.statusText);
	}
	return res.json();
}

function hide(modal) {
	modal.style.display = 'none';
}

const notif = new Notification()
document.body.append(notif.getElement());