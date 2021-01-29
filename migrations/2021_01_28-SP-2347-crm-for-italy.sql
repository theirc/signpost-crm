/*Note: the original plan was to add a language column to the users table so the CRM would support both Spanish and English, however due to extreme time constraints, this couldn't be, so instead all the static content in the CRM has been translated to English.*/

/*Adding languages column*/
/*ALTER TABLE users ADD `language` varchar(2) DEFAULT NULL NULL;*/

/*Defaulting current users to el-salvador*/
update users set /*`language`='es',*/ country='el-salvador';

/*Adding Italy users*/
INSERT INTO `users`
(`username`,`name`,`lastname`,`initials`,`country`,`role`,`createdAt`,`updatedAt`)
VALUES
('Camilla.fabozzi@rescue.org', 'Camilla', 'Fabozzi', 'CF', 'italy','ADMIN',NOW(),NOW()),
('Alice.tramontano@rescue.org', 'Alice', 'Tramontano', 'AT', 'italy','ADMIN',NOW(),NOW()),
('henri_nd88@yahoo.com', 'Henri', '', 'H', 'italy','ADMIN',NOW(),NOW()),
('cheikh.gueye@rescue.org', 'Cheikh', 'Gueye', 'CG', 'italy','ADMIN',NOW(),NOW()),
('Khadidiatou.sylla@rescue.org', 'Khadidiatou', 'Sylla', 'KS', 'italy','ADMIN',NOW(),NOW());


/*Defaulting existing categories to el-salvador*/
update categories set country='el-salvador' where country='e-salvador';

/*Adding categories*/
INSERT INTO `categories`
(`name`,`country`,`enabled`,`createdAt`,`updatedAt`)
VALUES
('Asylum Procedures', 'italy', 1, NOW(), NOW()),
('Permits of Stay', 'italy', 1, NOW(), NOW()),
('Documents', 'italy', 1, NOW(), NOW()),
('Work', 'italy', 1, NOW(), NOW()),
('Travel', 'italy', 1, NOW(), NOW()),
('Dublin Regulation', 'italy', 1, NOW(), NOW()),
('Legal Assistance', 'italy', 1, NOW(), NOW()),
('Health', 'italy', 1, NOW(), NOW()),
('Mental Health', 'italy', 1, NOW(), NOW()),
('Housing', 'italy', 1, NOW(), NOW()),
('Covid19', 'italy', 1, NOW(), NOW()),
('Financial Issues', 'italy', 1, NOW(), NOW()),
('Education', 'italy', 1, NOW(), NOW()),
('Family Reunification', 'italy', 1, NOW(), NOW()),
('AVRR', 'italy', 1, NOW(), NOW()),
('Child Protection', 'italy', 1, NOW(), NOW()),
('Women\'s Protection', 'italy', 1, NOW(), NOW()),
('Traficking', 'italy', 1, NOW(), NOW()),
('LGBTQI+', 'italy', 1, NOW(), NOW()),
('Other', 'italy', 1, NOW(), NOW()),
('Institutional Barriers', 'italy', 1, NOW(), NOW()),
('English', 'italy', 1, NOW(), NOW()),
('French', 'italy', 1, NOW(), NOW()),
('Other Language', 'italy', 1, NOW(), NOW()),
('Impact Stories', 'italy', 1, NOW(), NOW());