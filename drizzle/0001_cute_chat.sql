CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`contact` varchar(255) NOT NULL,
	`email` varchar(320),
	`needs` text NOT NULL,
	`language` enum('zh-HK','zh-CN') NOT NULL DEFAULT 'zh-HK',
	`status` enum('pending','contacted','converted') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templateDownloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateType` enum('subsidy_application','personal_statement') NOT NULL,
	`language` enum('zh-HK','zh-CN') NOT NULL,
	`email` varchar(320),
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templateDownloads_id` PRIMARY KEY(`id`)
);
