-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VacationSpot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `category` ENUM('beach', 'island', 'historical', 'adventure', 'nature', 'mountain', 'temple', 'city', 'luxury', 'culinary', 'shopping', 'festival', 'wildlife', 'wellness', 'family', 'nightlife', 'romantic', 'eco_tourism', 'rural', 'diving') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorite` (
    `user_id` INTEGER NOT NULL,
    `spot_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `spot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `user_id` INTEGER NOT NULL,
    `spot_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `spot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `spot_id` INTEGER NOT NULL,
    `rating` ENUM('one', 'two', 'three', 'four', 'five') NOT NULL,
    `review_text` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
