export function selectRandom<T>(arr: T[], filter: (t: T) => boolean): T {
    const a = arr.filter(filter)
    return a[Math.floor(Math.random() * a.length)]
}

export function randomize<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5)
}
