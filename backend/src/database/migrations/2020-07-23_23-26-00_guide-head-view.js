async function up(database) {
    await
        database.sequelize.query(
                `
                    DROP TABLE IF EXISTS GuideHead;
                    CREATE VIEW GuideHead
                    AS
                    select guideHistoryEntryId,
                           guideId
                    from (
                             select id                                                                      as guideHistoryEntryId,
                                    guideId,
                                    ROW_NUMBER() over (w)                                                   as __row_number,
                                    COUNT(*)
                                          over (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as __row_count
                             from GuideHistoryEntry
                                 window w AS (partition by guideId order by id ASC)
                             order by id DESC
                         ) tbl
                    where __row_number = __row_count
            `
        );
}

async function down(queryInterface) {
    throw new Error('Downing not available')
}

module.exports = {up, down};