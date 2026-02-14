-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. NextAuth Tables
create table "Account" (
  "id" text not null,
  "userId" text not null,
  "type" text not null,
  "provider" text not null,
  "providerAccountId" text not null,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,

  constraint "Account_pkey" primary key ("id")
);

create table "Session" (
  "id" text not null,
  "sessionToken" text not null,
  "userId" text not null,
  "expires" timestamp(3) not null,

  constraint "Session_pkey" primary key ("id")
);

create table "User" (
  "id" text not null,
  "name" text,
  "email" text,
  "emailVerified" timestamp(3),
  "image" text,
  "password" text,
  
  -- Paddle Subscription Fields
  "paddleCustomerId" text,
  "paddleSubscriptionId" text,
  "paddlePriceId" text,
  "paddleCurrentPeriodEnd" timestamp(3),

  constraint "User_pkey" primary key ("id")
);

create table "VerificationToken" (
  "identifier" text not null,
  "token" text not null,
  "expires" timestamp(3) not null
);

-- 2. SEO Tool Tables
create table "Website" (
  "id" text not null,
  "userId" text not null,
  "url" text not null,
  "industry" text,
  "lastScanAt" timestamp(3),
  "lastScanScore" integer,
  "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP,

  constraint "Website_pkey" primary key ("id")
);

create table "ScanResult" (
  "id" text not null,
  "websiteId" text not null,
  "score" integer not null,
  "problems" jsonb not null,
  "fixes" jsonb not null,
  "scannedAt" timestamp(3) not null default CURRENT_TIMESTAMP,

  constraint "ScanResult_pkey" primary key ("id")
);

-- 3. Fiverr Market Tools
create table "FiverrGig" (
  "id" text not null,
  "userId" text not null,
  "gigUrl" text not null,
  "category" text,
  "lastAnalysisAt" timestamp(3),
  "lastAnalysisScore" integer,
  "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP,

  constraint "FiverrGig_pkey" primary key ("id")
);

create table "GigAnalysis" (
  "id" text not null,
  "gigId" text not null,
  "currentData" jsonb not null,
  "optimizedData" jsonb not null,
  "competitionLevel" text not null,
  "analyzedAt" timestamp(3) not null default CURRENT_TIMESTAMP,

  constraint "GigAnalysis_pkey" primary key ("id")
);

-- 4. Ranking History
create table "RankingHistory" (
  "id" text not null,
  "userId" text not null,
  "url" text not null,
  "keyword" text not null,
  "position" integer not null,
  "date" timestamp(3) not null default CURRENT_TIMESTAMP,
  "websiteId" text,
  "fiverrGigId" text,

  constraint "RankingHistory_pkey" primary key ("id")
);

-- 5. Indexes & Relations
create unique index "Account_provider_providerAccountId_key" on "Account"("provider", "providerAccountId");
create unique index "Session_sessionToken_key" on "Session"("sessionToken");
create unique index "User_email_key" on "User"("email");
create unique index "User_paddleCustomerId_key" on "User"("paddleCustomerId");
create unique index "User_paddleSubscriptionId_key" on "User"("paddleSubscriptionId");
create unique index "VerificationToken_token_key" on "VerificationToken"("token");
create unique index "VerificationToken_identifier_token_key" on "VerificationToken"("identifier", "token");
create index "RankingHistory_userId_date_idx" on "RankingHistory"("userId", "date");

-- Add Foreign Keys
alter table "Account" add constraint "Account_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade;
alter table "Session" add constraint "Session_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade;
alter table "Website" add constraint "Website_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade;
alter table "ScanResult" add constraint "ScanResult_websiteId_fkey" foreign key ("websiteId") references "Website"("id") on delete cascade on update cascade;
alter table "FiverrGig" add constraint "FiverrGig_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade;
alter table "GigAnalysis" add constraint "GigAnalysis_gigId_fkey" foreign key ("gigId") references "FiverrGig"("id") on delete cascade on update cascade;
alter table "RankingHistory" add constraint "RankingHistory_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade;
alter table "RankingHistory" add constraint "RankingHistory_websiteId_fkey" foreign key ("websiteId") references "Website"("id") on delete set null on update cascade;
alter table "RankingHistory" add constraint "RankingHistory_fiverrGigId_fkey" foreign key ("fiverrGigId") references "FiverrGig"("id") on delete set null on update cascade;
