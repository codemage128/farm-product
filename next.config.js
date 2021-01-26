const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = phase => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging = PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)

  const env = {
    MONGO_SRV: (() => {
      if (isDev) return "mongodb+srv://farmdoor:$o8V$u8rfV3TxY@fdprod-jqpf3.mongodb.net/FarmDoor?retryWrites=true&w=majority"
      // if (isProd) return "mongodb+srv://rtpdevuser:Fqt4Vad2GmT28jlG@rtpdev-yg7bt.mongodb.net/test?retryWrites=true&w=majority"
      if (isProd) return "mongodb+srv://farmdoor:$o8V$u8rfV3TxY@fdprod-jqpf3.mongodb.net/FarmDoor?retryWrites=true&w=majority"
      if (isStaging) return "mongodb+srv://farmdoor:$o8V$u8rfV3TxY@fdprod-jqpf3.mongodb.net/FarmDoor?retryWrites=true&w=majority"
      return 'MONGO_SRV:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    STRIPE_SECRET_KEY: (() => {
      if (isDev) return 'sk_test_CPnN8Q6ZDELYzRyx0ZRjXjD2'
      if (isProd) return 'sk_live_VGC3ANrfikcNIbjhmc8MArCJ'
      if (isStaging) return 'sk_test_CPnN8Q6ZDELYzRyx0ZRjXjD2'
      return 'STRIPE_SECRET_KEY:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    STRIPE_PUBLIC_KEY: (() => {
      if (isDev) return 'pk_test_b0tOqWZ4q3Qs45mtAxNZEcb5'
      if (isProd) return 'pk_live_uJ6lur7R4GmcuqWLaFfsny0Y'
      if (isStaging) return 'pk_test_b0tOqWZ4q3Qs45mtAxNZEcb5'
      return 'STRIPE_PUBLIC_KEY:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    STRIPE_ACCOUNT: (() => {
      if (isDev) return 'ca_CtU0LD2wmbdCdfKlGPrQiPrihRJjUMZs'
      if (isProd) return 'ca_CtU0dPoxdbCwkMKQgsnFLl7ziGPETK8M'
      if (isStaging) return 'ca_CtU0LD2wmbdCdfKlGPrQiPrihRJjUMZs'
      return 'STRIPE_ACCOUNT:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    CLOUDINARY_URL: (() => {
      if (isDev) return "https://api.cloudinary.com/v1_1/dmjkli4q4/image/upload"
      if (isProd) return "https://api.cloudinary.com/v1_1/dmjkli4q4/image/upload"
      if (isStaging) return "https://api.cloudinary.com/v1_1/dmjkli4q4/image/upload"
      return 'CLOUDINARY_URL:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    JWT_SECRET: (() => {
      if (isDev) return "what-a-day-to-crush-it"
      if (isProd) return "what-a-day-to-crush-it"
      if (isStaging) return "what-a-day-to-crush-it"
      return 'JWT_SECRET:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    EMAIL_ADDRESS: (() => {
      if (isDev) return "support@localdrop.org"
      if (isProd) return "support@localdrop.org"
      if (isStaging) return "support@localdrop.org"
      return 'EMAIL_ADDRESS:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    EMAIL_PASSWORD: (() => {
      if (isDev) return "TempPassToday123!"
      if (isProd) return "TempPassToday123!"
      if (isStaging) return "TempPassToday123!"
      return 'EMAIL_PASSWORD:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })()
  }

  // next.config.js object
  return {
    env,
  }
}