import User from '~/models/user';
import Contact from '~/models/contact';
import Spam from '~/models/spam';

User.hasMany(Contact, {
  foreignKey: 'user_id',
  as: 'contacts'
});

Contact.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'User'
});

// Spam.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'User'
// });

// Spam.belongsTo(Contact, {
//   foreignKey: 'contactId',
//   as: 'Contact'
// });

export { User, Contact, Spam };
