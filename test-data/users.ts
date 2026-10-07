export const users = {
  validUser: {
    username: 'Admin',
    password: 'admin123',
  },

  invalidUser: {
    username: 'InvalidUser',
    password: 'InvalidPassword',
  },

  emptyUser: {
    username: '',
    password: '',
  }
};

export const invalidLoginUsers = [
  {
    username: 'InvalidUser',
    password: 'InvalidPassword',
  },
  {
    username: 'Admin',
    password: 'InvalidPassword',
  },
];

export const emptyFieldUsers = [
  {
    username: '',
    password: 'admin123',
    expectedField: 'username',
  },
  {
    username: 'Admin',
    password: '',
    expectedField: 'password',
  },
];