export interface DistrictInfo {
  id: string;
  number: number;
  name: string;
  isCapital?: boolean;
  state: string;
  region: 'Northern' | 'Central' | 'Western' | 'Southern' | 'Coastal';
  headquarters: string;
  code: string;
  activeCentresCount?: number;
  activeCamerasCount?: number;
}

export interface StateInfo {
  number: number;
  name: string;
  capital: string;
  zone: 'South' | 'North' | 'West' | 'East' | 'Central' | 'North-East';
  code: string;
  totalDistricts?: number;
  isCovered: boolean;
}

// 38 DISTRICTS OF TAMIL NADU (EXACT USER SPECIFICATION)
export const TAMIL_NADU_DISTRICTS: DistrictInfo[] = [
  { id: 'ariyalur', number: 1, name: 'Ariyalur', state: 'Tamil Nadu', region: 'Central', headquarters: 'Ariyalur', code: 'TN-ARI' },
  { id: 'chengalpattu', number: 2, name: 'Chengalpattu', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Chengalpattu', code: 'TN-CGL' },
  { id: 'chennai', number: 3, name: 'Chennai', isCapital: true, state: 'Tamil Nadu', region: 'Northern', headquarters: 'Chennai (State Capital)', code: 'TN-CHE' },
  { id: 'coimbatore', number: 4, name: 'Coimbatore', state: 'Tamil Nadu', region: 'Western', headquarters: 'Coimbatore', code: 'TN-CBE' },
  { id: 'cuddalore', number: 5, name: 'Cuddalore', state: 'Tamil Nadu', region: 'Coastal', headquarters: 'Cuddalore', code: 'TN-CUD' },
  { id: 'dharmapuri', number: 6, name: 'Dharmapuri', state: 'Tamil Nadu', region: 'Western', headquarters: 'Dharmapuri', code: 'TN-DPI' },
  { id: 'dindigul', number: 7, name: 'Dindigul', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Dindigul', code: 'TN-DGL' },
  { id: 'erode', number: 8, name: 'Erode', state: 'Tamil Nadu', region: 'Western', headquarters: 'Erode', code: 'TN-ERO' },
  { id: 'kallakurichi', number: 9, name: 'Kallakurichi', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Kallakurichi', code: 'TN-KLK' },
  { id: 'kanchipuram', number: 10, name: 'Kanchipuram', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Kanchipuram', code: 'TN-KCH' },
  { id: 'kanyakumari', number: 11, name: 'Kanyakumari', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Nagercoil', code: 'TN-KKI' },
  { id: 'karur', number: 12, name: 'Karur', state: 'Tamil Nadu', region: 'Central', headquarters: 'Karur', code: 'TN-KRR' },
  { id: 'krishnagiri', number: 13, name: 'Krishnagiri', state: 'Tamil Nadu', region: 'Western', headquarters: 'Krishnagiri', code: 'TN-KGI' },
  { id: 'madurai', number: 14, name: 'Madurai', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Madurai', code: 'TN-MDU' },
  { id: 'mayiladuthurai', number: 15, name: 'Mayiladuthurai', state: 'Tamil Nadu', region: 'Coastal', headquarters: 'Mayiladuthurai', code: 'TN-MYD' },
  { id: 'nagapattinam', number: 16, name: 'Nagapattinam', state: 'Tamil Nadu', region: 'Coastal', headquarters: 'Nagapattinam', code: 'TN-NGP' },
  { id: 'namakkal', number: 17, name: 'Namakkal', state: 'Tamil Nadu', region: 'Western', headquarters: 'Namakkal', code: 'TN-NMK' },
  { id: 'nilgiris', number: 18, name: 'Nilgiris', state: 'Tamil Nadu', region: 'Western', headquarters: 'Udhagamandalam (Ooty)', code: 'TN-NIL' },
  { id: 'perambalur', number: 19, name: 'Perambalur', state: 'Tamil Nadu', region: 'Central', headquarters: 'Perambalur', code: 'TN-PER' },
  { id: 'pudukkottai', number: 20, name: 'Pudukkottai', state: 'Tamil Nadu', region: 'Central', headquarters: 'Pudukkottai', code: 'TN-PUD' },
  { id: 'ramanathapuram', number: 21, name: 'Ramanathapuram', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Ramanathapuram', code: 'TN-RMD' },
  { id: 'ranipet', number: 22, name: 'Ranipet', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Ranipet', code: 'TN-RNP' },
  { id: 'salem', number: 23, name: 'Salem', state: 'Tamil Nadu', region: 'Western', headquarters: 'Salem', code: 'TN-SLM' },
  { id: 'sivaganga', number: 24, name: 'Sivaganga', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Sivaganga', code: 'TN-SVG' },
  { id: 'tenkasi', number: 25, name: 'Tenkasi', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Tenkasi', code: 'TN-TSI' },
  { id: 'thanjavur', number: 26, name: 'Thanjavur', state: 'Tamil Nadu', region: 'Central', headquarters: 'Thanjavur', code: 'TN-TNJ' },
  { id: 'theni', number: 27, name: 'Theni', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Theni', code: 'TN-THN' },
  { id: 'thoothukudi', number: 28, name: 'Thoothukudi', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Thoothukudi', code: 'TN-TKD' },
  { id: 'tiruchirappalli', number: 29, name: 'Tiruchirappalli', state: 'Tamil Nadu', region: 'Central', headquarters: 'Tiruchirappalli (Trichy)', code: 'TN-TRI' },
  { id: 'tirunelveli', number: 30, name: 'Tirunelveli', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Tirunelveli', code: 'TN-TNV' },
  { id: 'tirupattur', number: 31, name: 'Tirupattur', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Tirupattur', code: 'TN-TPR' },
  { id: 'tiruppur', number: 32, name: 'Tiruppur', state: 'Tamil Nadu', region: 'Western', headquarters: 'Tiruppur', code: 'TN-TUP' },
  { id: 'tiruvallur', number: 33, name: 'Tiruvallur', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Tiruvallur', code: 'TN-TVL' },
  { id: 'tiruvannamalai', number: 34, name: 'Tiruvannamalai', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Tiruvannamalai', code: 'TN-TVM' },
  { id: 'tiruvarur', number: 35, name: 'Tiruvarur', state: 'Tamil Nadu', region: 'Central', headquarters: 'Tiruvarur', code: 'TN-TVR' },
  { id: 'vellore', number: 36, name: 'Vellore', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Vellore', code: 'TN-VEL' },
  { id: 'viluppuram', number: 37, name: 'Viluppuram', state: 'Tamil Nadu', region: 'Northern', headquarters: 'Viluppuram', code: 'TN-VLP' },
  { id: 'virudhunagar', number: 38, name: 'Virudhunagar', state: 'Tamil Nadu', region: 'Southern', headquarters: 'Virudhunagar', code: 'TN-VRD' },
];

// ALL 28 INDIAN STATES AND CAPITALS (EXACT USER SPECIFICATION)
export const INDIAN_STATES: StateInfo[] = [
  { number: 1, name: 'Andhra Pradesh', capital: 'Amaravati', zone: 'South', code: 'AP', totalDistricts: 26, isCovered: true },
  { number: 2, name: 'Arunachal Pradesh', capital: 'Itanagar', zone: 'North-East', code: 'AR', totalDistricts: 26, isCovered: true },
  { number: 3, name: 'Assam', capital: 'Dispur', zone: 'North-East', code: 'AS', totalDistricts: 35, isCovered: true },
  { number: 4, name: 'Bihar', capital: 'Patna', zone: 'East', code: 'BR', totalDistricts: 38, isCovered: true },
  { number: 5, name: 'Chhattisgarh', capital: 'Raipur', zone: 'Central', code: 'CG', totalDistricts: 33, isCovered: true },
  { number: 6, name: 'Goa', capital: 'Panaji', zone: 'West', code: 'GA', totalDistricts: 2, isCovered: true },
  { number: 7, name: 'Gujarat', capital: 'Gandhinagar', zone: 'West', code: 'GJ', totalDistricts: 33, isCovered: true },
  { number: 8, name: 'Haryana', capital: 'Chandigarh', zone: 'North', code: 'HR', totalDistricts: 22, isCovered: true },
  { number: 9, name: 'Himachal Pradesh', capital: 'Shimla', zone: 'North', code: 'HP', totalDistricts: 12, isCovered: true },
  { number: 10, name: 'Jharkhand', capital: 'Ranchi', zone: 'East', code: 'JH', totalDistricts: 24, isCovered: true },
  { number: 11, name: 'Karnataka', capital: 'Bengaluru', zone: 'South', code: 'KA', totalDistricts: 31, isCovered: true },
  { number: 12, name: 'Kerala', capital: 'Thiruvananthapuram', zone: 'South', code: 'KL', totalDistricts: 14, isCovered: true },
  { number: 13, name: 'Madhya Pradesh', capital: 'Bhopal', zone: 'Central', code: 'MP', totalDistricts: 55, isCovered: true },
  { number: 14, name: 'Maharashtra', capital: 'Mumbai', zone: 'West', code: 'MH', totalDistricts: 36, isCovered: true },
  { number: 15, name: 'Manipur', capital: 'Imphal', zone: 'North-East', code: 'MN', totalDistricts: 16, isCovered: true },
  { number: 16, name: 'Meghalaya', capital: 'Shillong', zone: 'North-East', code: 'ML', totalDistricts: 12, isCovered: true },
  { number: 17, name: 'Mizoram', capital: 'Aizawl', zone: 'North-East', code: 'MZ', totalDistricts: 11, isCovered: true },
  { number: 18, name: 'Nagaland', capital: 'Kohima', zone: 'North-East', code: 'NL', totalDistricts: 16, isCovered: true },
  { number: 19, name: 'Odisha', capital: 'Bhubaneswar', zone: 'East', code: 'OD', totalDistricts: 30, isCovered: true },
  { number: 20, name: 'Punjab', capital: 'Chandigarh', zone: 'North', code: 'PB', totalDistricts: 23, isCovered: true },
  { number: 21, name: 'Rajasthan', capital: 'Jaipur', zone: 'North', code: 'RJ', totalDistricts: 50, isCovered: true },
  { number: 22, name: 'Sikkim', capital: 'Gangtok', zone: 'North-East', code: 'SK', totalDistricts: 6, isCovered: true },
  { number: 23, name: 'Tamil Nadu', capital: 'Chennai', zone: 'South', code: 'TN', totalDistricts: 38, isCovered: true },
  { number: 24, name: 'Telangana', capital: 'Hyderabad', zone: 'South', code: 'TG', totalDistricts: 33, isCovered: true },
  { number: 25, name: 'Tripura', capital: 'Agartala', zone: 'North-East', code: 'TR', totalDistricts: 8, isCovered: true },
  { number: 26, name: 'Uttar Pradesh', capital: 'Lucknow', zone: 'North', code: 'UP', totalDistricts: 75, isCovered: true },
  { number: 27, name: 'Uttarakhand', capital: 'Dehradun', zone: 'North', code: 'UK', totalDistricts: 13, isCovered: true },
  { number: 28, name: 'West Bengal', capital: 'Kolkata', zone: 'East', code: 'WB', totalDistricts: 23, isCovered: true },
];

export const getDistrictsForState = (stateName: string): string[] => {
  if (stateName === 'Tamil Nadu' || stateName.toLowerCase() === 'tamilnadu') {
    return TAMIL_NADU_DISTRICTS.map(d => d.name);
  }
  return [
    'Central Capital District',
    'North Industrial Zone',
    'South Technical Corridor',
    'East Skill Sector',
    'West Regional Hub'
  ];
};

export const getDistrictByName = (name: string): DistrictInfo | undefined => {
  return TAMIL_NADU_DISTRICTS.find(d => d.name.toLowerCase() === name.toLowerCase());
};

export const getStateByName = (name: string): StateInfo | undefined => {
  return INDIAN_STATES.find(s => s.name.toLowerCase() === name.toLowerCase());
};
