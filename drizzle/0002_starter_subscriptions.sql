-- Migration: 0002_starter_subscriptions
-- Core Machine Starter plan: subscriptions + credits tables

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL,
  `plan` enum('starter','starter_yearly','pro','pro_monthly') NOT NULL,
  `stripeSubscriptionId` varchar(255),
  `stripeCustomerId` varchar(255),
  `status` enum('active','cancelled','expired','past_due') NOT NULL DEFAULT 'active',
  `currentPeriodStart` timestamp NULL,
  `currentPeriodEnd` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_subscriptions_openId` (`openId`),
  INDEX `idx_subscriptions_stripeCustomerId` (`stripeCustomerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `userCredits` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL,
  `balance` int NOT NULL DEFAULT 0,
  `totalUsed` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_userCredits_openId` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
