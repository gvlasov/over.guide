import jetpack from "fs-jetpack";

export function checkMigrationDir(
    dirPath: string,
    migrationsPattern: RegExp
) {
    const contents = jetpack.list(dirPath);
    if (contents === undefined) {
        throw new Error('No directory ' + dirPath)
    }
    if (
        contents.filter(
            filepath => migrationsPattern.test(filepath)
        ).length === 0
    ) {
        throw new Error('No migration scripts present in directory ' + dirPath)
    }
}