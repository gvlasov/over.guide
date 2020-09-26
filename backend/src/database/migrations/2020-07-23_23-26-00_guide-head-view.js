

async function up(database, guideEntityTypeId) {
    await
        database.sequelize.query(
                `
                    DROP TABLE IF EXISTS GuideHeadLink;
                    CREATE VIEW GuideHeadLink
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
    await database.sequelize.query(
        `
                DROP TABLE IF EXISTS GuideHead;
                CREATE VIEW GuideHead
                AS
                select guideHistoryEntryId,
                       GHL.guideId,
                       count(C.id) as commentsCount,
                       count(GV.upvoterId) as votesCount
                from GuideHeadLink GHL
left join Comment C
on GHL.guideId = C.parentId
and C.parentType = ${guideEntityTypeId}
left join GuideVote GV 
on GV.guideId = GHL.guideId
group by GHL.guideId
        `
    );
}

async function down(queryInterface) {
    throw new Error('Downing not available')
}

module.exports = {up, down};