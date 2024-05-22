import { sqlQuest } from '../../config/database';
import * as bcrypt from 'bcrypt';
import Logger from '../../config/logger';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import Env from '../env';

export class GenericHelper {
  static calcPages(total: number, limit: number): number {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  }

  static async paginateData(
    query: string,
    queryParams: any,
    page: number,
    limit: number,
  ): Promise<{ data: object[]; page: number; totalCount: number }> {
    const offset = (page - 1) * limit;

    const allData: object[] = await sqlQuest.manyOrNone(query, {
      ...queryParams,
    });

    const totalCount: number = allData.length;

    Logger.info(`Query params - ${JSON.stringify(queryParams)}`);

    query += ` OFFSET $/offset/ LIMIT $/limit/;`;
    const data = await sqlQuest.manyOrNone(query, {
      ...queryParams,
      offset,
      limit,
    });
    return {
      data,
      page,
      totalCount,
    };
  }

  static async paginatedData(
    resourceQuery: string,
    countQuery: string,
    page: number,
    limit: number,
    queryParams: any,
  ): Promise<{
    data: any[];
    currentPage: number;
    totalCount: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    // where queryParams is an array or an object
    if (Array.isArray(queryParams)) {
      queryParams.push(offset, limit);
    } else {
      queryParams.offset = offset;
      queryParams.limit = limit;

      resourceQuery += ` OFFSET $/offset/ LIMIT $/limit/;`;
    }

    const fetchCount = sqlQuest.oneOrNone(countQuery, queryParams);
    const fetchData = sqlQuest.manyOrNone(resourceQuery, queryParams);

    const [{ count }, data] = await Promise.all([fetchCount, fetchData]);
    const totalCount: number = count;
    const totalPages: number = GenericHelper.calcPages(totalCount, limit);

    return {
      data,
      currentPage: page,
      totalCount,
      totalPages,
    };
  }

  static capitalizeFirstLetter(word: string) {
    if (word.length === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  static generateToken(data: object, expiresIn = '10m') {
    return jwt.sign(data, `${Env.get('TODO_SECRET')}`, {
      expiresIn,
    });
  }

  static formatDateString = (dateString: string) => {
    // Create a Date object from the string
    const dateObject = new Date(dateString);

    // Extract year, month, and day
    const year = dateObject.getFullYear();
    // Note: Months are zero-based, so we add 1 to get the correct month
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    // Create the formatted date string in "yyyy-mm-dd" format
    const formattedDateString = year + '-' + month + '-' + day;
    return formattedDateString;
  };
}
