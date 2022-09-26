"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
async function up(moduleRef, sequelize) {
    await sequelize.query(`
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
            `);
    await sequelize.query(`
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
and C.postType = ${PostTypeId_1.default.Guide}
left join Vote V 
on V.postId = GHL.guideId and V.postTypeId = ${PostTypeId_1.default.Guide}
group by GHL.guideId
        `);
}
exports.up = up;
async function down(moduleRef, sequelize) {
    await sequelize.query(`
            DROP TABLE IF EXISTS GuideHead;
        `);
    await sequelize.query(`
            DROP TABLE IF EXISTS GuideHeadLink;
        `);
}
exports.down = down;
//# sourceMappingURL=2020-07-23_23-26-00_guide-head-view.js.map