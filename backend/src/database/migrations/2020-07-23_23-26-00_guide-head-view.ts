import PostTypeId from 'data/PostTypeId'
import {ModuleRef} from "@nestjs/core";
import {Sequelize} from "sequelize-typescript";

export async function up(moduleRef: ModuleRef, sequelize: Sequelize) {
    await
        sequelize.query(
                `
                    DROP TABLE IF EXISTS GuideHeadLink;
                    CREATE OR REPLACE VIEW GuideHeadLink
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
    await sequelize.query(
        `
                DROP TABLE IF EXISTS GuideHead;
                CREATE OR REPLACE VIEW GuideHead
                AS
                select guideHistoryEntryId,
                       GHL.guideId,
                       count(DISTINCT C.id) as commentsCount,
                       count(DISTINCT V.upvoterId) as votesCount
                from GuideHeadLink GHL
left join Comment C
on GHL.guideId = C.postId
and C.postType = ${PostTypeId.Guide}
left join Vote V 
on V.postId = GHL.guideId and V.postTypeId = ${PostTypeId.Guide}
group by GHL.guideId
        `
    );
}

export async function down(moduleRef: ModuleRef, sequelize: Sequelize) {
    await sequelize.query(
        `
            DROP TABLE IF EXISTS GuideHead;
        `
    )
    await sequelize.query(
        `
            DROP TABLE IF EXISTS GuideHeadLink;
        `
    )
}
