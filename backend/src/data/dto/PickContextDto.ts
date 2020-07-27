interface PickContextDto {
    allyComp: (string | null)[]
    enemyComp: (string | null)[]
    bans: string[]
    map: string | null
}

export default PickContextDto;