CREATE TABLE IF NOT EXISTS `Games` (
    `code` VARCHAR(255) NOT NULL UNIQUE,
    `created` TIMESTAMP NOT NULL,
    `state` TEXT DEFAULT NULL,
    PRIMARY KEY (`code`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `game_code` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`game_code`) REFERENCES Games(`code`)
);
