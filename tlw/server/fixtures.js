if (Requests.find().count() === 0) {
	Requests.insert({itemname: "Apples", amount:500});
	Requests.insert({itemname: "Broccoli", amount:200});
	Requests.insert({itemname: "Canteloupe", amount:70});
}

/*
if (Volunteers.find().count() === 0) {
	Volunteers.insert({
		name: "",
		dob: ,
		email: ,
		phone:
	});
}
*/
