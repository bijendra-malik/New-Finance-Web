export const OTHER_OPTION = "Other" as const;

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export type CitiesByState = Record<string, readonly string[]>;

// Keyed by `${slugifiedState}::${slugifiedCity}` — see utils/formatters.ts#pincodeLocationKey.
export type PincodesByLocation = Record<string, readonly string[]>;

// Static fallback city list used when the backend's /masters has no citiesByState seeded yet.
// Server data (when available) is merged OVER these in useMasters.
export const CITIES_BY_STATE: CitiesByState = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Anantapur"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu"],
  Delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Lajpat Nagar", "Pitampura", "Janakpuri", "Connaught Place", "Vasant Kunj"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Mehsana"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Sonipat", "Rohtak", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Bilaspur"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Pulwama"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru", "Udupi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam"],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Navi Mumbai", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli"],
  Manipur: ["Imphal", "Thoubal", "Churachandpur"],
  Meghalaya: ["Shillong", "Tura", "Nongstoin"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Hoshiarpur", "Batala"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bharatpur", "Alwar", "Sikar", "Bhilwara"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Gorakhpur", "Mathura"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Rishikesh", "Kotdwar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Kharagpur", "Malda", "Baharampur"],
};

// Static fallback pincodes keyed by `pincodeLocationKey(state, city)` (slugified — see
// utils/formatters.ts). Server data is merged over these per-key in useMasters once the
// backend seeds pincodesByLocation.
export const PINCODES_BY_LOCATION: PincodesByLocation = {
  "andaman-and-nicobar-islands::port-blair": ["744101"],
  "andhra-pradesh::visakhapatnam": ["530001", "530013", "530016", "530026"],
  "andhra-pradesh::vijayawada": ["520001", "520008", "520010"],
  "andhra-pradesh::guntur": ["522001", "522004"],
  "andhra-pradesh::nellore": ["524001"],
  "andhra-pradesh::kurnool": ["518001"],
  "andhra-pradesh::tirupati": ["517501", "517502"],
  "andhra-pradesh::rajahmundry": ["533101"],
  "andhra-pradesh::anantapur": ["515001"],
  "arunachal-pradesh::itanagar": ["791111"],
  "arunachal-pradesh::naharlagun": ["791110"],
  "arunachal-pradesh::pasighat": ["791102"],
  "assam::guwahati": ["781001", "781005", "781022", "781028"],
  "assam::silchar": ["788001"],
  "assam::dibrugarh": ["786001"],
  "assam::jorhat": ["785001"],
  "assam::tezpur": ["784001"],
  "assam::nagaon": ["782001"],
  "bihar::patna": ["800001", "800004", "800013", "800020"],
  "bihar::gaya": ["823001"],
  "bihar::bhagalpur": ["812001"],
  "bihar::muzaffarpur": ["842001"],
  "bihar::darbhanga": ["846004"],
  "bihar::purnia": ["854301"],
  "chandigarh::chandigarh": ["160001", "160009", "160017", "160022"],
  "chhattisgarh::raipur": ["492001", "492004", "492010"],
  "chhattisgarh::bhilai": ["490001", "490006"],
  "chhattisgarh::bilaspur": ["495001"],
  "chhattisgarh::korba": ["495677"],
  "chhattisgarh::durg": ["491001"],
  "chhattisgarh::raigarh": ["496001"],
  "dadra-and-nagar-haveli-and-daman-and-diu::silvassa": ["396230"],
  "dadra-and-nagar-haveli-and-daman-and-diu::daman": ["396210"],
  "dadra-and-nagar-haveli-and-daman-and-diu::diu": ["362520"],
  "delhi::new-delhi": ["110001", "110003", "110011", "110021"],
  "delhi::dwarka": ["110075", "110078"],
  "delhi::rohini": ["110085", "110089"],
  "delhi::saket": ["110017"],
  "delhi::karol-bagh": ["110005"],
  "delhi::lajpat-nagar": ["110024"],
  "delhi::pitampura": ["110034"],
  "delhi::janakpuri": ["110058"],
  "delhi::connaught-place": ["110001"],
  "delhi::vasant-kunj": ["110070"],
  "goa::panaji": ["403001"],
  "goa::margao": ["403601"],
  "goa::vasco-da-gama": ["403802"],
  "goa::mapusa": ["403507"],
  "goa::ponda": ["403401"],
  "gujarat::ahmedabad": ["380001", "380006", "380009", "380015", "380054"],
  "gujarat::surat": ["395003", "395007", "395009"],
  "gujarat::vadodara": ["390001", "390007", "390019"],
  "gujarat::rajkot": ["360001", "360005"],
  "gujarat::gandhinagar": ["382010"],
  "gujarat::bhavnagar": ["364001"],
  "gujarat::jamnagar": ["361001"],
  "gujarat::junagadh": ["362001"],
  "gujarat::anand": ["388001"],
  "gujarat::mehsana": ["384002"],
  "haryana::gurugram": ["122001", "122002", "122009", "122018"],
  "haryana::faridabad": ["121001", "121002", "121006"],
  "haryana::panipat": ["132103"],
  "haryana::ambala": ["134003"],
  "haryana::hisar": ["125001"],
  "haryana::karnal": ["132001"],
  "haryana::sonipat": ["131001"],
  "haryana::rohtak": ["124001"],
  "haryana::panchkula": ["134109"],
  "himachal-pradesh::shimla": ["171001"],
  "himachal-pradesh::dharamshala": ["176215"],
  "himachal-pradesh::solan": ["173212"],
  "himachal-pradesh::mandi": ["175001"],
  "himachal-pradesh::kullu": ["175101"],
  "himachal-pradesh::bilaspur": ["174001"],
  "jammu-and-kashmir::srinagar": ["190001"],
  "jammu-and-kashmir::jammu": ["180001", "180012"],
  "jammu-and-kashmir::anantnag": ["192101"],
  "jammu-and-kashmir::baramulla": ["193101"],
  "jammu-and-kashmir::udhampur": ["182101"],
  "jammu-and-kashmir::pulwama": ["192301"],
  "jharkhand::ranchi": ["834001", "834002", "834008"],
  "jharkhand::jamshedpur": ["831001", "831011"],
  "jharkhand::dhanbad": ["826001"],
  "jharkhand::bokaro-steel-city": ["827004"],
  "jharkhand::hazaribagh": ["825301"],
  "jharkhand::deoghar": ["814112"],
  "karnataka::bengaluru": ["560001", "560002", "560003", "560004", "560037", "560066", "560100"],
  "karnataka::mysuru": ["570001", "570008"],
  "karnataka::hubballi": ["580020", "580029"],
  "karnataka::mangaluru": ["575001", "575003"],
  "karnataka::belagavi": ["590001"],
  "karnataka::davanagere": ["577001"],
  "karnataka::ballari": ["583101"],
  "karnataka::shivamogga": ["577201"],
  "karnataka::tumakuru": ["572101"],
  "karnataka::udupi": ["576101"],
  "kerala::thiruvananthapuram": ["695001", "695010", "695024"],
  "kerala::kochi": ["682001", "682002", "682016", "682024", "682036"],
  "kerala::kozhikode": ["673001", "673004"],
  "kerala::thrissur": ["680001"],
  "kerala::kollam": ["691001"],
  "kerala::palakkad": ["678001"],
  "kerala::alappuzha": ["688001"],
  "kerala::kannur": ["670001"],
  "kerala::kottayam": ["686001"],
  "ladakh::leh": ["194101"],
  "ladakh::kargil": ["191102"],
  "lakshadweep::kavaratti": ["682555"],
  "madhya-pradesh::bhopal": ["462001", "462016", "462039"],
  "madhya-pradesh::indore": ["452001", "452010", "452018"],
  "madhya-pradesh::jabalpur": ["482001", "482002"],
  "madhya-pradesh::gwalior": ["474001", "474011"],
  "madhya-pradesh::ujjain": ["456001"],
  "madhya-pradesh::sagar": ["470001"],
  "madhya-pradesh::dewas": ["455001"],
  "madhya-pradesh::satna": ["485001"],
  "madhya-pradesh::ratlam": ["457001"],
  "maharashtra::mumbai": ["400001", "400005", "400008", "400014", "400022", "400050", "400053", "400058", "400064", "400076", "400092"],
  "maharashtra::pune": ["411001", "411005", "411028", "411038", "411045", "411057"],
  "maharashtra::nagpur": ["440001", "440010", "440022"],
  "maharashtra::thane": ["400601", "400607", "400610"],
  "maharashtra::nashik": ["422001", "422005"],
  "maharashtra::aurangabad": ["431001"],
  "maharashtra::navi-mumbai": ["400703", "400614", "410210"],
  "maharashtra::solapur": ["413001"],
  "maharashtra::amravati": ["444601"],
  "maharashtra::kolhapur": ["416001"],
  "maharashtra::nanded": ["431601"],
  "maharashtra::sangli": ["416416"],
  "manipur::imphal": ["795001"],
  "manipur::thoubal": ["795138"],
  "manipur::churachandpur": ["795128"],
  "meghalaya::shillong": ["793001"],
  "meghalaya::tura": ["794001"],
  "meghalaya::nongstoin": ["793119"],
  "mizoram::aizawl": ["796001"],
  "mizoram::lunglei": ["796701"],
  "mizoram::champhai": ["796321"],
  "nagaland::kohima": ["797001"],
  "nagaland::dimapur": ["797112"],
  "nagaland::mokokchung": ["798601"],
  "odisha::bhubaneswar": ["751001", "751007", "751024", "751030"],
  "odisha::cuttack": ["753001"],
  "odisha::rourkela": ["769001"],
  "odisha::brahmapur": ["760001"],
  "odisha::sambalpur": ["768001"],
  "odisha::puri": ["752001"],
  "odisha::balasore": ["756001"],
  "puducherry::puducherry": ["605001", "605008", "605013"],
  "puducherry::karaikal": ["609602"],
  "puducherry::mahe": ["673310"],
  "puducherry::yanam": ["533464"],
  "punjab::ludhiana": ["141001", "141002", "141010"],
  "punjab::amritsar": ["143001", "143005"],
  "punjab::jalandhar": ["144001"],
  "punjab::patiala": ["147001"],
  "punjab::mohali": ["160055", "160062"],
  "punjab::bathinda": ["151001"],
  "punjab::hoshiarpur": ["146001"],
  "punjab::batala": ["143505"],
  "rajasthan::jaipur": ["302001", "302012", "302017", "302020"],
  "rajasthan::jodhpur": ["342001", "342003"],
  "rajasthan::udaipur": ["313001"],
  "rajasthan::kota": ["324001", "324005"],
  "rajasthan::bikaner": ["334001"],
  "rajasthan::ajmer": ["305001"],
  "rajasthan::bharatpur": ["321001"],
  "rajasthan::alwar": ["301001"],
  "rajasthan::sikar": ["332001"],
  "rajasthan::bhilwara": ["311001"],
  "sikkim::gangtok": ["737101"],
  "sikkim::namchi": ["737126"],
  "sikkim::gyalshing": ["737111"],
  "tamil-nadu::chennai": ["600001", "600002", "600017", "600020", "600040", "600042", "600119"],
  "tamil-nadu::coimbatore": ["641001", "641012", "641045"],
  "tamil-nadu::madurai": ["625001", "625010"],
  "tamil-nadu::tiruchirappalli": ["620001"],
  "tamil-nadu::salem": ["636001"],
  "tamil-nadu::tirunelveli": ["627001"],
  "tamil-nadu::erode": ["638001"],
  "tamil-nadu::vellore": ["632001"],
  "tamil-nadu::thoothukudi": ["628001"],
  "tamil-nadu::thanjavur": ["613001"],
  "telangana::hyderabad": ["500001", "500003", "500016", "500032", "500081", "500084"],
  "telangana::warangal": ["506002"],
  "telangana::nizamabad": ["503001"],
  "telangana::karimnagar": ["505001"],
  "telangana::khammam": ["507001"],
  "telangana::ramagundam": ["505208"],
  "telangana::mahbubnagar": ["509001"],
  "tripura::agartala": ["799001"],
  "tripura::udaipur": ["799120"],
  "tripura::dharmanagar": ["799250"],
  "uttar-pradesh::lucknow": ["226001", "226010", "226016", "226024"],
  "uttar-pradesh::kanpur": ["208001", "208012"],
  "uttar-pradesh::noida": ["201301", "201304"],
  "uttar-pradesh::ghaziabad": ["201001", "201009", "201014"],
  "uttar-pradesh::varanasi": ["221001"],
  "uttar-pradesh::agra": ["282001", "282005"],
  "uttar-pradesh::prayagraj": ["211001"],
  "uttar-pradesh::meerut": ["250001", "250002"],
  "uttar-pradesh::bareilly": ["243001"],
  "uttar-pradesh::aligarh": ["202001"],
  "uttar-pradesh::gorakhpur": ["273001"],
  "uttar-pradesh::mathura": ["281001"],
  "uttarakhand::dehradun": ["248001", "248006"],
  "uttarakhand::haridwar": ["249401"],
  "uttarakhand::roorkee": ["247667"],
  "uttarakhand::haldwani": ["263139"],
  "uttarakhand::rudrapur": ["263153"],
  "uttarakhand::rishikesh": ["249201"],
  "uttarakhand::kotdwar": ["246149"],
  "west-bengal::kolkata": ["700001", "700016", "700019", "700029", "700064", "700091", "700156"],
  "west-bengal::howrah": ["711101"],
  "west-bengal::durgapur": ["713201"],
  "west-bengal::asansol": ["713301"],
  "west-bengal::siliguri": ["734001"],
  "west-bengal::bardhaman": ["713101"],
  "west-bengal::kharagpur": ["721301"],
  "west-bengal::malda": ["732101"],
  "west-bengal::baharampur": ["742101"],
};


