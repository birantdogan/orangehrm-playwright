import 'dotenv/config';

export const users = {
  validUser: {
    username: process.env.ORANGEHRM_USERNAME!,
    password: process.env.ORANGEHRM_PASSWORD!,
  },

  invalidUser: {
    username: 'InvalidUser',
    password: 'InvalidPassword',
  },

  emptyUser: {
    username: '',
    password: '',
  },
};

export const invalidLoginUsers = [
  {
    username: 'InvalidUser',
    password: 'InvalidPassword',
  },
  {
    username: process.env.ORANGEHRM_USERNAME!,
    password: 'InvalidPassword',
  },
];

export const emptyFieldUsers = [
  {
    username: '',
    password: process.env.ORANGEHRM_PASSWORD!,
    expectedField: 'username',
  },
  {
    username: process.env.ORANGEHRM_USERNAME!,
    password: '',
    expectedField: 'password',
  },
];

export const duplicateUserTestData = {
  username: 'Admin',
};