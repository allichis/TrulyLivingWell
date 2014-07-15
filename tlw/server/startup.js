// if the database is empty on server start, create sample data.
Meteor.startup(function () {
	/***********************
	 * ROLES 
	 **********************/
	if (!Meteor.roles.findOne({name: 'admin'})) {
		Roles.createRole('admin');
	}
	if (!Meteor.roles.findOne({name: 'staff'})) {
		Roles.createRole('staff');
	}

	/***********************
	 * ADMIN 
	 **********************/
	if (Meteor.users.find().count() === 0) {
		// create a new user
		var admin_uid = Accounts.createUser({
			email: "admin@admin.com",
			password: "admin1",
			profile: {username: "admin"},
			profile: {name: "Admin"},
		});
		// give the user the 'admin' role
		Roles.addUsersToRoles(admin_uid, ['admin']);
	}

	/***********************
	 * USERS (STAFF) 
	 **********************/
	if (Meteor.users.find().count() === 1) {
		var users = [
		{email: "user1@tlw.com", username: "user1", name: "User One"},
		{email: "user2@tlw.com", username: "user2", name: "User Two"},
		{email: "user3@tlw.com", username: "user3", name: "User Three"},
		{email: "user4@tlw.com", username: "user4", name: "User Four"},
		{email: "user5@tlw.com", username: "user5", name: "User Five"},
		];
		_.each(users, function(user) {
			var uid = Accounts.createUser({
				email: user.email,
				password: "test",
				profile: {username: user.username},
				profile: {name: user.name},
			});
			Roles.addUsersToRoles(uid, ['staff']);
		});
	}

	/***********************
	 * LOCATIONS 
	 **********************/
	if (Locations.find().count() === 0) {
		var locNames = ["Wheat Street", "East Point", "Harbin Road"];
		
		for (var i = 0; i < locNames.length; i++) {
			Locations.insert({name: locNames[i]});
		}
	}

	/***********************
	 * VOLUNTEERS 
	 **********************/
	if (Volunteers.find().count() === 0) {

		var mom = {
			name: "Mom",
			phone: 911,
		};
		var everyonesBday = new Date(1990, 0, 1);
		var myBday = new Date(1987, 1, 13);
		vols = [
			{firstname: "Amy", lastname: "Adams", dob: everyonesBday, email: "aa@vol.org", phone: "111-1111", isVeteran: false, emergencyContact: mom},
			{firstname: "Bob", lastname: "Barker", dob: everyonesBday, email: "bb@vol.org", phone: "222-2222", isVeteran: true, emergencyContact: mom},
			{firstname: "Cindy", lastname: "Crawford", dob: everyonesBday, email: "cc@vol.org", phone: "333-3333", isVeteran: true, emergencyContact: mom},
			{firstname: "Don", lastname: "DeLillo", dob: everyonesBday, email: "dd@vol.org", phone: "444-4444", isVeteran: false, emergencyContact: mom},
			{firstname: "Emily", lastname: "Reese", dob: myBday, email: "er@vol.org", phone: "4047719915", isVeteran: false, emergencyContact: mom},
		];

		var timestamp = (new Date()).getTime();
		for (var i = 0; i < vols.length+1; i++) {
			var vol_id = Volunteers.insert(vols[i]);
			// insert a timecard for each Volunteer
			/*
			VolunteerTimecards.insert({
				vol_id: vol_id,
				text: "bs timecard (" + i + ")",
				timestamp: timestamp
			});
			*/

			//ensure a unique timestamp
			timestamp++;
		}
	}

	/***********************
	 * PRODUCTS 
	 **********************/
	if (Products.find().count() === 0) {
		var items = [
					 "Arugula",
					 "Baby Bok Choy",
					 "Basil",
					 "Beets",
					 "Broccolli",
					 "Cabbage",
					 "Carrots",
					 "Chives",
					 "Collards",
					 "Daikon Radish",
					 "Field Greens Mix",
					 "Green Garlic",
					 "Kale",
					 "Micro Greens",
					 "Mizuna",
					 "Mustard Greens",
					 "Napa Cabbage",
					 "Oregano",
					 "Parsley",
					 "Pecans",
					 "Peppermint",
					 "Pickles",
					 "Pineapple Sage",
					 "Radish",
					 "Rosemary",
					 "Spearmint",
					 "Spinach",
					 "Sweet Potato",
					 "Swiss Chard",
					 "Tarragon",
					 "Thyme",
					 "Turnips",
					 "Kohlrabi",
					 "Rutabaga",
					 "Salad Mix",
					 "Broccoli",
					 "Broccoli Leaves",
					 "Green Onions",
					 "Greenleaf Lettuce",
					 "Romaine Lettuce",
					 "Cilantro",
					 "Parsley",
					 "Carrots (baby)",
					 "Broccoli Florets",
					 "Fava Beans",
					 "Green Beans",
					 "Marjoram",
					 "Turnip Greens",
					 "Cucumber",
					 "Garlic",
					 "Onion",
					 "Squash",
					 "Lemon Balm",
					 "Mint",
					 "Tomato",
					 "Zucchini",
					 "Black Eye Peas",
					 "Beans",
					 "Dill",
					 "Lettuce (Spring Mix)",
					 "Malabar Spinach",
					 "Patty Pan Squash",
					 "Peas",
					 "Sage",
					 "Eggplant",
					 "Eggplant, Black Beauty",
					 "Eggplant, Japanese White",
					 "Eggplant, Rosa Bianca",
					 "Okra",
					 "Lima Beans",
					 "Stripped Cavern",
					 "Heirloom Tomato",
					 "Cherry Tomato",
					 "Roma",
					 "Sweet Potato Green",
					 "Holy Basil",
					 "Japanese White Eggplant",

"Peppers, Bell",
"Peppers, Chinese 5 Spice",
"Peppers, Jalapeno",
"Peppers, Cayenne",

"Peas, Black Eye",
"Peas, Cow",
"Peas, Edamame",



"Garlic, Green",

"Lettuce, Greenleaf",

"Spinach, Malabar",

"Squash, Crook Neck",

"Squash, Patty Pan",

"Squash, Butternut",

"Squash, Zucchini",

"Tomato, Cherry",

"Tomato, Heirloom",

"Tomato, Green",

"Onion, Green",

"Onion, White",

"Onion, Yellow",

"Beans, Limas",

"Herbs, Thyme",

"Herbs, Tarragon",

"Herbs, Thyme (dried)",

"Herbs, Tarragon (dried)",

"Herbs, Basil (dried",

"Herbs, Marjoram (dried)",

"Herbs, Oregano (dried)",

"Herbs, Holy Basil (dried)",

"Herbs, Lemon Balm (dried)",

"Herbs, Peppermint (dried)",

"Herbs, Spearmint (dried)",

"Herbs, Rosemary (dried)",

"Herbs, Pineapple Sage (dried)",

"Herbs, Monthly Flower Club Du",

"Herbs, Silver Sage (dried)",

"Greens, Sweet Potato Greens",

"figs",

"Herbs, Oregano (fresh)",

"Herbs, Oregano (fresh)",

"Herbs, Marjoram (fresh)",

"Potatoes, Yukon Gold",




"Oil, Rosemary",

"Oil, Garlic Chili",

"Herbs, Peppermint (fresh)",

"Potatoes, Sweet Potatoes",

"Cabbage, Leaves",

"Sprouts, Gourmet Blend",

"Sprouts, Wheatgrass Shot",

"Peppers, Jamaican Hot Peppers",

"Mizuna (half pound",

"Herbs, hot teas",



"Herbs, hot herb teas",

"Herbs, herbal culinary salt",



"CSA, Full Share",

"Lettuce, Romaine (head)",

"Lettuce, Bibb (head)",

"Herbs, Herb and Flower Potpour",

"Peppers, Bell (Colors)",

"Lettuce, Drunken Woman",

"Braising Mix",

"Herbs, Cilantro (fresh)",

"Herbs, Fennel (fresh)",

"Stir Fry Mix",

"Lettuce, Mesclun Mix",

"Apples",

"Bok Choy",

"Cauliflower Greens",

"Cauliflower",

"Tours, Service Learning"
];
		
		for (var i = 0; i < items.length; i++) {
			Products.insert({itemname: items[i]});
		}
	}


	/***********************
	 * VISIT TYPES 
	 **********************/
	if (VisitTypes.find().count() === 0) {
		var items = ["Tour", "Meeting", "Other"];
		
		for (var i = 0; i < items.length; i++) {
			VisitTypes.insert({title: items[i], cost: 0});
		}
	}

	/***********************
	 * TOURS
	 **********************/
	if (Tours.find().count() === 0) {		
		Tours.insert({title: "General Tour", cost: 10, notes: "(30-45 minutes)"});
		Tours.insert({title: "Driving Tour of 3 Farms", cost: 35, notes: "(2-3 hours)"});
		Tours.insert({title: "I. D. Me!", cost: 10, notes: "(30-40 minutes)"});
		Tours.insert({title: "A Rhyme in Time Scavenger Hunt", cost: 10, notes: "(45 minutes)"});
		Tours.insert({title: "Creepy Crawly Garden Friends and Foes", cost: 10, notes: "(30-40 minutes)"});
		Tours.insert({title: "Ahoy Mateys!  There's Buried Treasure at Wheat Street Gardens", cost: 12, notes: "(60 minutes)"});
		Tours.insert({title: "Follow that Scent! Or Blind Man's Bluff!", cost: 15, notes: "(90 minutes)"});
		Tours.insert({title: "Taste and Touch It!", cost: 15, notes: "(90 minutes)"});
		Tours.insert({title: "Just us Chickens", cost: 12, notes: "(60 minutes)"});
	}

	/***********************
	 * TOUR ADD-ONS
	 **********************/
	if (TourAddOns.find().count() === 0) {		
		TourAddOns.insert({title: "Service Learning (Farm with Farmers)", cost: 5, notes: ""});
		TourAddOns.insert({title: "Service Learning (Compost and Composting)", cost: 5, notes: ""});
		TourAddOns.insert({title: "Nature Mobile Activity", cost: 5, notes: ""});
		TourAddOns.insert({title: "Bird Feeder Extravaganza", cost: 5, notes: ""});
	}

	/*
  if (Lists.find().count() === 0) {
    var data = [
      {name: "Languages",
       contents: [
         ["Lisp", "GC"],
         ["C", "Linked"],
         ["C++", "Objects", "Linked"],
         ["Python", "GC", "Objects"],
         ["Ruby", "GC", "Objects"],
         ["JavaScript", "GC", "Objects"],
         ["Scala", "GC", "Objects"],
         ["Erlang", "GC"],
         ["6502 Assembly", "Linked"]
         ]
      },
      {name: "Favorite Scientists",
       contents: [
         ["Ada Lovelace", "Computer Science"],
         ["Grace Hopper", "Computer Science"],
         ["Marie Curie", "Physics", "Chemistry"],
         ["Carl Friedrich Gauss", "Math", "Physics"],
         ["Nikola Tesla", "Physics"],
         ["Claude Shannon", "Math", "Computer Science"]
       ]
      }
    ];

    var timestamp = (new Date()).getTime();
    for (var i = 0; i < data.length; i++) {
      var list_id = Lists.insert({name: data[i].name});
      for (var j = 0; j < data[i].contents.length; j++) {
        var info = data[i].contents[j];
        Todos.insert({list_id: list_id,
                      text: info[0],
                      timestamp: timestamp,
                      tags: info.slice(1)});
        timestamp += 1; // ensure unique timestamp.
      }
    }
  }
    */
});
