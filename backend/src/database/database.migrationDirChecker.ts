import jetpack from "fs-jetpack";

export function checkMigrationDir(
    dir: string,
    migrationsPattern: RegExp
) {
    if (
        jetpack.list(dir).filter(
            filepath => migrationsPattern.test(filepath)
        ).length === 0
    ) {
        throw new Error('No migration scripts present in directory ' + dir)
    }
}