import { sqlQuest } from '../../config/database';
import * as bcrypt from 'bcrypt';
import Logger from '../../config/logger';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import Env from '../env';

export class GenericHelper {
  static generateId(length = 6, prefix = '', suffix = ''): string {
    const randomNumber = GenericHelper.generateRandomNumber(length);
    return `${prefix ? prefix + '-' : ''}${randomNumber}${
      suffix ? '-' + suffix : ''
    }`;
  }

  static generateAlId(length = 21) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

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

  static generateRandomSixDigitNumber() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hexadecimal digits

    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const sixDigitNumber = String(randomNumber).padStart(6, '0');
    return parseInt(sixDigitNumber.slice(0, 6));
  }

  static generateRandomFourDigitNumber() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hexadecimal digits

    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const fourDigitNumber = String(randomNumber).padStart(4, '0');
    return parseInt(fourDigitNumber.slice(0, 4));
  }

  static generateToken(data: object, expiresIn = '10m') {
    return jwt.sign(data, `${Env.get('CARDUVY_SECRET')}`, {
      expiresIn,
    });
  }

  static async hashText(text: string, saltRound: number) {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedText = await bcrypt.hash(text, salt);
    return { salt, hashedText };
  }

  static generateRandomNumber(length = 6) {
    if (length <= 0) {
      throw new Error('Length must be greater than 0');
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * It generates a random number for code.
   * @static
   * @memberof GenericHelper
   * @returns {String} - A unique string.
   */
  static generateRandomCode(al: number, bert: number) {
    return String(Math.floor(10000000 + Math.random() * 90000000)).slice(
      al,
      bert,
    );
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

  /**
   * It flattens nested structure of uploaded files
   * files keys/names for single file and multiple file uploads
   * @static
   * @param {object | string} fileNames
   * @memberof GenericHelper
   * @returns {String[]} - A string.array
   */
  //
  static uploadedFileNames(fileNames: object | string): string[] {
    const data = [];

    if (Array.isArray(fileNames) && fileNames.length !== 0) {
      for (const element of fileNames) {
        const [item] = Object.values(element);
        data.push(item);
      }
    }

    if (!fileNames.hasOwnProperty('length')) {
      const [item] = Object.values(fileNames);
      data.push(item);
    }

    return data;
  }
}
