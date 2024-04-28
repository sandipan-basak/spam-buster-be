const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function generateRandomUser () {
  const includeEmail = Math.random() > 0.6;
  return {
    name: faker.person.fullName(),
    email: includeEmail ? faker.internet.email() : null,
    phone_number: faker.phone.number(),       
    pw_hash: faker.internet.password(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  };
}

async function getAllRows (table, columns) {
  try {
    const { data, error } = await supabase.from(table).select(columns.join());
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    return [];
  }
}

function generateRandomContact () {
  const randomUserId = this.ids[Math.floor(Math.random() * this.ids.length)];

  const contactObject = {
    name: faker.person.fullName(),
    phone_number: faker.phone.number(),
    user_id: randomUserId,
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  }

  return contactObject;
}

function generateRandomSpam () {
  const allUserContactCombinedInfo = this.infoArray[Math.floor(Math.random() * this.infoArray.length)];

  const randomUserId = this.ids[Math.floor(Math.random() * this.ids.length)];

  const generateRandomNumber = Math.random() > 0.3;

  return {
    name: generateRandomNumber ? (Math.random() > 0.9 ? null : faker.person.fullName()) : allUserContactCombinedInfo.name,
    phone_number: generateRandomNumber ? faker.phone.number() : allUserContactCombinedInfo.phone_number,
    first_reported_by_user_id: randomUserId,
    report_count: Math.floor(Math.random() * 100),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  };
}

function generateRandomSpamReport(ids, spamData) {
  const randomUserId = ids[Math.floor(Math.random() * ids.length)];
  const spamReportedBy = spamData.report_count === 1 ? spamData.first_reported_by_user_id : randomUserId;
  return {
    marked_at: faker.date.past(),
    user_id: spamReportedBy,
    phone_number: spamData.phone_number,
  };
}


async function fillDb () {
  // generate random User Data
  const usersData = Array.from({ length: 1000 }, generateRandomUser);
  const {userError} = await supabase.from('Users').insert(usersData);
  if(userError) {
    console.log(userError);
  }

  const allUserInfo = await getAllRows('Users', ['id', 'phone_number', 'name']);
  const allUserIds = allUserInfo.map(user => user.id);

  const allContactInfo = await getAllRows('Contacts', ['phone_number', 'name']);

  const allPhoneNumbers = [
    ...allUserInfo.map(user => ({name: user.name, phone_number: user.phone_number})),
    ...allContactInfo.map(contact => ({contact: contact.name, phone_number: contact.phone_number})),
  ];

  const uniquePhoneNumbers = new Map();

  allPhoneNumbers.forEach(item => {
      if (!uniquePhoneNumbers.has(item.phone_number)) {
          uniquePhoneNumbers.set(item.phone_number, item.name);
      }
  });

  const uniquePhoneNumbersArray = Array.from(uniquePhoneNumbers).map(([phone_number, name]) => ({
    phone_number,
    name
  }));

  // generate random Contact Data
  const contactsData = Array.from({ length: 2000 }, generateRandomContact.bind({ids: allUserIds}));
  const {contactError} = await supabase.from('Contacts').insert(contactsData);
  if(contactError) {
    console.log(contactError);
  }

  // generate random Spam Data
  const spamsData = Array.from({ length: 20 }, generateRandomSpam.bind({ids: allUserIds, infoArray: uniquePhoneNumbersArray}));
  const {spamError} = await supabase.from('Spams').insert(spamsData);
  if(spamError) {
    console.log(spamError);
  }

  // generate Spam Report Data
  const allSpamInfo = await getAllRows('Spams', ['first_reported_by_user_id', 'phone_number', 'report_count']);
  const spamReportsData = allSpamInfo.map(spam => generateRandomSpamReport(allUserIds, spam));
  const {reportError} = await supabase.from('SpamReports').insert(spamReportsData);
  if (reportError) {
    console.log(reportError);
  }
}

fillDb().catch(err => { console.log(err); });

