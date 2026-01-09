// storage-adapter-import-placeholder
import { s3Storage } from '@payloadcms/storage-s3'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/* -------------------------
 * COLLECTIONS
 * ------------------------- */
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Profiles } from './collections/Profiles'
import { Cohorts } from './collections/Cohorts'
import { Applications } from './collections/Applications'
import { Courses } from './collections/Courses'
import { Modules } from './collections/Modules'
import { Lessons } from './collections/Lessons'
import { JournalEntries } from './collections/JournalEntries'
import { Assignments } from './collections/Assignments'
import { Assessments } from './collections/Assessments'
import { Submissions } from './collections/Submissions'
import { Enrollments } from './collections/Enrollments'
import { Progress } from './collections/Progress'
import { SermonSeries } from './collections/SermonSeries'
import { SermonsMedia } from './collections/SermonsMedia'
import { Credentials } from './collections/Credentials'
import { PathwaysPhases } from './collections/PathwaysPhases'
import { PathwaysPrograms } from './collections/PathwaysPrograms'
import { Mentors } from './collections/Mentors'
import { Instructors } from './collections/Instructors'
import { LearnerProfiles } from './collections/LearnerProfiles'
import { WeeklyExperiences } from './collections/WeeklyExperiences'
import { Announcements } from './collections/Announcements'
import { UserNotifications } from './collections/UserNotifications'
import { Resources } from './collections/Resources'
import { PrayerRequests } from './collections/PrayerRequests'
import { Events } from './collections/Events'
import { Sessions } from './collections/Sessions'
import { EnrollmentAttendance } from './collections/EnrollmentAttendance'
import { FormationPractices } from './collections/FormationPractices'

/* NEW CONTENT COLLECTIONS */
import { Sermons } from './collections/Sermons'
import { Devotionals } from './collections/Devotionals'
import { BlogPosts } from './collections/BlogPosts'
import { Tags } from './collections/Tags'
import { APIKeys } from './collections/APIKeys'

/* -------------------------
 * GLOBALS
 * ------------------------- */
import { Settings } from './globals/Settings'
import { resolveUserEndpoint } from './endpoints/resolveUser'

/* -------------------------
 * PATH RESOLVING
 * ------------------------- */
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* -------------------------
 * S3 / R2 ADAPTERS
 * ------------------------- */

// MAIN MEDIA BUCKET (fwc-media)
const mediaAdapter = s3Storage({
  collections: {
    media: { prefix: 'media' },
  },
  bucket: process.env.MEDIA_S3_BUCKET!,
  config: {
    endpoint: process.env.MEDIA_S3_ENDPOINT!,
    region: process.env.MEDIA_S3_REGION!,
    credentials: {
      accessKeyId: process.env.MEDIA_S3_ACCESS_KEY!,
      secretAccessKey: process.env.MEDIA_S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  },
})

// LMS BUCKET (fwc-lms)
const lmsAdapter = s3Storage({
  collections: {
    courses: { prefix: 'courses' },
    modules: { prefix: 'modules' },
    lessons: { prefix: 'lessons' },
    assignments: { prefix: 'assignments' },
    submissions: { prefix: 'submissions' },
  },
  bucket: process.env.LMS_S3_BUCKET!,
  config: {
    endpoint: process.env.LMS_S3_ENDPOINT!,
    region: process.env.LMS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.LMS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.LMS_S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  },
})

// SERMONS BUCKET (fwc-sermons)
const sermonsAdapter = s3Storage({
  collections: {
    sermons: { prefix: 'sermons' },
  },
  bucket: process.env.SERMONS_S3_BUCKET!,
  config: {
    endpoint: process.env.SERMONS_S3_ENDPOINT!,
    region: process.env.SERMONS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.SERMONS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.SERMONS_S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  },
})

/* -------------------------
 * MAIN CONFIG (NO AUTH)
 * ------------------------- */
export default buildConfig({
  /* ---- ADMIN ---- */
  admin: {
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '— Freedom Worship Center CMS' },

    // 🔥 AUTH REMOVED — no `admin.user`
    // The admin UI will load in "no auth" mode.
  },

  /* ---- COLLECTIONS ---- */
  collections: [
    Users,
    Tags,
    Media,

    // PEOPLE & FORMATION
    Profiles,
    LearnerProfiles,
    Mentors,
    Instructors,

    // COMMUNITY
    Cohorts,
    Applications,

    // LMS
    Courses,
    Modules,
    Lessons,
    Assignments,
    Assessments,
    Submissions,
    Enrollments,
    Progress,
    JournalEntries,

    // ATTENDANCE & SESSIONS
    Sessions,
    EnrollmentAttendance,

    // PATHWAYS
    PathwaysPrograms,
    PathwaysPhases,
    WeeklyExperiences,
    FormationPractices,

    // CONTENT
    SermonSeries,
    SermonsMedia,
    Sermons,
    Devotionals,
    BlogPosts,
    Resources,

    // COMMUNICATION
    Events,
    PrayerRequests,
    Announcements,
    UserNotifications,

    // SYSTEM
    Credentials,
    APIKeys,
  ],

  /* ---- GLOBALS ---- */
  globals: [Settings],

  /* ---- ENDPOINTS --- */
  endpoints: [resolveUserEndpoint],

  /* ---- EDITOR ---- */
  editor: lexicalEditor(),

  /* ---- SECURITY ---- */
  secret: process.env.PAYLOAD_SECRET || 'fwc-default-secret',

  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fwc-web.vercel.app',
    'https://pathways.freedomwc.org',
    'https://freedomwc.org',
    'https://portal.freedomwc.org',
    'https://murfreesboro.freedomwc.org',
    'https://online.freedomwc.org',
    'https://nashville.freedomwc.org',
    'https://cms.freedomwc.org',
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fwc-web.vercel.app',
    'https://pathways.freedomwc.org',
    'https://freedomwc.org',
    'https://portal.freedomwc.org',
    'https://murfreesboro.freedomwc.org',
    'https://online.freedomwc.org',
    'https://nashville.freedomwc.org',
    'https://cms.freedomwc.org',
  ],

  /* ---- TYPESCRIPT ---- */
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  /* ---- DATABASE ---- */
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  /* ---- SHARP ---- */
  sharp,

  email: nodemailerAdapter({
    defaultFromAddress: 'cms@freedomwc.org',
    defaultFromName: 'Freedom Worship Center | CMS',

    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

  /* ---- STORAGE ADAPTERS ---- */
  plugins: [mediaAdapter, lmsAdapter, sermonsAdapter],
})