export const BANK_NAMES = [] as const;

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Car loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

export const RESIDENCE_STATUSES = [
  "Owned by self", "Owned by spouse", "Owned by parents", "Rented with siblings",
  "Rented with family", "Rent and stay alone", "Paying Guest", "Hostel",
  "Company Provided", OTHER_OPTION,
] as const;

export const SALARY_MODES = [
  "Cash", "Cheque", "Electronically deposited-IMPS", "Electronically deposited-NFT/RTGS",
] as const;

export const COMPANY_TYPES = [
  "Private Limited", "Limited", "Partnership", "Proprietorship", "Government", OTHER_OPTION,
] as const;

export const BUSINESS_TYPES = [
  "Proprietorship", "Partnership Firm", "Privated Limited Company", "Public Limited Company",
  "Limited Liability Company", OTHER_OPTION,
] as const;

export const NATURE_OF_BUSINESS = [
  "Manufacture", "Trader/Wholesaler", "Retailer", "Service Provider", OTHER_OPTION,
] as const;

export const INDUSTRY_TYPES = [
  "Agriculture", "Automobiles", "Cement", "Chemical", "Computer", "Construction",
  "Consumer Durables", "Container & Packaging", "Durables", "Energy", "Food & Beverages",
  "Hardware Equipments", "Healthcare", "Household Products", "Industrial Projects", "Metals",
  "Paper", "Petroleum Products", "Plastic", "Rubber", "Textiles", OTHER_OPTION,
] as const;

