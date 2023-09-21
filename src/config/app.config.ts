import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  APP_NAME: <string>process.env.APP_NAME,
  APP_DOMAIN: <string>process.env.APP_DOMAIN,
  APP_PORT: <number>parseInt(<string>process.env.APP_PORT),
  API_PATH: <string>process.env.API_PATH,
  DOCUMENT_URI: <string>process.env.DOCUMENT_URI,
  DOCUMENT_TITLE: <string>process.env.DOCUMENT_TITLE,
  DOCUMENT_TAG: <string>process.env.DOCUMENT_TAG,
  DOCUMENT_DESCRIPTION: <string>process.env.DOCUMENT_DESCRIPTION,
  DOCUMENT_VERSION: <string>process.env.DOCUMENT_VERSION,
  JWT_ACCESS_SECRET: <string>process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: <string>process.env.JWT_REFRESH_SECRET,
  SFTP_SYNC_VERSION: <string>process.env.SFTP_SYNC_VERSION,
  SFTP_HOST: <string>process.env.SFTP_HOST,
  SFTP_PORT: <string>process.env.SFTP_PORT,
  SFTP_PATH: <string>process.env.SFTP_PATH,
  SFTP_USERNAME: <string>process.env.SFTP_USERNAME,
  SFTP_PRIVATEKEY: <string>process.env.SFTP_PRIVATEKEY,
  SFTP_PASSPHRASE: <string>process.env.SFTP_PASSPHRASE,
}));
