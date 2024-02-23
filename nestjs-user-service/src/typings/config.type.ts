export type PostgresConfigType = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  type?: string;
};

export type GoogleAuthType = {
  googleClientId: string;
  googleClientSecret: string;
};

export type ConfigType = {
  postgres: PostgresConfigType;
  googleAuth: GoogleAuthType;
};