export const BUSINESS_PLACE_STATUSES = [
  "Owned", "Rented", "Leased", "Shared", OTHER_OPTION,
] as const;

export const PROFESSIONS = [
  "Doctor", "Chartered Accountant", "Lawyer", "Architect", "Company Secretary",
  "Consultant", "Engineer", OTHER_OPTION,
] as const;

export const PERSONAL_EMPLOYMENT_TYPES = ["Salaried"] as const;

export const BUSINESS_EMPLOYMENT_TYPES = [
  "Self Employed - Business", "Self Employed - Professional",
] as const;

export const HOME_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const BUYING_PROPERTY_TYPES = [
  "New", "Under-construction", "Old-construction", OTHER_OPTION,
] as const;

export const COLLATERAL_PROPERTY_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const OD_CC_LIMIT_AGAINST_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", "Unsecured", OTHER_OPTION,
] as const;

export const LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const WORKING_CAPITAL_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const LEASE_RENTAL_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const OD_CC_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const NPA_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const GOLD_LOAN_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const FDI_EMPLOYMENT_TYPES = [
  "Self Employed - Business", "Self Employed - Professional",
] as const;

export const FDI_FUND_AGAINST_TYPES = [
  "Company Valuation", "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const PROJECT_TYPES = [
  "Construction Project", "Infrastructure Development", "Real Estate Development",
  "Manufacturing / Industrial Project", "Expansion Project", "Renewable Energy Project",
  OTHER_OPTION,
] as const;

