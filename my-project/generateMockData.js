import fs from 'fs';

const sportsList = [
    { id: 1, name: "Basketball", image: "https://pixabay.com/get/g07c340f01c27b828301aedf43025b3bb4a0fd910fc0b87747faa5b578194fbf4a0cb93440a96d61a3ea2f5a7b458bf2b3f1fb18bf516ee7395243017ecedd74a_1280.jpg", coach: "Coach Carter" },
    { id: 2, name: "Football", image: "https://pixabay.com/get/g480fc67a1113bc24baac2ab764bceb3a7b413c4279e8fd8fe1db28c75b9c404023a8f743641729eac5bb3ca1d65bf656253c8d25890b79500de5573d0f0657be_1280.jpg", coach: "Coach Ted" },
    { id: 3, name: "Tennis", image: "https://pixabay.com/get/gb19117bdc82865a49403b1b8eda2647399083101a80c5abab669988656dd8b9167dab1408798fec047a3592b3ff36583afa2aa77a90ac19cabecb4253cd6f42e_1280.jpg", coach: "Coach Williams" },
    { id: 4, name: "Swimming", image: "https://pixabay.com/get/gb8210a99f8dd4b02d039fa13fc54b117abfa61d783291de5cfdd052ceaf2b295d51c22a0d37316d82853eed8ebd6b198_1280.jpg", coach: "Coach Phelps" },
    { id: 5, name: "Volleyball", image: "/images/volleyball.jpg", coach: "TBD" },
    { id: 6, name: "Elle", image: "/images/elle.jpg", coach: "TBD" },
    { id: 7, name: "Cricket", image: "/images/cricket.jpg", coach: "TBD" },
    { id: 8, name: "Rugby", image: "/images/rugby.jpg", coach: "TBD" },
    { id: 9, name: "Athletics", image: "/images/athletics.jpg", coach: "TBD" },
    { id: 10, name: "Table Tennis", image: "/images/table_tennis.jpg", coach: "TBD" },
    { id: 11, name: "Karate", image: "/images/karate.jpg", coach: "TBD" },
    { id: 12, name: "Badminton", image: "/images/badminton.jpg", coach: "TBD" },
    { id: 13, name: "Gym & Fitness", image: "/images/gym.jpg", coach: "TBD" },
    { id: 14, name: "Chess", image: "/images/chess.jpg", coach: "TBD" },
    { id: 15, name: "Carrom", image: "/images/carrom.jpg", coach: "TBD" },
    { id: 16, name: "Kabaddi", image: "/images/kabaddi.jpg", coach: "TBD" },
];

const slMaleNames = [
    "Kasun", "Nuwan", "Dasun", "Avishka", "Lahiru", "Shehan", "Dinesh", "Kusal", "Dimuth", "Wanindu",
    "Pathum", "Charith", "Asela", "Dhananjaya", "Maheesh", "Dilshan", "Angelo", "Thisara", "Suranga", "Rangana",
    "Chamika", "Bhanuka", "Minod", "Avishka", "Kamindu", "Praveen", "Lakshan", "Nuwan", "Tharindu", "Roshen",
    "Sadeera", "Niroshan", "Upul", "Lasith", "Ajantha", "Jehan", "Kavindu", "Sachin", "Malinda", "Isuru"
];

const slFemaleNames = [
    "Chamari", "Shashikala", "Eshani", "Nilakshi", "Hasini", "Dilani", "Udeshika", "Harshitha", "Kavisha", "Anushka",
    "Oshadi", "Sugandika", "Inoka", "Hansima", "Vishmi", "Imesha", "Sathya", "Malsha", "Nipuni", "Tharushi",
    "Rashmi", "Sanduni", "Kaveesha", "Mahesha", "Sachini", "Hiruni", "Amali", "Ruwanthi", "Nnadee", "Chathurika",
    "Hashini", "Gayani", "Malki", "Piumi", "Dulanjali", "Savindri", "Navodya", "Ishara", "Madhavi", "Ridmi"
];

const slSurnames = [
    "Perera", "Silva", "Fernando", "De Silva", "Bandara", "Rathnayake", "Jayawardena", "Mendis", "Mathews", "Karunaratne",
    "Gunaratne", "Rajapaksa", "Wickramasinghe", "Herath", "Liyanage", "Gamage", "Ranasinghe", "Ekanayake", "Nanayakkara", "Senanayake",
    "Dissanayake", "Jayasekara", "Amarasinghe", "Weerakkody", "Jayasinghe", "Edirisinghe", "Samaraweera", "Chandimal", "Thirimanne", "Lakmal"
];

const getRandomName = (gender) => {
    const firstNameList = gender === 'Boy' ? slMaleNames : slFemaleNames;
    const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
    const lastName = slSurnames[Math.floor(Math.random() * slSurnames.length)];
    return `${firstName} ${lastName}`;
};

const generateMembers = (count, gender, sportId) => {
    return Array.from({ length: count }, (_, i) => {
        // Generate a unique index for the image based on sport and player index
        const imageIndex = (sportId * 12 + i) % 70;
        const genderPath = gender === 'Boy' ? 'men' : 'women';

        return {
            id: i + 1,
            name: getRandomName(gender),
            role: i === 0 ? "Captain" : "Member", // First player is Captain
            image: `https://randomuser.me/api/portraits/${genderPath}/${imageIndex}.jpg`
        };
    });
};

const sportsData = sportsList.map(sport => ({
    ...sport,
    description: `Join the ${sport.name} team at our university!`,
    boysTeam: generateMembers(12, 'Boy', sport.id),
    girlsTeam: generateMembers(12, 'Girl', sport.id)
}));

const content = `export const sports = ${JSON.stringify(sportsData, null, 2)};`;
fs.writeFileSync('temp_sports_data.js', content, 'utf8');
console.log('Data written to temp_sports_data.js');
