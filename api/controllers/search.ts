import { type Request, type Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '~/config/database';
import Spam from '~/models/spam';
import { Contact, User } from '~/models/associations';

interface SearchResult {
  name: string
  phone_number: string
  spam_likelihood?: string
  contact_of?: string
  belongsTo?: 'user' | 'contact' | 'spam'
  type_id: string | number
}

export const findByName = async (req: Request<any, any, {
  name: string
}>, res: Response): Promise<void> => {
  const { name } = req.body;

  try {
    const usersPromise = User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      attributes: ['id', 'name', 'phone_number'],
      order: [
        [sequelize.fn('position', sequelize.literal(`'${name}' IN name`)), 'ASC'],
        [sequelize.fn('length', sequelize.col('name')), 'ASC']
      ]
    });

    const contactsPromise = Contact.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      attributes: ['id', 'name', 'phone_number'],
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name']
      }],
      order: [
        [sequelize.fn('position', sequelize.literal(`'${name}' IN "Contact"."name"`)), 'ASC'],
        [sequelize.fn('length', sequelize.col('"Contact"."name"')), 'ASC']
      ]
    });

    const [users, contacts] = await Promise.all([usersPromise, contactsPromise]);

    let results: SearchResult[] = [
      ...users.map(user => ({ ...user.toJSON(), belongsTo: 'user', type_id: user.id })),
      ...contacts.map(contact => ({
        name: contact.name,
        phone_number: contact.phone_number,
        contact_of: (contact as any).User.name,
        belongsTo: 'contact',
        type_id: contact.id
      }))
    ];

    results = await Promise.all(results.map(async result => {
      const spamReports = await Spam.count({
        where: { phone_number: result.phone_number }
      });
      const totalReports = await Spam.count();
      const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;

      return {
        name: result.name,
        phone_number: result.phone_number,
        spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
        belongsTo: result.belongsTo,
        type_id: result.type_id
      };
    }));

    res.json(results);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for users', error: error.message });
  }
};

export const findByNumber = async (req: Request<any, any, {
  phoneNumber: string
}>, res: Response): Promise<void> => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({
      where: { phone_number: phoneNumber },
      attributes: ['id', 'name', 'phone_number']
    });

    if (user != null) {
      const spamReports = await Spam.count({
        where: { phone_number: phoneNumber }
      });
      const totalReports = await Spam.count();
      const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;

      res.json({
        name: user.name,
        phone_number: user.phone_number,
        spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
        belongsTo: 'user',
        type_id: user.id
      });

      return;
    }

    const contacts = await Contact.findAll({
      where: { phone_number: phoneNumber },
      attributes: ['id', 'name', 'phone_number'],
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name']
      }]
    });

    if (contacts.length === 0) {
      const spams = await Spam.findAll({
        where: { phone_number: phoneNumber },
        attributes: ['id', 'phone_number', 'report_count']
      });

      if (spams.length > 0) {
        const results = spams.map(spam => ({
          phone_number: spam.phone_number,
          report_count: spam.report_count,
          spam_likelihood: '100%',
          belongsTo: 'spam',
          type_id: spam.id
        }));
        res.json(results);
        return;
      }
    }

    const results = await Promise.all(contacts.map(async contact => {
      const spamReports = await Spam.count({
        where: { phone_number: phoneNumber }
      });
      const totalReports = await Spam.count();
      const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;

      return {
        name: contact.name,
        phone_number: contact.phone_number,
        contact_of: (contact as any).User.name,
        spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
        belongsTo: 'contact',
        type_id: contact.id
      };
    }));

    res.json(results);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error searching by phone number', error: error.message });
  }
};

export const getPersonDetails = async (req: Request, res: Response): Promise<void> => {
  const { id, belongsTo } = req.params;

  try {
    let entity;
    if (belongsTo === 'user') {
      entity = await User.findByPk(id);
    } else if (belongsTo === 'contact') {
      entity = await Contact.findByPk(id, { include: [{ model: User, as: 'User' }] });
    } else if (belongsTo === 'spam') {
      entity = await Spam.findByPk(id);
    }

    if (entity == null) {
      res.status(404).json({ message: 'Entity not found.' });
    }

    res.json(entity);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving details', error: error.message });
  }
};
