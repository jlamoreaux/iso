declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

export {}
