SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS hero
(
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(32)  NOT NULL,
    role ENUM ('Tank', 'Damage', 'Support'),
    UNIQUE INDEX (id ASC),
    PRIMARY KEY (id)
) CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `matchup_evaluation`
(
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    subject_id INT UNSIGNED NOT NULL,
    object_id  INT UNSIGNED NOT NULL,
    score      INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (subject_id) REFERENCES hero (id),
    FOREIGN KEY (object_id) REFERENCES hero (id)

) CHARSET = utf8
  COLLATE = utf8_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
