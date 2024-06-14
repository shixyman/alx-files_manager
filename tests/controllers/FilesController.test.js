import { tmpdir } from 'os';
import { join as joinPath } from 'path';
import { existsSync, readdirSync, unlinkSync, statSync } from 'fs';
import dbClient from '../../utils/db';

describe('+ FilesController', () => {
  const baseDir = `${process.env.FOLDER_PATH || ''}`.trim().length > 0
    ? process.env.FOLDER_PATH.trim()
    : joinPath(tmpdir(), DEFAULT_ROOT_FOLDER);
  const mockUser = {
    email: 'katakuri@bigmom.com',
    password: 'mochi_mochi_whole_cake',
  };
  /**
   * 3 sample files
   * + 1 -> file
   * + 2 -> folder
   * + 3 -> file for file 2
   */
  const mockFiles = [
    {
      name: 'manga_titles.txt',
      type: 'file',
      data: [
        '+ Darwin\'s Game',
        '+ One Piece',
        '+ My Hero Academia',
        '',
      ].join('\n'),
      b64Data() { return Buffer.from(this.data, 'utf-8').toString('base64'); },
    },
    {
      name: 'One_Piece',
      type: 'folder',
      data: '',
      b64Data() { return ''; },
    },
    {
      name: 'chapter_titles.md',
      type: 'file',
      data: [
        '+ Chapter 47: The skies above the capital',
        '+ Chapter 48: 20 years',
        '+ Chapter 49: The world you wish for',
        '+ Chapter 50: Honor',
        '+ Chapter 51: The shogun of Wano - Kozuki Momonosuke',
        '+ Chapter 52: New morning',
        '',
      ].join('\n'),
      b64Data() { return Buffer.from(this.data, 'utf-8').toString('base64'); },
    },
  ];
  let token = '';
  const emptyFolder = (name) => {
    if (!existsSync(name)) {
      return;
    }
    for (const fileName of readdirSync(name)) {
      const filePath = joinPath(name, fileName);
      if (statSync(filePath).isFile) {
        unlinkSync(filePath);
      } else {
        emptyFolder(filePath);
      }
    }
  };