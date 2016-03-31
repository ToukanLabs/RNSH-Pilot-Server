const patients = [{
	id: 1,
	mrn: 2345237,
	dob: '1964-02-12T00:00Z',
	firstname: 'Raphael',
	surname: 'Trueman',
	address: `95 Wallum Court
      TYALGUM
      NSW
      2484`,
	phone: '(02) 9372 4355',
	email: 'raphael.trueman@rnsh.pilot.com',
	gender: 'M',
	tumorType: 'Prostate',
	surgical: 'Y',
	allergies: [{
		name: 'Insulin',
		date: '2005-07-16'
	}, {
		name: 'Penicillin',
		date: '2005-07-16'
	}, {
		name: 'Dust',
		date: '1982-03-21'
	}, {
		name: 'Latex',
		date: '1986-11-02'
	}]
}, {
	id: 2,
	mrn: 2349675,
	dob: '1964-02-12T00:00Z',
	firstname: 'Jon',
	surname: 'Ingram',
	address: `89 Larissa Court
      COWANGIE
      VIC
      3506`,
	phone: '(02) 9372 6785',
	email: 'jon.ingram@rnsh.pilot.com',
	gender: 'M',
	tumorType: 'Prostate',
	surgical: 'N',
	allergies: null,
}, {
	id: 3,
	mrn: 9876345,
	dob: '1964-02-12T00:00Z',
	firstname: 'Anabelle',
	surname: 'Elliott',
	address: `35 Patton Street
      KOOYONG
      VIC
      3144`,
	phone: '(02) 9372 2342',
	email: 'anabelle.elliott@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: [{
		name: 'Peanuts',
		date: '2005-07-16'
	}, {
		name: 'Penicillin',
		date: '2005-07-16'
	}, ]
}, {
	id: 4,
	mrn: 3456234,
	dob: '1964-02-12T00:00Z',
	firstname: 'Gary',
	surname: 'Earl',
	address: `15 Mendooran Road
      CUMBOOGLE
      NSW
      2830`,
	phone: '(02) 9372 4567',
	email: 'gary.earl@rnsh.pilot.com',
	gender: 'M',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: [{
		name: 'Insulin',
		date: '2004-07-16'
	}]
}, {
	id: 5,
	mrn: 1276543,
	dob: '1964-02-12T00:00Z',
	firstname: 'Madonna',
	surname: 'Dawson',
	address: `83 Inglewood Court
      PASTORIA
      VIC
      3444`,
	phone: '(02) 9372 6234',
	email: 'madonna.dawson@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'CNS',
	surgical: 'N',
	allergies: []
}, {
	id: 6,
	mrn: 3456734,
	dob: '1964-02-12T00:00Z',
	firstname: 'Felix',
	surname: 'Sudworth',
	address: `10 Carolina Park Road
      PATONGA
      NSW
      2256`,
	phone: '(02) 9372 5555',
	email: 'felix.sudworth@rnsh.pilot.com',
	gender: 'M',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: [{
		name: 'Latex',
		date: '1999-10-02'
	}, {
		name: 'Dust',
		date: '1998-10-03'
	}, {
		name: 'Mold',
		date: '2001-07-27'
	}]
}, {
	id: 7,
	mrn: 3334526,
	dob: '1964-02-12T00:00Z',
	firstname: 'Bill',
	surname: 'Snoogie',
	address: `45 Farrar Parade
      JURIEN BAY
      WA
      6516`,
	phone: '(02) 9372 3335',
	email: 'bill.snoogie@rnsh.pilot.com',
	gender: 'M',
	tumorType: 'Prostate',
	surgical: 'N',
	allergies: []
}, {
	id: 8,
	mrn: 3452777,
	dob: '1964-02-12T00:00Z',
	firstname: 'Lenora',
	surname: 'Christians',
	address: `61 Eungella Road
      HOME HILL
      QLD
      4806`,
	phone: '(02) 9372 9000',
	email: 'lenora.christians@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: [{
		name: 'Latex',
		date: '1999-10-02'
	}, {
		name: 'Dust',
		date: '1998-10-03'
	}, {
		name: 'Mold',
		date: '2001-07-27'
	}]
}, {
	id: 9,
	mrn: 3334521,
	dob: '1964-02-12T00:00Z',
	firstname: 'Karlene',
	surname: 'Cotterill',
	address: `51 Savages Road
      PARKINSON
      QLD
      4115`,
	phone: '(02) 9372 0078',
	email: 'karlene.cotterill@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: null
}, {
	id: 10,
	mrn: 9878776,
	dob: '1964-02-12T00:00Z',
	firstname: 'Kelcey',
	surname: 'Walker',
	address: `85 Zipfs Road
      FLINDERS VIEW
      QLD
      4305`,
	phone: '(02) 9372 6745',
	email: 'kelcey.walker@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'CNS',
	surgical: 'Y',
	allergies: [{
		name: 'Peanuts',
		date: '2005-07-16'
	}, {
		name: 'Latex',
		date: '1999-10-02'
	}, {
		name: 'Insulin',
		date: '2004-07-16'
	}]
}, {
	id: 11,
	mrn: 9874521,
	dob: '1964-02-12T00:00Z',
	firstname: 'Frederick',
	surname: 'Corkhill',
	address: `23 Bread Road
      EVERTON
      QLD
      4115`,
	phone: '(02) 2342 0078',
	email: 'frederick.corkhill@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'Breast',
	surgical: 'Y',
	allergies: [{
		name: 'Penicillin',
		date: '2005-07-16'
	}]
}, {
	id: 12,
	mrn: 8454521,
	dob: '1964-02-12T00:00Z',
	firstname: 'Simone',
	surname: 'Redic',
	address: `51 Savages Road
      PARKINSON
      QLD
      4115`,
	phone: '(02) 9372 0078',
	email: 'timothy.redick@rnsh.pilot.com',
	gender: 'F',
	tumorType: 'Breast',
	surgical: 'Y',
	allergies: []
}, {
	id: 13,
	mrn: 6574521,
	dob: '1964-02-12T00:00Z',
	firstname: 'Louise',
	surname: 'Gregory',
	address: `51 Savages Road
      PARKINSON
      QLD
      4115`,
  phone: '(02) 9372 0078',
  email: 'louise.gg@rnsh.pilot.com',
  gender: 'F',
  tumorType: 'Breast',
  surgical: 'Y',
  allergies: [{
		name: 'Latex',
		date: '1999-10-02'
	}]
}];

export default patients;