export const VEHICLE_TYPES = [
  "Hatchback", "Sedan", "SUV", "MUV / MPV", "Luxury Car", "Two Wheeler", "Commercial Vehicle",
  OTHER_OPTION,
] as const;

export const TRANSMISSION_TYPES = [
  "Manual", "Automatic", OTHER_OPTION,
] as const;

export const VEHICLE_PURCHASE_TYPES = [
  "New Vehicle", "Used Vehicle", OTHER_OPTION,
] as const;

export const EDUCATION_COUNTRIES = [
  "India", "USA", "United Kingdom", "Canada", "Australia", "Germany", "Ireland",
  "Singapore", "New Zealand", OTHER_OPTION,
] as const;

export const FIELD_OF_STUDY = [
  "Engineering", "Medicine", "Management / MBA", "Computer Science / IT", "Law",
  "Arts & Humanities", "Science", "Commerce", OTHER_OPTION,
] as const;

export const ENROLLMENT_STATUSES = [
  "Admission Confirmed", "Admission Applied", "Yet to Apply", OTHER_OPTION,
] as const;

export const PARENT_RELATIONSHIPS = [
  "Father", "Mother", "Guardian", OTHER_OPTION,
] as const;

export const YES_NO = ["Yes", "No"] as const;

export const COMMERCIAL_PROPERTY_TYPES = [
  "Commercial", "Industrial", OTHER_OPTION,
] as const;

