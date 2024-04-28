import { type Request, type Response } from 'express';
import type User from '~/models/user';
import Spam from '~/models/spam';
import SpamReport from '~/models/spamreport';
import { sequelize } from '~/config/database';

export const reportSpam = async (req: Request<any, any, {
  phoneNumber: string
  name?: string
  user: User
}>, res: Response): Promise<void> => {
  const { phoneNumber, user, name } = req.body;

  try {
    const spamReportRecord = await SpamReport.findOne({
      where: {
        phone_number: phoneNumber,
        user_id: user.id
      }
    });

    if (spamReportRecord != null) {
      res.status(409).json({ message: 'You have already reported this number as spam.' });
      return;
    }

    let spamRecord = await Spam.findOne({ where: { phone_number: phoneNumber } });

    if (spamRecord != null) {
      spamRecord.report_count = (spamRecord.report_count ?? 0) + 1;
      await spamRecord.save();
    } else {
      spamRecord = await Spam.create({
        phone_number: phoneNumber,
        report_count: 1,
        name: name ?? null,
        first_reported_by_user_id: user.id
      });
    }

    await SpamReport.create({
      phone_number: phoneNumber,
      user_id: user.id
    });

    res.status(200).json({ message: 'Reported successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error reporting spam', error: error.message });
  }
};

export const removeSpamVote = async (req: Request<any, any, {
  phoneNumber: string
  user: User
}>, res: Response): Promise<void> => {
  const { phoneNumber, user } = req.body;

  try {
    const transaction = await sequelize.transaction();
    const spamRecord = await Spam.findOne({ where: { phone_number: phoneNumber } });

    if (spamRecord != null) {
      spamRecord.report_count = (spamRecord.report_count ?? 0);
      spamRecord.report_count -= spamRecord.report_count === 0 ? 0 : 1;

      const spamReport = await SpamReport.findOne({
        where: {
          phone_number: phoneNumber,
          user_id: user.id
        }
      });

      if (spamReport != null) {
        await Promise.all([
          spamReport.destroy(),
          spamRecord.save()
        ]);

        await transaction.commit();

        res.status(200).json({ message: 'Removed spam vote' });
      } else {
        await transaction.rollback();
        res.status(404).json({ message: 'Seems that your spam record was not found' });
      }
    } else {
      res.status(404).json({ message: 'Spam not found.' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error reporting spam', error: error.message });
  }
};