export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const HOME_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
] as const;

export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const PROJECT_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const CAR_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const EDUCATION_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const COMMERCIAL_PURCHASE_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LEASE_RENTAL_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LOAN_AGAINST_SHARE_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const NPA_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const GOLD_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const GOLD_LOAN_TYPES = [
  "Jewellery", "Coin", "Bar", OTHER_OPTION,
] as const;

export const GOLD_CARATS_JEWELRY = [
  "18 Karat", "20 Karat", "22 Karat", OTHER_OPTION,
] as const;

export const GOLD_CARATS_NON_JEWELRY = [
  "18 Karat", "22 Karat", "24 Karat", OTHER_OPTION,
] as const;

export const FDI_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const MASTERS = {
  states: INDIAN_STATES,
  banks: BANK_NAMES,
  existingLoanTypes: EXISTING_LOAN_TYPES,
  residenceStatuses: RESIDENCE_STATUSES,
  salaryModes: SALARY_MODES,
  companyTypes: COMPANY_TYPES,
  businessTypes: BUSINESS_TYPES,
  natureOfBusiness: NATURE_OF_BUSINESS,
  industryTypes: INDUSTRY_TYPES,
  businessPlaceStatuses: BUSINESS_PLACE_STATUSES,
  professions: PROFESSIONS,
  personalEmploymentTypes: PERSONAL_EMPLOYMENT_TYPES,
  businessEmploymentTypes: BUSINESS_EMPLOYMENT_TYPES,
  homeEmploymentTypes: HOME_EMPLOYMENT_TYPES,
  loanAgainstPropertyEmploymentTypes: LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES,
  workingCapitalEmploymentTypes: WORKING_CAPITAL_EMPLOYMENT_TYPES,
  leaseRentalEmploymentTypes: LEASE_RENTAL_EMPLOYMENT_TYPES,
  odCcEmploymentTypes: OD_CC_EMPLOYMENT_TYPES,
  loanAgainstShareEmploymentTypes: LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES,
  npaEmploymentTypes: NPA_EMPLOYMENT_TYPES,
  goldLoanEmploymentTypes: GOLD_LOAN_EMPLOYMENT_TYPES,
  fdiEmploymentTypes: FDI_EMPLOYMENT_TYPES,
  buyingPropertyTypes: BUYING_PROPERTY_TYPES,
  collateralPropertyTypes: COLLATERAL_PROPERTY_TYPES,
  fdiFundAgainstTypes: FDI_FUND_AGAINST_TYPES,
  odCcLimitAgainstTypes: OD_CC_LIMIT_AGAINST_TYPES,
  projectTypes: PROJECT_TYPES,
  vehicleTypes: VEHICLE_TYPES,
  transmissionTypes: TRANSMISSION_TYPES,
  vehiclePurchaseTypes: VEHICLE_PURCHASE_TYPES,
  educationCountries: EDUCATION_COUNTRIES,
  fieldOfStudy: FIELD_OF_STUDY,
  enrollmentStatuses: ENROLLMENT_STATUSES,
  parentRelationships: PARENT_RELATIONSHIPS,
  yesNo: YES_NO,
  commercialPropertyTypes: COMMERCIAL_PROPERTY_TYPES,
  personalLoanTenureYears: PERSONAL_LOAN_TENURE_YEARS,
  businessLoanTenureYears: BUSINESS_LOAN_TENURE_YEARS,
  homeLoanTenureYears: HOME_LOAN_TENURE_YEARS,
  loanAgainstPropertyTenureYears: LOAN_AGAINST_PROPERTY_TENURE_YEARS,
  projectLoanTenureYears: PROJECT_LOAN_TENURE_YEARS,
  carLoanTenureYears: CAR_LOAN_TENURE_YEARS,
  educationLoanTenureYears: EDUCATION_LOAN_TENURE_YEARS,
  workingCapitalTenureYears: WORKING_CAPITAL_TENURE_YEARS,
  commercialPurchaseTenureYears: COMMERCIAL_PURCHASE_TENURE_YEARS,
  leaseRentalTenureYears: LEASE_RENTAL_TENURE_YEARS,
  loanAgainstShareTenureYears: LOAN_AGAINST_SHARE_TENURE_YEARS,
  npaTenureYears: NPA_TENURE_YEARS,
  goldLoanTenureYears: GOLD_LOAN_TENURE_YEARS,
  goldLoanTypes: GOLD_LOAN_TYPES,
  goldCaratsJewelry: GOLD_CARATS_JEWELRY,
  goldCaratsNonJewelry: GOLD_CARATS_NON_JEWELRY,
  fdiTenureYears: FDI_TENURE_YEARS,
} as const;

export type Masters = {
  [K in Exclude<keyof typeof MASTERS, "banks">]: ReadonlyArray<(typeof MASTERS)[K][number]>;
} & {
  banks: readonly string[];
  citiesByState: CitiesByState;
  pincodesByLocation: PincodesByLocation;
};

export type MasterKey = keyof Masters;
